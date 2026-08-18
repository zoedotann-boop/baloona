<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working conventions

## Pull requests

- When work is complete, always update the pull request description so it accurately reflects the current implementation. Include all actual changes and remove any outdated information from previous iterations. Treat the PR description as a living document.

## Before requesting review or merging

- Ensure that all checks and validations pass successfully.
- Verify the following are updated when applicable: `CLAUDE.md`/`AGENTS.md`, `README`, and landing page content and related documentation.

## Styling & theme

- Fonts: **Fredoka** (rounded display) for headings + the wordmark (`--font-heading`),
  **Assistant** for body (`--font-sans`); both wired via `next/font` in `app/layout.tsx`.
  Fredoka's axis maxes at 700, so `font-black`/`font-extrabold` headings clamp to 700.
- The brand palette is **"Wonderland" (lavender-forward)**: warm near-white background,
  **lavender** lead accent (deep `--accent` `#7b6ba8` for white-text panels; decorative
  `--brand-lavender` `#b39ddb` for large/non-text only — white body text fails contrast on
  it), **plum** headings (`text-brand-plum`), **soft-coral** CTAs (`--primary` + coral-ink
  `--primary-foreground`), plus banana/mint/pink accents. All colors are CSS tokens in
  `app/globals.css` (`--brand-*` + shadcn semantic tokens). Use token utilities
  (`bg-primary`, `text-brand-plum`, `bg-brand-banana`, …) — never ad-hoc hex in components.
- Headings use `font-heading` + `text-brand-plum`; body text is `text-foreground`/
  `text-brand-ink-soft`. Interactive elements use `--primary` (soft coral) with a hover-lift
  (no glow/drop-shadow). See `components/brand/pill-button.tsx`.
- Editorial layout primitives: `Panel` (big rounded color panel, `tone` variants),
  `AccentSquare` (decorative corner square, `-z-10`), `Confetti` (fixed pastel scatter).
  Sections favor flowing text + rounded panels over boxed cards. Page bands come from
  `components/layout/`: `<Section>` owns the shared gutter (`px-5 md:px-9`) + vertical
  rhythm presets (default `lg` = `py-20 md:py-28`) and `<Container>` the centered
  max-width column (`lg`/`md`/`sm`) — reach for these instead of re-typing
  `px-5 md:px-9` / `mx-auto max-w-*`.
- Scroll-reveal (fade-in + slide-up) is `components/brand/reveal.tsx` — wrap a heading or map
  cards in `<Reveal delay={index * ~80}>` for a staggered row. The motion is a `.reveal`
  utility in `globals.css` and respects `prefers-reduced-motion`.
- The site is light-only (`ThemeProvider forcedTheme="light"`); there is no dark variant.

## Architecture

- **Multi-tenant by location.** Every venue is a row in `location` and all content
  tables cascade from it. Visitors get `/<slug>`; `/` is a branch chooser. Nothing
  about a venue is hard-coded — opening a branch is `provisionLocation()`, which
  seeds a full starter site from `lib/db/seed-content.ts`.
- **Content lives in the database; chrome lives in `messages/*.json`.** Venue copy,
  prices, menu, reviews and SEO are admin-editable rows. Button labels, aria-labels,
  weekday names and admin UI strings stay in `messages/he.json` / `en.json` and are
  read with `useTranslations`. Never hard-code either kind in a component.
- **Translatable values are `jsonb` `{ he, en }`** (`Localized`) or `{ he: string[] }`
  (`LocalizedList`). Hebrew is the source language; read through `pickLocale` /
  `pickLocaleList` so a missing translation falls back to Hebrew.
- **Pages resolve content; components stay dumb.** Server pages fetch, localize and
  format (prices via `formatPrice`, hours via `lib/opening-hours.ts`), then pass
  plain strings down. That is what makes every section storyable without a database.
- **Reads are per-request.** No cache layer and no `generateStaticParams`: the locale
  cookie already makes pages dynamic, and going straight to Neon means an admin
  publish is live immediately.
