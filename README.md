# Baloona

A multi-branch site for Baloona — an indoor playground and café for children —
with a Hebrew-first admin panel that owns every piece of content.

- **Public site**: `/` lists the branches, `/<slug>` is a branch's home page,
  with `/menu`, `/birthdays` and `/accessibility` beneath it.
- **Admin**: `/admin` — contact details, opening hours, the pop-up, SEO, home
  page copy, pricing, menu, birthdays, media, reviews and the enquiries inbox,
  all per branch.

Stack: Next.js 16 (App Router) · Neon Postgres + Drizzle · Better Auth ·
next-intl (he/en) · Tailwind v4 · Storybook.

## Getting started

```bash
bun install
cp .env.example .env    # fill in DATABASE_URL and BETTER_AUTH_SECRET
bun run db:migrate      # create the schema
bun run db:seed         # owner account + the two starter branches
bun run dev
```

Generate the secret with `openssl rand -base64 32`. `.env` is gitignored — no
credentials are ever committed.

Sign in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Public sign-up
is disabled; further accounts are created by an owner in **ניהול צוות**.

### Conductor workspaces

`.conductor/settings.toml` wires up the parallel-workspace workflow: `setup`
runs `bun install`, the Run button offers the dev server, Storybook and Drizzle
Studio (each on the workspace's own `$CONDUCTOR_PORT`), and `archive` deletes
`node_modules`/`.next`/`storybook-static` when a workspace is retired.

Secrets are copied, not committed: put a filled-in `.env` in the **repository
root directory** once, and `file_include_globs = [".env*"]` hands every new
workspace its own copy.

```bash
cp .env.example "$CONDUCTOR_ROOT_PATH/.env"   # then fill it in
```

### Optional integrations

Every integration degrades to "feature unavailable" rather than breaking the
build, so you can run locally with only the database configured.

| Env                              | Enables                                       |
| -------------------------------- | --------------------------------------------- |
| `RESEND_API_KEY` + `..._FROM_..` | Emailing new enquiries to the branch's address |
| `BLOB_READ_WRITE_TOKEN`          | Image uploads (gallery, hero, OG, favicon)     |
| `GEMINI_API_KEY`                 | The "מלא עם AI" translation buttons            |
| `GOOGLE_PLACES_API_KEY`          | Importing Google reviews per branch            |

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
| `bun run build-storybook` | Storybook build                         |

All of `lint`, `typecheck`, `format:check`, `knip` and `build-storybook` must
pass before review.

## How content flows

1. Every venue is a row in `location`; all content tables cascade from it.
2. Translatable values are single `jsonb` columns shaped `{ he, en }`. Hebrew is
   the source language and readers fall back to it via `pickLocale`.
3. Pages read the database per request (no cache layer), so publishing in the
   admin is live immediately.
4. UI chrome — button labels, aria-labels, weekday names — stays in
   `messages/he.json` / `messages/en.json`; venue content never does.

See `AGENTS.md` for the conventions behind those choices.
