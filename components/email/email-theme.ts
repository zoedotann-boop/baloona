/**
 * Email brand tokens.
 *
 * Email clients can't read the CSS custom properties in `app/globals.css`, so
 * the Baloona · Wonderland palette is mirrored here as literal values that the
 * email components apply inline. Keep these in sync with the `--brand-*` tokens
 * in `app/globals.css` (lavender-forward: plum headings, soft-rose accents,
 * warm near-white background, Fredoka display + Assistant body).
 */
export const emailTheme = {
  color: {
    background: "#fdf6f8",
    card: "#ffffff",
    plum: "#6e5a8f",
    rose: "#dda99e",
    roseInk: "#422d7d",
    lavender: "#b39ddb",
    lavenderSoft: "#ebe3f5",
    mint: "#a7e8d0",
    banana: "#fde293",
    pink: "#fbd3e0",
    pinkSoft: "#fbeaf1",
    ink: "#333333",
    inkSoft: "#666666",
    muted: "#f1e9f5",
    mutedInk: "#6b6076",
    border: "#ebd9e8",
  },
  font: {
    // Fredoka/Assistant rarely survive email clients, so each stack degrades to
    // a system sans; the brand still reads through colour, shape and layout.
    heading: "Fredoka, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    body: "Assistant, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  radius: "20px",
} as const
