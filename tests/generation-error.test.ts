import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generationError } from '../lib/generation-error';

test('quota errors remain identifiable without exposing provider details', () => {
  const result = generationError({ status: 429, message: 'private request details' });
  assert.equal(result.status, 429);
  assert.match(result.message, /limit/i);
  assert.equal(result.message.includes('private request details'), false);
});

test('provider credentials and unavailable-model errors do not leak internal details', () => {
  for (const status of [401, 403, 404]) {
    const result = generationError({ status, message: 'sensitive provider response' });
    assert.equal(result.status, 503);
    assert.equal(result.message.includes('sensitive'), false);
  }
  assert.equal(generationError(new Error('internal failure')).status, 502);
  assert.equal(generationError(null).status, 502);
  assert.equal(generationError({ status: 400 }).status, 422);
});