- **Prices are integers** (whole shekels) in the database. Currency is added on render.
- Data access: `lib/db/queries/site.ts` (public) and `lib/db/queries/admin.ts` (editor
  views). Mutations are server actions under `lib/actions/`, each one validating with
  zod and re-checking access via `requireLocationAccess`.
- **Punch cards are the one brand-global exception.** The loyalty tables
  (`customer`, `punch_card`, `punch_event` in `lib/db/schema/punch-cards.ts`) do **not**
  cascade from a location: a card belongs to the brand so its balance is one number a
  customer redeems at any branch. The `location`/`user` references on a card and its
  punch events are audit trails (`onDelete: "set null"`) — which branch issued it, which
  branch and clerk redeemed each punch. There is no customer login: a customer is keyed
  by phone at the front desk and views their card through an unguessable share token at
  `/card/<token>` (the `card` slug is reserved). The admin console
  (`/admin/<branch>/punch-cards`) still runs through `requireLocationAccess(slug)` — the
  branch in the URL is the acting branch recorded on each punch.
- **The shop is the other brand-global surface.** `product` (`lib/db/schema/shop.ts`) is a
  global catalog of punch-card packages (`entries` + integer `price`), edited from the
  branch-scoped `/admin/<branch>/shop` (auth-only slug, like punch cards). The storefront is
  a **home-page section** (`components/home/shop-section.tsx`, anchor `#shop`) rather than its
  own page — customers reach it from the branch home, header and footer. The customer card
  (`/card/<token>`) and `/checkout` are the brand-global routes under `app/(standalone)/`
  (`card`/`checkout` are reserved slugs). Each product's "buy" links to
  `/checkout?product=<id>&from=<slug>`, which collects details + a mandatory Terms consent,
  then calls `lib/shop/payment.ts` `startPayment` — a **placeholder** ahead of PayMe
  approval that persists nothing; wire the real payment there. `/[location]/terms` renders a
  per-branch Terms & Cancellation policy (editable body, falling back to a `sections` block
  in `messages/*.json`).
- **One public shell for every page.** All public pages wear the same frame from
  `components/layout/`: `PublicShell` (header + `<main>` + footer) filled by either
  `SiteChrome` — the full per-branch chrome (header nav, contact block, footer, announcement,
  analytics), used by `app/[location]/layout.tsx` and by `/checkout` when it knows the source
  branch — or `BrandShell`, the brand-global variant (slim header + footer) for the branch
  picker (`/`), the customer card, and checkout with no branch. `SiteHeader`/`SiteFooter`
  render their full or slim mode from whether branch `paths` are passed. The plain legal
  pages (`/[location]/accessibility`, `/[location]/terms`) share the `LegalPage` template.

## Admin panel

- Routes live under `app/admin/(dashboard)/…`; `app/admin/login` sits outside the
  group so it stays reachable while signed out.
- Auth is Better Auth (email + password, sign-up disabled). Roles: `owner` (all
  branches, can add/delete and manage the team) and `manager` (only branches listed
  in `location_member`). `lib/admin/access.ts` is the single gate — it is
  `server-only`, so client components import route constants from `lib/admin/routes.ts`.
- Each section is one `<SectionForm>`: it holds the whole draft in state, publishes it
  in one action, and provides the language switch plus the AI translate shortcut
  through context. Editable lists use `<RowList>`; order is the array order and
  becomes `sortOrder` on save.
- Every editable field explains itself. Pass `tooltip` to `AdminField` /
  `LocalizedField` / `LocalizedListField` / `ImageField` and it renders an
  `<InfoTooltip>` info icon beside the label (hover or keyboard focus reveals it).
  Copy lives in `messages/*.json` under the section, keyed `<field>Tip`; keep `he`
  and `en` in sync.
- Saving a list submits the whole array. `syncCollection` in
  `lib/actions/admin/shared.ts` turns that snapshot into inserts, updates and deletes.
