## SmartDocs

Collaborative documents with Next.js, Lexical, Liveblocks, and Gemini.
Email/password accounts and revocable sessions use self-hosted Better Auth
with PostgreSQL. Clerk is no longer required.

### Local setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and configure `DATABASE_URL`,
   `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and the existing Liveblocks/Gemini keys.
   Use a dedicated database and a unique random session secret of at least 32 characters.
3. Run `npm run db:migrate` to create the prefixed `smartdocs_*` authentication tables.
4. Run `npm run dev` and open `http://localhost:3000`.

Sign up at `/sign-up`, then sign in at `/sign-in`. Passwords require at least
12 characters. Sharing is available to document owners and requires the recipient
to have an account. Editors can edit; viewers cannot rename, share, or delete.

### Checks

Run `npm run typecheck`, `npm run lint`, and `npm run build`.
`npm test` checks permissions. Set `TEST_DATABASE_URL` to a separate disposable
PostgreSQL database to also test credentials, password hashing, session revocation,
CSRF protection, and rate limiting. Never point tests at production.

### Deployment and existing accounts

Set `DATABASE_URL`, a fresh `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` (the exact
production origin) in the existing Vercel project. Keep the Liveblocks/Gemini
settings, run the database migration, then deploy. Do not commit `.env.local`.

Existing Clerk passwords and sessions are not migrated. Create a new account.
Existing Liveblocks documents are preserved, but their old email-based permissions
are not automatically attached to new accounts: doing so without verifying ownership
would allow account takeover. Ownership migration needs a trusted administrator.

Email verification and password-reset email delivery are not configured in this
initial replacement. They require a mail provider. Sessions are stored in PostgreSQL,
use HttpOnly cookies, and are invalidated on sign-out; authentication endpoints use
database-backed rate limiting and Better Auth's origin/CSRF checks.
