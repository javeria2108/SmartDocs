import { betterAuth } from 'better-auth';
import { getDatabase } from './db';

function createAuth() {
  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters');
  if (!process.env.BETTER_AUTH_URL) throw new Error('BETTER_AUTH_URL is not configured');
  return betterAuth({
    appName: 'SmartDocs',
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean),
    database: getDatabase(),
    emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128 },
    user: { modelName: 'smartdocs_user' },
    account: { modelName: 'smartdocs_account' },
    verification: { modelName: 'smartdocs_verification' },
    session: { modelName: 'smartdocs_session', expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: { enabled: true, storage: 'database', modelName: 'smartdocs_rate_limit', window: 60, max: 100 },
    advanced: { ipAddress: { ipAddressHeaders: process.env.VERCEL ? ['x-vercel-forwarded-for'] : [] } },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return instance ??= createAuth(); }
