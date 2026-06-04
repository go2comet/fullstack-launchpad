# Full-Stack App Scaffold (Default Template)

A production-ready starting point for full-stack apps. **This is a template** — copy
the whole directory into a new folder and follow the [New Project Setup](#new-project-setup)
checklist below to turn it into a real project.

## Stack

| Layer        | Choice                                                              |
| ------------ | ------------------------------------------------------------------- |
| Framework    | Next.js 15 (App Router) + React 19                                  |
| Language     | TypeScript (strict)                                                 |
| Backend      | Next.js API routes + Server Components                              |
| Database     | Supabase (Postgres) with Row Level Security                         |
| Auth         | Supabase Auth (email/password + OAuth) via `@supabase/ssr`          |
| Validation   | Zod                                                                 |
| Styling      | CSS Modules + design tokens in `globals.css`                        |
| Tests        | Vitest (unit/integration) + Playwright (E2E)                        |
| Deployment   | Vercel (`vercel.json` ships security headers)                       |
| Package mgr  | pnpm                                                                |

## What's Already Built

A working **task manager** demo wired end-to-end, so every layer has a real example to copy:

- **Auth flow** — signup, login, OAuth buttons, `/auth/callback`, `/auth/signout`, middleware-protected routes
- **Protected area** — `src/app/(protected)/` with a dashboard + tasks page behind an auth gate
- **API + data layer** — `src/app/api/tasks/` routes → `src/lib/tasks/repository.ts` (repository pattern) → Zod schema
- **Database** — migrations for `profiles`, a new-user trigger, and `tasks` with RLS; plus `seed.sql`
- **UI primitives** — `Button`, `Field` in `src/components/ui/`
- **Tests** — unit (`env`, `tasks-schema`), integration (`tasks-repository`), E2E (`auth`, `tasks`)

Treat the tasks feature as a reference implementation. Build new features by mirroring its
shape (route → repository → schema → component), then delete the tasks demo when you no longer need it.

---

## New Project Setup

Do these steps **after** copying this directory to a new project folder.

### 1. Re-initialize git

The copy carries over this template's git history. Start fresh:

```bash
rm -rf .git
git init
```

### 2. Rename the project

Search-and-replace the placeholder name everywhere. The template name is **`default`**
(display name) and **`default`** (package name):

- `package.json` → `"name": "default"` → your project slug
- `src/app/layout.tsx` → `metadata.title: 'default'`
- `src/app/page.tsx` → `<h1>default</h1>`
- `src/app/(protected)/layout.tsx` → `<span className={styles.brand}>default</span>`

Quick find: `grep -rn "default" src/`

### 3. Install dependencies

```bash
pnpm install
```

Requires Node 24.x and pnpm 10.x (matches what this template was built on).

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable                        | Where to get it                                              |
| ------------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase dashboard → Project Settings → API                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page                                                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Same page — **server-only, never expose client-side**        |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000` locally; your domain in prod         |

`.env.local` is gitignored. Required vars are validated at startup by `src/lib/env.ts`.

### 5. Set up the database

**Option A — Local Supabase (recommended for dev):**

```bash
supabase start                 # boots local Postgres + Studio (needs Docker)
supabase db reset              # applies migrations + seed.sql
pnpm db:types                  # regenerates src/types/database.types.ts
```

Use the local API URL/keys that `supabase start` prints in your `.env.local`.

**Option B — Cloud Supabase project:**

```bash
supabase link --project-ref <your-project-ref>
supabase db push               # applies supabase/migrations/* to the cloud DB
```

Whenever you change the schema: add a new file in `supabase/migrations/`, apply it, then
re-run `pnpm db:types`.

### 6. Run it

```bash
pnpm dev          # http://localhost:3000
```

### 7. Verify

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint
pnpm test         # vitest unit + integration
pnpm test:e2e     # playwright (needs the app running / built)
```

---

## Deploying to Vercel

1. Push the repo to GitHub, import it in Vercel.
2. Add all env vars from `.env.local` to the Vercel project (set `NEXT_PUBLIC_SITE_URL`
   to your production domain).
3. In the **Supabase dashboard → Authentication → URL Configuration**, set:
   - **Site URL** → your production domain
   - **Redirect URLs** → add your prod domain + Vercel preview URLs (for `/auth/callback`)
4. For local dev, redirect URLs live in `supabase/config.toml` (`auth.site_url` /
   `auth.additional_redirect_urls`).
5. `vercel.json` already applies HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, and `Permissions-Policy`. CI runs from `.github/workflows/ci.yml`.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # login + signup (public)
│   ├── (protected)/         # dashboard + tasks (auth-gated via layout)
│   ├── api/tasks/           # REST endpoints
│   ├── auth/                # callback + signout route handlers
│   ├── layout.tsx           # root layout + metadata
│   └── globals.css          # design tokens
├── components/
│   ├── auth/                # login/signup/OAuth forms
│   ├── tasks/               # task list/item/create (feature example)
│   └── ui/                  # Button, Field primitives
├── lib/
│   ├── env.ts               # validated env access
│   ├── supabase/            # client / server / middleware / admin clients
│   └── tasks/               # repository + Zod schema (data-layer example)
└── types/database.types.ts  # generated from the DB schema

supabase/
├── migrations/              # ordered SQL migrations
├── seed.sql                 # local seed data
└── config.toml              # local dev config

tests/                       # unit / integration / e2e
middleware.ts                # session refresh + route protection
```

## Scripts

| Command              | Does                                  |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Start dev server                      |
| `pnpm build`         | Production build                      |
| `pnpm start`         | Run production build                  |
| `pnpm lint`          | ESLint                                |
| `pnpm typecheck`     | `tsc --noEmit`                        |
| `pnpm test`          | Vitest (run once)                     |
| `pnpm test:watch`    | Vitest watch mode                     |
| `pnpm test:coverage` | Vitest with coverage                  |
| `pnpm test:e2e`      | Playwright E2E                        |
| `pnpm db:types`      | Regenerate TS types from local DB     |

---

## Quick Checklist (copy this when starting a new project)

- [ ] `rm -rf .git && git init`
- [ ] Rename `default` / `default` → new name (4 spots, see step 2)
- [ ] `pnpm install`
- [ ] `cp .env.example .env.local` and fill in Supabase keys
- [ ] Set up DB (`supabase start` + `db reset`, or `link` + `db push`)
- [ ] `pnpm db:types`
- [ ] `pnpm dev` and confirm it boots
- [ ] `pnpm typecheck && pnpm lint && pnpm test`
- [ ] (When deploying) add env vars + Supabase redirect URLs in Vercel/Supabase
