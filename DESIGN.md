# Baloona design system

The reference for how the site looks and how to keep it consistent. The **source
of truth for values** is `app/globals.css` (tokens) and `components/brand/` +
`components/layout/` (primitives) — this doc explains _how to use_ them. If a
value here ever disagrees with `globals.css`, `globals.css` wins.

> Golden rule: **never hardcode a hex colour, font, or ad-hoc layout in a
> component.** Reach for a token utility (`bg-primary`, `text-brand-plum`) and a
> primitive (`PillButton`, `Section`, `Panel`). The site is **light-only**
> (`ThemeProvider forcedTheme="light"`) — there is no dark variant to design for.

## Brand personality

**"Wonderland" — warm and playful.** Rounded display type, a
warm near-white canvas, plum headings, soft-coral call-to-actions, and pastel
banana/mint/pink accents, over decorative skies of clouds, balloons and hearts.
Definition comes from colour, shape and a gentle hover-lift — **not** from
drop-shadows or glows.

## Typography

- **Fredoka** (rounded display) — headings + the wordmark. Utility: `font-heading`
  (`--font-heading`). Its weight axis maxes at **700**, so `font-black` /
  `font-extrabold` headings clamp to 700 — don't expect a heavier weight.
- **Assistant** — body copy. Utility: `font-sans` (`--font-sans`), the `html`
  default.
- Both are wired in `app/layout.tsx` via `next/font/google`.
- Headings: `font-heading` + `text-brand-plum`. Body: `text-foreground`; muted
  body: `text-brand-ink-soft` / `text-muted-foreground`.

## Colour tokens

All colours are CSS variables in `app/globals.css`, exposed as Tailwind utilities.
Use the utility, never the raw hex.

### Semantic (shadcn) tokens

| Utility | Value | Use |
| --- | --- | --- |
| `bg-background` | `#fdf6f8` | page canvas (warm near-white) |
| `text-foreground` | `#575757` | body text |
| `bg-card` | `#ffffff` | card surfaces |
| `bg-primary` / `text-primary-foreground` | `#dda99e` / `#422d7d` | **CTAs** (soft coral + coral-ink) |
| `bg-secondary` | `#fbd3e0` | secondary fills |
| `bg-muted` / `text-muted-foreground` | `#f1e9f5` / `#6b6076` | quiet fills + muted text |
| `bg-brand-pink` / `text-secondary-foreground` | `#fbd3e0` / `#4a3b66` | pink feature panels with dark text (`Panel tone="pink"`) |
| `bg-accent` / `text-accent-foreground` | `#2277b6` / `#fff` | small sky-blue UI accent (icons, focus ring, badges) |
| `text-destructive` | `#c24b4b` | errors |
| `border-border` | `#ebd9e8` | hairlines/cards |
| `ring-ring` | `#2277b6` | focus ring |

### Brand palette (`--brand-*`)

`brand-rose #dda99e` (interactive; = primary), `brand-rose-ink #422d7d` (text on
rose), `brand-lavender #b39ddb` (**decorative, large/non-text only** — white body
text fails contrast on it; use `accent` for white-on-color panels), `brand-plum
#6e5a8f` (headings), `brand-mint #a7e8d0`, `brand-banana #fde293`, `brand-cloud
#fffbfc`, `brand-ink #333`, `brand-ink-soft #666`, `brand-pink #fbd3e0`,
`brand-pink-soft #fbeaf1`, plus `brand-green/yellow/gold/flower-pink`.

### Scene palette (`--scene-*`)

`--scene-sky-*`, `--scene-hill-*`, `--scene-pond`, `--scene-town` — sampled from
the painted Baloona murals, **decorative and non-text only**. They drive
`SkyBackdrop` / `WallScene` gradients; don't use them for UI chrome or text.

## Radius & motion

- **Radius**: base `--radius: 1.25rem` (20px), scaled `--radius-sm…-4xl`
  (`rounded-sm`…`rounded-4xl`). Editorial `Panel` surfaces use `rounded-[36px]`;
  content cards use `rounded-[28px]`. Prefer these over new ad-hoc literals.
- **Motion utilities** (in `globals.css`): `.reveal` (scroll fade-in + slide-up,
  via `Reveal`), `.animate-baloona-float`, `.animate-baloona-pulse`,
  `.toast-in`. All respect `prefers-reduced-motion`.

