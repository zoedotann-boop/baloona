/**
 * Email brand tokens.
 *
 * Email clients can't read the CSS custom properties in `app/globals.css` (nor
 * `<style>` blocks, gradients-on-text, or inline SVG — Gmail strips all of it),
 * so the Baloona · Wonderland palette is mirrored here as literal values that
 * the email components apply inline. Keep these in sync with the `--brand-*`
 * tokens in `app/globals.css` (lavender-forward: plum headings, soft-rose
 * accents, warm near-white background, Fredoka display + Assistant body).
 */
export const emailTheme = {
  color: {
    /** Warm near-white page canvas (`--background`). */
    background: "#fdf6f8",
    /** White card surface (`--card`). */
    card: "#ffffff",
    /** Heading + wordmark plum (`--brand-plum`). */
    plum: "#6e5a8f",
    /** Deep lavender that carries white text (`--accent`). */
    accent: "#7b6ba8",
    /** Soft-rose CTA accent (`--brand-rose`). */
    rose: "#dda99e",
    /** Ink used on rose/lavender fills (`--brand-rose-ink`). */
    roseInk: "#422d7d",
    /** Decorative lavender (`--brand-lavender`). */
    lavender: "#b39ddb",
    /** Tinted lavender wash for the header (`--brand-lavender-soft`). */
    lavenderSoft: "#ebe3f5",
    mint: "#a7e8d0",
    banana: "#fde293",
    pink: "#fbd3e0",
    /** Baby-pink hero surface (`--brand-pink-soft`). */
    pinkSoft: "#fbeaf1",
    /** Cream canvas sampled from the site's `bg-cream-rainbow` hero art. */
    cream: "#faeede",
    ink: "#333333",
    inkSoft: "#666666",
    /** Muted lavender fill for detail rows (`--muted`). */
    muted: "#f4eef8",
    mutedInk: "#6b6076",
    border: "#ebd9e8",
  },
  font: {
    // Fredoka/Assistant rarely survive email clients, so each stack degrades to
    // a system sans; the brand still reads through colour, shape and layout.
    heading: "Fredoka, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    body: "Assistant, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  /** Card corner radius, echoing the site's rounded editorial panels. */
  radius: "28px",
} as const
