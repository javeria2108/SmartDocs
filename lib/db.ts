import { Pool } from 'pg';
const state = globalThis as typeof globalThis & { smartDocsPool?: Pool };
export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return state.smartDocsPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 10_000 });
}