## Primitives

### Brand (`components/brand/`)

- **`PillButton`** — the canonical button/CTA (renders `<a>` with `href`, else
  `<button>`). Variants `primary` (default, `bg-brand-pink text-brand-plum`),
  `outline`, `soft`; sizes `sm`/`md`/`lg`. Definition is the hover-lift, not a
  shadow.
- **`Panel`** — big rounded editorial surface, `tone` = `pink`/`mint`/
  `banana`/`white`.
- **`ConsentCheckbox`** — accessible agreement checkbox; the canonical consent
  control (used by checkout).
- **`SkyBackdrop`** — decorative clouds/balloons/hearts layer. Drop as the first
  child of a `relative isolate overflow-hidden` parent; `variant` `sky`/`party`,
  `ground` adds hills + flamingo.
- **`Confetti`**, **`AccentSquare`** — other decorative layers (`-z-10`).
- **`Reveal`** — wrap a heading or map cards in `<Reveal delay={i * ~80}>` for a
  staggered scroll-reveal.

### Layout (`components/layout/`)

- **`Section`** — full-bleed page band. Owns the shared gutter (`px-5 md:px-9`)
  and a vertical-rhythm `spacing` preset (`sm`/`md`/`lg` default/`xl`). **Reach
  for this instead of re-typing `px-5 md:px-9` / `py-*`.**
- **`Container`** — centered max-width column (`sm`/`md`/`lg`). For a narrow form
  narrower than `Container`'s presets, use `Section` for the gutter/rhythm and an
  inner `mx-auto max-w-lg`.
- **`SiteChrome`** (per-branch: header + contact + footer + announcements) and
  **`BrandShell`** (brand-global slim header/footer) wrap pages; both fill
  `PublicShell`.

## Forms

Public text forms (contact, checkout) share one field style — **do not re-declare
input classes per form**:

- `components/forms/field.tsx` exports `fieldInputClass` (the input class) and
  `FieldError` (the inline validation message). Import both.
- Anatomy: white card `rounded-[28px] border border-border bg-white p-8`; fields
  in a `space-y-4` stack; placeholder-only (no visible `<label>`);
  `aria-invalid` + `border-destructive` on error; LTR fields add `text-right` +
  `dir="ltr"`. Submit is a full-width `PillButton size="md"`.
- Every public form renders `<HoneypotField />` (anti-spam; autofill-safe).
- Consent uses `ConsentCheckbox`.

## The buying process (shop → checkout → success → card)

These pages must feel like one branded flow, not a bare form:

- **The public shop is currently off.** `PUNCH_CARD_SHOP_ENABLED` in `lib/features.ts`
  (`false`) hides the home `ShopSection` and the footer link, makes `/checkout` return
  `notFound()`, and makes `startPunchCardCheckout` refuse — customers can no longer buy
  cards online, but the admin still manages products (`/admin/<branch>/shop`) and issues
  cards (`/admin/<branch>/punch-cards`). Flip the flag to `true` to bring the storefront
  back. The flow below describes it when enabled.
- Each wears the site's soft sky: a `relative isolate overflow-hidden` wrapper
  with `<SkyBackdrop />`, laid out with `Section`.
- The shop uses `ShopSection` (`components/home/shop-section.tsx`); the checkout
  card art matches the product (`theme` derived from the catalog position, see
  `app/(standalone)/checkout/page.tsx`).
- The closing confirmation panel is the shared `CheckoutResultCard`
  (`components/shop/checkout-result-card.tsx`) — used by both the inline checkout
  success state and the PayMe return page.
- The customer card page (`/card/[token]`) reuses `PunchCardArt` +
  `PunchCardDisplay` on the same sky.

## Emails

Emails can't read these tokens (clients strip CSS vars), so the palette is
mirrored as literals in `components/email/email-theme.ts` — **keep it in sync with
`--brand-*`**. All emails share `EmailLayout`; templates are copy-free and receive
resolved Hebrew strings as props (copy lives under `emails.*` in
`messages/he.json`).

## Copy & locale

Hebrew, RTL, single-locale. User-facing strings live in `messages/he.json` and are
read via `next-intl` (`useTranslations` / `t.raw()`); venue content lives in the
database. **Never hardcode user-facing copy in a component.**
