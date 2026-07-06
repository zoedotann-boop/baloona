# Design images

The home page references two illustration assets that live in the Claude Design
project ("Baloona Home Directions", Direction A). They could **not** be pulled
programmatically because the design MCP `get_file` endpoint hard-caps downloads
at 256 KiB and these source PNGs are much larger (so they return truncated).

Export them from the Claude Design project and drop them here:

| File in this folder | Source in the Claude Design project                         | Used by                         |
| ------------------- | ----------------------------------------------------------- | ------------------------------- |
| `hero-bg.png`       | `chatgpt-image-jul-1-2026-12_57_56-pm-mr1wmjpz.png`         | `components/home/hero.tsx`      |
| `birthday.png`      | `cleanshot-2026-06-28-at-12-09-00-2x-mqxkhtu2.png`          | `components/home/birthday-cta.tsx` |

Both are wired with graceful fallbacks (brand-pink for the hero, an illustrated
balloons/gift scene for the birthday card), so the site renders fine until the
real files are added — and picks them up automatically once they exist.
