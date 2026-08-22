/**
 * Brand tokens as literal hex.
 *
 * WHY THIS FILE EXISTS ALONGSIDE Theme.css:
 * Components must never hardcode colors — they read the OKLCH custom properties
 * defined in src/styles/Theme.css. But two consumers cannot use CSS variables:
 *
 *   1. scripts/GeneratePlaceholders.mjs writes standalone .svg files into
 *      public/assets/placeholders/. Those files are served raw and sit outside
 *      the CSS cascade, so they need literal hex baked in.
 *   2. A handful of inline SVG attributes (gradient stops, animated values)
 *      where a var() reference is not reliably supported across browsers.
 *
 * Theme.css is generated from these values by hand-kept parity — if you change a
 * color here, change it in Theme.css too. The OKLCH equivalents are noted next
 * to each entry so the two files can be diffed at a glance.
 */

export const tokens = {
  // Core palette — final, supplied by the client.
  cream: "#EDE6DC", // oklch(92.77% 0.0154 77.07)
  warmWhite: "#FAF7F3", // oklch(97.73% 0.0062 75.41)
  gold: "#B08D4F", // oklch(66.28% 0.0908 80.47)
  charcoal: "#2B2B2B", // oklch(28.91% 0.0000 89.88)

  // Burgundy is scoped to the FeaturedWedding section ONLY.
  // Never use it in the nav, buttons, links, or any global UI.
  burgundy: "#5C1A2B", // oklch(32.95% 0.0968 8.66)

  // Supporting tints, derived from the core palette.
  goldSoft: "#C9A96B", // oklch(74.94% 0.0885 83.12)
  creamDeep: "#E3DACD", // oklch(89.20% 0.0201 77.31)
  charcoalMuted: "#6B6560", // oklch(51.07% 0.0109 62.43)
};

export default tokens;
