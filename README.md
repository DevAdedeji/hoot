# Hoot

A live-streaming platform built with Nuxt, Nuxt UI, TypeScript, and Tailwind CSS.

## Setup

Use Node.js 24 LTS and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

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
- `nuxt.config.ts`: framework and module configuration.

Current frontend routes: `/` (discovery), `/login`, `/signup`, and `/forgot-password`. Authentication forms validate locally; submission and Google buttons are not connected to a backend. Google sign-in, email delivery, database persistence, and real-time streaming are not implemented yet.

Sample photography is stored locally in `public/images/`.
