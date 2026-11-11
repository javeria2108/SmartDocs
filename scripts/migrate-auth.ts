import nextEnv from '@next/env';
async function main() {
  nextEnv.loadEnvConfig(process.cwd());
  const { getAuth } = await import('../lib/auth');
  const { getDatabase } = await import('../lib/db');
  const { getMigrations } = await import('better-auth/db/migration');
  try {
    const { runMigrations } = await getMigrations(getAuth().options);
    await runMigrations();
    console.log('SmartDocs authentication tables are ready.');
  } finally { await getDatabase().end(); }
}
main().catch(() => { console.error('Authentication migration failed. Check DATABASE_URL, authentication settings, and database permissions.'); process.exitCode = 1; });
