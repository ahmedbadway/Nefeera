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
  // Core palette — warm white / sage / ink, with champagne hairline accents.
  warmWhite: "#FAF9F4", // oklch(98.15% 0.0067 97.35)
  sageMist: "#E7EDE2", // oklch(93.85% 0.0160 130.42)
  sage: "#C7D4C0", // oklch(85.45% 0.0306 134.42)
  sageDeep: "#4E5F52", // oklch(46.70% 0.0295 152.23)
  ink: "#252E28", // oklch(29.04% 0.0165 156.05)
  inkMuted: "#5A665C", // oklch(49.68% 0.0215 150.21)

  // Champagne is decoration-only on light surfaces; champagneDeep is the
  // text-grade version (5.1:1 on warm white).
  champagne: "#D9C69C", // oklch(83.19% 0.0597 86.49)
  champagneDeep: "#7A683F", // oklch(52.46% 0.0623 86.59)
};

export default tokens;
