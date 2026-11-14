# Baloona

A multi-branch site for Baloona — an indoor playground and café for children —
with a Hebrew-first admin panel that owns every piece of content.

- **Public site**: `/` lists the branches, `/<slug>` is a branch's home page,
  with `/menu`, `/birthdays` and `/accessibility` beneath it. `/card/<token>` is a
  customer's digital punch card, opened by the share link/QR the front desk hands out
  (no login — the token is the credential; the `card` slug is reserved).
- **Store**: the digital punch-card packages are sold in a **section on each branch home
  page** (anchored `#shop`, linked from the header and footer). `/checkout` collects details
  with a mandatory Terms consent (payment is a placeholder until PayMe is connected — see
  `lib/shop/payment.ts`), and `/terms` is the Terms & Cancellation policy page. `checkout`
  and `terms` are reserved slugs.
- **Admin**: `/admin` — contact details, opening hours, the pop-up, SEO, home
  page copy, pricing, menu, birthdays, media, reviews, the **shop** catalog and the
  enquiries inbox, all per branch, plus a brand-global **punch cards** console (issue,
  punch, undo and migrate physical cards).

Stack: Next.js 16 (App Router) · Neon Postgres + Drizzle · Better Auth ·
next-intl (he/en) · Tailwind v4 · Storybook.

## Getting started

Environment variables live in [envpass](https://envpass.dev), not in a local
`.env`. The committed `.envpass.json` points at the `barad` workspace, `baloona`
project and `development` environment, and the runtime scripts (`dev`, `start`,
`db:migrate`, `db:studio`, `db:seed`) inject the values with `envpass run`, so
nothing is ever written to disk.

```bash
bun install
bunx envpass-cli login  # once per machine — approve in the browser
bun run db:migrate      # create the schema
bun run db:seed         # owner account + the two starter branches
bun run dev
```

`.env.example` lists every key the app reads (names only). To add or change a
value, edit it in the envpass web app (Project → `development`) — never in a
file. A tool that can only read a file can use `bunx envpass-cli pull`, which
writes a `.env` readable only by you; `.env*` stays gitignored.

Sign in at `/admin/login`: enter your email and Better Auth emails you a one-time
code (via Resend — so `RESEND_API_KEY` / `RESEND_FROM_EMAIL` are required to log in).
The seeded owner is `ADMIN_EMAIL`; there are no passwords. Public sign-up is
disabled; further accounts are created by an owner in **ניהול צוות**.

### Conductor workspaces

`.conductor/settings.toml` wires up the parallel-workspace workflow: `setup`
runs `bun install`, the Run button offers the dev server, Storybook and Drizzle
Studio (each on the workspace's own `$CONDUCTOR_PORT`), and `archive` deletes
`node_modules`/`.next`/`storybook-static` when a workspace is retired. No secrets
are copied between workspaces: every workspace reads the same envpass
environment through the committed `.envpass.json`.

### Optional integrations

Every integration degrades to "feature unavailable" rather than breaking the
build, so you can run locally with only the database configured.

| Env                              | Enables                                       |
| -------------------------------- | --------------------------------------------- |
| `RESEND_API_KEY` + `..._FROM_..` | Emailing new enquiries to the branch's address |
| `BLOB_READ_WRITE_TOKEN`          | Image uploads (gallery, hero, OG, favicon)     |
| `GEMINI_API_KEY`                 | The "מלא עם AI" translation buttons            |
| `SERPAPI_API_KEY`                | Importing Google reviews per branch            |
| `CRON_SECRET`                    | The nightly Google reviews sync (`/api/cron/*`) |

## Scripts

| Script                    | What it does                            |
| ------------------------- | --------------------------------------- |
| `bun run dev`             | Dev server                              |
| `bun run build`           | Production build                        |
| `bun run db:generate`     | Write a migration from the schema       |
| `bun run db:migrate`      | Apply migrations                        |
| `bun run db:studio`       | Drizzle Studio                          |
| `bun run db:seed`         | Owner account + starter branches        |
| `bun run storybook`       | Storybook on :6006                      |
| `bun run lint`            | ESLint                                  |
| `bun run typecheck`       | `tsc --noEmit`                          |
| `bun run format:check`    | Prettier                                |
| `bun run knip`            | Unused files, exports and dependencies  |
| `bun run comments`        | commentless — fails on any comment      |
| `bun run build-storybook` | Storybook build                         |

All of `lint`, `typecheck`, `format:check`, `knip`, `comments` and
`build-storybook` must pass before review. `comments` enforces a no-comment
policy on `.ts`/`.tsx` sources (only functional directives such as
`eslint-disable` survive); run `bunx commentless . --write` to strip any.

## How content flows

1. Every venue is a row in `location`; all content tables cascade from it.
2. Translatable values are single `jsonb` columns shaped `{ he, en }`. Hebrew is
   the source language and readers fall back to it via `pickLocale`.
3. Pages read the database per request (no cache layer), so publishing in the
   admin is live immediately.
4. UI chrome — button labels, aria-labels, weekday names — stays in
   `messages/he.json` / `messages/en.json`; venue content never does.

See `AGENTS.md` for the conventions behind those choices.
