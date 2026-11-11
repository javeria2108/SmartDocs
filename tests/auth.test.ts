import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { canAccessDocument, assertDocumentAccess } from '../lib/permissions';

test('document permissions separate owners, editors, viewers, and unrelated identities', () => {
  const room = { metadata: { creatorId: 'owner' }, usersAccesses: {
    owner: ['room:write'], editor: ['room:write'], viewer: ['room:read', 'room:presence:write'],
  } };
  assert.equal(canAccessDocument(room, 'owner', 'owner'), true);
  assert.equal(canAccessDocument(room, 'editor', 'write'), true);
  assert.equal(canAccessDocument(room, 'editor', 'owner'), false);
  assert.equal(canAccessDocument(room, 'viewer', 'read'), true);
  assert.equal(canAccessDocument(room, 'viewer', 'write'), false);
  assert.equal(canAccessDocument(room, 'outsider'), false);
  assert.throws(() => assertDocumentAccess(room, 'outsider'));
  const legacyRoom = { metadata: { creatorId: 'user_old_clerk_id', email: 'owner@example.com' }, usersAccesses: { 'owner@example.com': ['room:write'] } };
  assert.equal(canAccessDocument(legacyRoom, 'new-account-id', 'owner'), false);
  assert.equal(canAccessDocument(legacyRoom, 'new-account-id', 'read'), false);
});

test('PostgreSQL credentials, session revocation, CSRF and rate limiting', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.BETTER_AUTH_URL = 'http://localhost:3201';
  process.env.BETTER_AUTH_SECRET = randomBytes(48).toString('base64url');
  const { getAuth } = await import('../lib/auth');
  const { getDatabase } = await import('../lib/db');
  const { getMigrations } = await import('better-auth/db/migration');
  const database = getDatabase();
  const auth = getAuth();
  const email = `auth-test-${randomUUID()}@example.invalid`;
  const password = randomBytes(24).toString('base64url');
  const request = (endpoint: string, body?: object, cookie?: string, origin = process.env.BETTER_AUTH_URL!) => auth.handler(new Request(origin + '/api/auth' + endpoint, {
    method: body ? 'POST' : 'GET',
    headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }));
  const cookieFor = (response: Response) => response.headers.getSetCookie().map(cookie => cookie.split(';')[0]).join('; ');
  try {
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
    const weak = await request('/sign-up/email', { name: 'Auth Test', email, password: 'short' });
    assert.equal(weak.status, 400, 'short passwords are rejected');
    const signup = await request('/sign-up/email', { name: 'Auth Test', email, password });
    assert.equal(signup.status, 200, 'signup succeeds');
    assert.match(signup.headers.get('set-cookie') || '', /HttpOnly/i);
    assert.match(signup.headers.get('set-cookie') || '', /SameSite=Lax/i);
    const signupBody = await signup.json();
    const id = signupBody.user.id as string;
    const stored = await database.query<{ password: string }>('SELECT password FROM smartdocs_account WHERE "userId" = $1', [id]);
    assert.notEqual(stored.rows[0].password, password, 'password is stored as a hash');
    const bad = await request('/sign-in/email', { email, password: password + 'wrong' });
    assert.equal(bad.status, 401, 'incorrect password rejected');
    const signin = await request('/sign-in/email', { email, password });
    assert.equal(signin.status, 200, 'correct password accepted');
    const cookie = cookieFor(signin);
    assert.ok(cookie);
    const session = await (await request('/get-session', undefined, cookie)).json();
    assert.equal(session.user.id, id);
    assert.equal(session.user.password, undefined, 'password hashes never enter the session payload');
    const forged = cookie.replace(/session_token=([^;]+)/, (_match, token) => 'session_token=x' + token);
    assert.equal(await (await request('/get-session', undefined, forged)).json(), null, 'forged sessions are rejected');
    const foreign = await request('/sign-out', {}, cookie, 'https://foreign.example');
    assert.equal(foreign.status, 403, 'untrusted origins cannot sign users out');
    const signout = await request('/sign-out', {}, cookie);
    assert.equal(signout.status, 200);
    assert.equal(await (await request('/get-session', undefined, cookie)).json(), null, 'sign-out invalidates server-side session');
    let limited = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      if ((await request('/sign-in/email', { email, password: 'incorrect-password' })).status === 429) { limited = true; break; }
    }
    assert.equal(limited, true, 'repeated sign-in attempts are rate limited');
  } finally {
    await database.query('DELETE FROM smartdocs_user WHERE email = $1', [email]);
    await database.end();
  }
});