- The birthday booking form is editor-defined: `birthday_form_field` rows compile to a
  JSON Schema (`lib/birthday-form.ts`) rendered by `@rjsf/shadcn`. Answers land in
  `lead.formData` keyed by field key and render as a label/value list in the inbox.

## Integrations

All optional — a missing key disables one feature instead of breaking the build.
See `.env.example`.

- **Resend** — emails each new lead to the branch's `leadRecipientEmail`. Failures are
  recorded on the lead, never surfaced to the visitor.
- **Vercel Blob** — image uploads client-side straight from the browser: the image
  field calls `@vercel/blob/client` `upload()`, and `app/api/admin/media/upload`
  signs the token after re-checking branch access. Without `BLOB_READ_WRITE_TOKEN`,
  dev falls back to local disk (`public/uploads`, PUT to `app/api/admin/media/[...key]`).
- **Gemini** — drafts translations for the "מלא עם AI" buttons. Output is always
  editable, never published blind.
- **SerpApi** — imports Google reviews per branch, through SerpApi's Google Maps Reviews
  API rather than Google's own Places API: Places caps a response at five reviews and
  needs a billed Google Cloud project, while SerpApi takes the same Place ID we already
  store and returns eight. `lib/google/serpapi.ts` fetches exactly one page and never
  paginates — one sync is one billed search, which is what keeps a nightly branch inside
  the free tier of 250 searches a month. Don't add `num`: SerpApi rejects it on a first
  page, which always returns 8.
- Google serves reviews in Hebrew, so the sync drafts their English through Gemini
  (`draftEnglish` in `lib/google/sync-reviews.ts`) in one batched call — new reviews and
  any whose Hebrew changed. It is best-effort: no Gemini key or a failed call leaves
  English untouched rather than failing the sync, and `pickLocale` falls back to Hebrew.
- `lib/google/sync-reviews.ts` is the one sync implementation, matching on Google's
  review id so a re-sync refreshes wording in place
  and never overrules an editor's publish decision on a review that already exists.
  Two callers: the admin's "סנכרון עכשיו" button imports everything unpublished for an
  editor to approve, and the nightly cron `app/api/cron/google-reviews` publishes new
  4-star-and-up reviews itself, because nobody is standing by. Which branches the cron
  touches is data — `site_setting.google_reviews_auto_sync`, toggled in ניהול ביקורות
  (currently Kiryat Ono alone). The schedule lives in `vercel.json`; `CRON_SECRET` is the
  bearer token Vercel sends, and without it the endpoint 401s rather than running open.
- Because that cron publishes unattended, the home page reviews section caps itself at
  `HOME_REVIEWS_LIMIT` (`lib/db/queries/site.ts`) — otherwise the masonry would gain a
  few cards every night, forever. Ordering is `sortOrder` then newest, so an editor can
  still pin a favourite above the synced ones.

## Code quality

- Research relevant best practices for the implemented changes (including external sources when beneficial) and look for opportunities to simplify the implementation. The primary objective is to keep the codebase clean, maintainable, scalable, and easy to understand.
- Where appropriate, evaluate whether the database schema can be simplified or improved to better align with best practices. Proactively suggest schema enhancements that would make the system clearer, more scalable, or easier to maintain.
- Ensure comprehensive test coverage for all newly introduced functionality, including both happy paths and relevant edge cases. There is no unit-test runner here: coverage means a `*.stories.tsx` for every new brand primitive, home section and admin primitive, with the a11y addon clean.
- Before review, all of these must pass: `bun run lint`, `bun run typecheck`,
  `bun run format:check`, `bun run knip`, `bun run build-storybook`.
- `ajv` is a direct dependency on purpose even though nothing imports it: it pins ajv@8
  as the hoisted copy so `ajv-formats` (pulled in by `@rjsf/validator-ajv8`) can never
  resolve eslint's ajv@6 and break the production build. Don't remove it — see
  `knip.jsonc`.
