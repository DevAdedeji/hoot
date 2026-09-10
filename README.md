# Hoot

A live-streaming platform built with Nuxt, Nuxt UI, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, and Better Auth.

## Requirements

- Node.js 24 LTS
- pnpm 12
- PostgreSQL 17

## Setup

```sh
pnpm install --frozen-lockfile
cp .env.example .env
createuser hoot_app
createdb --owner=hoot_app hoot
pnpm db:migrate
pnpm dev
```

Update `DATABASE_URL` in `.env` if your local PostgreSQL role or connection details differ. Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.

Google authentication is enabled when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set. Use `http://localhost:3000/api/auth/callback/google` as the local authorized redirect URI in Google Cloud.

Authentication email is delivered through Resend. Set `RESEND_API_KEY` and `EMAIL_FROM` to enable email verification and password recovery. The sender domain in `EMAIL_FROM` must be verified in Resend.

## Database

```sh
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

`db:generate` creates SQL migrations from the schema. Review the generated SQL, then run `db:migrate` to apply pending migrations.

## Checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Use `pnpm format` to format Vue, TypeScript, JSON, Markdown, and stylesheet files with Oxfmt. `pnpm lint` checks the project with Oxlint.

## Project structure

- `app/app.vue`: application wrapper and metadata.
- `app/app.config.ts`: Nuxt UI semantic colors.
- `app/assets/tailwind.css`: Tailwind and Nuxt UI imports only. Component styling uses Tailwind utilities; button defaults live in `app/app.config.ts`.
- `app/components/`: reusable interface components grouped by feature.
- `app/pages/`: file-based routes.
- `server/api/auth/`: Better Auth request handler.
- `server/database/`: Drizzle schema and SQL migrations.
- `server/utils/`: database and authentication configuration.
- `nuxt.config.ts`: framework and module configuration.

Current routes include `/` (discovery), `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, and the protected `/account` page. Email/password signup, email verification, password recovery, login, logout, and database-backed sessions are implemented. Google authentication is activated through environment credentials.

Sample photography is stored locally in `public/images/`.
