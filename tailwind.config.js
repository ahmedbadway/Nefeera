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
        // `bg-charcoal/50` compiles to `oklch(var(--charcoal) / 0.5)`. Wrapping
        // a pre-built `var(--color-charcoal)` instead would leave the alpha with
        // nowhere to go and every `/opacity` class on the site would render at
        // full strength.
        cream: "oklch(var(--cream) / <alpha-value>)",
        "warm-white": "oklch(var(--warm-white) / <alpha-value>)",
        gold: "oklch(var(--gold) / <alpha-value>)",
        "gold-soft": "oklch(var(--gold-soft) / <alpha-value>)",
        "cream-deep": "oklch(var(--cream-deep) / <alpha-value>)",
        charcoal: "oklch(var(--charcoal) / <alpha-value>)",
        "charcoal-muted": "oklch(var(--charcoal-muted) / <alpha-value>)",
        // Scoped to the FeaturedWedding section only.
        burgundy: "oklch(var(--burgundy) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "'Times New Roman'", "serif"],
        body: ["Inter", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.18em",
        wide2: "0.22em",
        wide3: "0.32em",
      },
      maxWidth: {
        shell: "var(--shell-max)",
      },
      transitionTimingFunction: {
        "out-strong": "var(--ease-out)",
        "in-out-strong": "var(--ease-in-out)",
        drawer: "var(--ease-drawer)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s var(--ease-in-out) infinite",
      },
    },
  },
  plugins: [],
};
