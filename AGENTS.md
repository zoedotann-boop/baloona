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
  Sections favor flowing text + rounded panels over boxed cards, with a consistent
  `py-20 md:py-28` rhythm.
- Scroll-reveal (fade-in + slide-up) is `components/brand/reveal.tsx` — wrap a heading or map
  cards in `<Reveal delay={index * ~80}>` for a staggered row. The motion is a `.reveal`
  utility in `globals.css` and respects `prefers-reduced-motion`.
- The site is light-only (`ThemeProvider forcedTheme="light"`); there is no dark variant.

## Code quality

- Research relevant best practices for the implemented changes (including external sources when beneficial) and look for opportunities to simplify the implementation. The primary objective is to keep the codebase clean, maintainable, scalable, and easy to understand.
- Where appropriate, evaluate whether the database schema can be simplified or improved to better align with best practices. Proactively suggest schema enhancements that would make the system clearer, more scalable, or easier to maintain.
- Ensure comprehensive test coverage for all newly introduced functionality, including both happy paths and relevant edge cases.
