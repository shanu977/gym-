# Iron Peak Fitness — Production Deployment Notes

No hosting platform configuration (Dockerfile, CI workflow, Render/Fly/Vercel config) exists in this
repository, so this document lists what a deployment must provide. Values are intentionally omitted —
only variable **names** are documented.

## 1. Backend environment (server-side only)

Set these on the API process (`backend/`):

| Name | Purpose | Production guidance |
| --- | --- | --- |
| `NODE_ENV` | Runtime mode | `production` (enables `secure` cookies and rejects placeholder `SESSION_SECRET`) |
| `PORT` / `HOST` | Listen address | `0.0.0.0` behind a TLS-terminating proxy |
| `DATABASE_URL` | PostgreSQL connection string | Managed Postgres, TLS required, never committed |
| `SESSION_SECRET` | Signs session + CSRF cookies | ≥ 32 random chars, unique per environment |
| `SESSION_COOKIE_NAME` | Session cookie name | default is fine |
| `SESSION_TTL_HOURS` / `REMEMBER_SESSION_TTL_DAYS` | Session lifetimes | defaults: 12 h / 30 d |
| `ARGON2_MEMORY_COST` / `ARGON2_TIME_COST` / `ARGON2_PARALLELISM` | Password hashing cost | keep defaults unless benchmarked |
| `FRONTEND_URL` | CORS allow-list origin | exact public frontend origin (scheme + host), used for credentialed requests |
| `LOG_LEVEL` | Pino log level | `info` (cookie and authorization headers are redacted by the app) |
| `AI_API_KEY` | Groq API key | backend only — never expose via `VITE_` variables |
| `AI_BASE_URL` | Groq chat-completions endpoint | default `https://api.groq.com/openai/v1` |
| `AI_MODEL` | Groq model id | default `openai/gpt-oss-120b` |
| `AI_MAX_TOKENS` / `AI_TIMEOUT_MS` | Response budget / upstream timeout | defaults 1200 / 20000 |

If `AI_API_KEY` is left empty the assistant runs in **demo mode** and every reply is labelled as such in
the UI; it is never presented as a live AI answer.

## 2. Frontend build environment (browser-exposed)

Set on the build machine for `npm run build`:

| Name | Purpose | Production guidance |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API origin used by the browser | public API origin, or empty for same-origin. Values pointing at `localhost`/`127.0.0.1` are ignored in production bundles. |
| `VITE_AUTH_API` | Demo auth switch (dev only) | ignored in production builds — API auth is always on |
| `VITE_CUSTOMER_PROFILE_API` | Demo profile switch (dev only) | ignored in production builds |
| `VITE_CUSTOMER_ADDRESS_API` | Demo address switch (dev only) | ignored in production builds |
| `VITE_CUSTOMER_CART_API` | Demo cart switch (dev only) | ignored in production builds |
| `VITE_CUSTOMER_WISHLIST_API` | Demo wishlist switch (dev only) | ignored in production builds |

Only `VITE_`-prefixed values reach the browser. Keep secrets out of them.

## 3. Database setup and migration procedure

1. Provision PostgreSQL 16+ and set `DATABASE_URL`.
2. Apply schema migrations: `npm run db:migrate` (runs `prisma migrate deploy`, non-destructive).
3. Sync the catalog used by cart/wishlist: `npm run db:seed` (idempotent; derives products from the
   frontend catalog in `src/data/siteData.ts`).
4. Never run `prisma migrate reset` against a production database.

Migrations run from `backend/prisma/migrations`; the local PostgreSQL container used during development
is **not** assumed to exist in production.

## 4. Build and start commands

- API: `cd backend && npm ci && npm run prisma:generate && npm run build && npm start`
  (`npm start` runs `node dist/server.js`; health check: `GET /api/v1/health`)
- Web: `cd . && npm ci && npm run build` (outputs `dist/`)

The API handles `SIGINT`/`SIGTERM` for graceful shutdown and closes the database connection.

## 5. Security posture already in the app

- Session cookie: `httpOnly`, `sameSite=lax`, `path=/`, `secure` when `NODE_ENV=production`, signed with `SESSION_SECRET`.
- CSRF: double-submit token required on every state-changing request (`x-csrf-token`), cookie is signed.
- CORS: single configured origin (`FRONTEND_URL`) with `credentials: true`; helmet security headers enabled.
- Rate limits: login 20/15 min, register 10/15 min, assistant chat 20/min.
- Passwords: Argon2id; policy requires 12–128 characters.
- Customer routes are scoped to the authenticated user id; unauthenticated calls return `401`.

## 6. Recommended deployment checklist

1. Set every variable above; confirm `NODE_ENV=production`.
2. Run migrations and seed against the production database.
3. Rebuild the frontend with the production `VITE_API_BASE_URL`.
4. Serve web and API over HTTPS; verify `FRONTEND_URL` matches the public web origin exactly.
5. Verify `GET /api/v1/health` and one authenticated round trip (register → login → profile).
6. Confirm the Groq key is only present in the backend environment.
