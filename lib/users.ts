import { getDatabase } from './db';
import { getUserColor } from './utils';

export function publicUser(user: { id: string; name: string; email: string }): User {
  return { id: user.id, name: user.name, email: user.email, avatar: '/assets/icons/user.svg', color: getUserColor(user.id) };
}
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await getDatabase().query<{ id: string; name: string; email: string }>(
    'SELECT id, name, email FROM smartdocs_user WHERE lower(email) = $1 LIMIT 1', [email.trim().toLowerCase()],
  );
  return result.rows[0] ? publicUser(result.rows[0]) : null;
}
export async function findUsers(ids: string[]): Promise<(User | undefined)[]> {
  if (!ids.length) return [];
  const result = await getDatabase().query<{ id: string; name: string; email: string }>(
    'SELECT id, name, email FROM smartdocs_user WHERE id = ANY($1::text[])', [ids],
  );
  const users = new Map(result.rows.map(user => [user.id, publicUser(user)]));
  return ids.map(id => users.get(id));
}
