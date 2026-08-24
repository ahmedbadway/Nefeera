/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  future: {
    // Wraps every `hover:` utility in `@media (hover: hover) and (pointer: fine)`.
    // Without this, tapping on a phone latches the hover state — the "sticky
    // hover" that makes a tapped gallery tile stay lit until you tap elsewhere.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Every color reads its bare OKLCH components from a CSS variable in
        // src/styles/Theme.css, so there is no literal hex here and the two can
        // never drift apart.
        //
        // The `<alpha-value>` placeholder is what makes opacity utilities work:
        // `bg-ink/50` compiles to `oklch(var(--ink) / 0.5)`. Wrapping a
        // pre-built `var(--color-ink)` instead would leave the alpha with
        // nowhere to go and every `/opacity` class on the site would render at
        // full strength.
        "warm-white": "oklch(var(--warm-white) / <alpha-value>)",
        "sage-mist": "oklch(var(--sage-mist) / <alpha-value>)",
        sage: "oklch(var(--sage) / <alpha-value>)",
        "sage-deep": "oklch(var(--sage-deep) / <alpha-value>)",
        ink: "oklch(var(--ink) / <alpha-value>)",
        "ink-muted": "oklch(var(--ink-muted) / <alpha-value>)",
        champagne: "oklch(var(--champagne) / <alpha-value>)",
        "champagne-deep": "oklch(var(--champagne-deep) / <alpha-value>)",
      },
      fontFamily: {
        // Read through variables so a language switch swaps the whole type
        // system at the <html> level — see the :lang(ar) block in Theme.css.
        // Italiana ships in weight 400 only: never pair font-display with a
        // weight utility, the browser would synthesize a fake bold.
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      letterSpacing: {
        wide2: "0.22em",
        wide3: "0.32em",
      },
      transitionTimingFunction: {
        "out-strong": "var(--ease-out)",
      },
    },
  },
  plugins: [],
};
