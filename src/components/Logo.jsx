import { content } from "../data/Content.js";
import { useFirstAvailableAsset } from "../utils/AssetProbe.js";
import { resolveAssetPath } from "../utils/ResolveAssetPath.js";

/**
 * The Nefeera lockup, drawn in code.
 *
 * DROP-IN OVERRIDE:
 * If a real logo file is uploaded it replaces the drawn version everywhere at
 * once. Probe order is logo.svg, then logo.png, then the drawn fallback — the
 * client may only have a raster file, so both are accepted.
 *
 * The drawn version renders FIRST and the probe swaps it out afterwards. Doing
 * it in that order means there is never a blank gap or a broken-image flash
 * while the probe is in flight.
 *
 * ABOUT THE MARK:
 * The mark is a stylized noon (ن) — the first letter of the name — drawn as a
 * single nib-weighted stroke with its dot. It is deliberately abstract rather
 * than an attempt at real calligraphy: hand-authored bezier curves cannot
 * faithfully reproduce an actual calligraphic logo, and pseudo-Arabic
 * letterforms read as wrong to anyone who reads the script. Upload the real
 * logo.svg to replace it.
 *
 * Only the mark is SVG. The wordmark and sublines are real HTML text so they
 * use the loaded Cormorant Garamond webfont, stay selectable and searchable,
 * scale with the type system, and are read correctly by screen readers.
 *
 * @param {object} props
 * @param {"full"|"wordmark"|"mark"} [props.variant] Which parts to show.
 * @param {"dark"|"light"} [props.color] "light" = cream, for use over the hero video.
 * @param {"xs"|"sm"|"md"|"lg"} [props.size] Type scale of the lockup.
 * @param {string} [props.className] Classes for the wrapper.
 */

const SIZES = {
  // Header size. Deliberately small: the lockup is four stacked lines, and at
  // anything larger it dominates a transparent bar it is meant to sit lightly on.
  xs: {
    mark: "1.25rem",
    wordmark: "0.8125rem",
    rule: "2.25rem",
    subline: "0.5625rem",
    discipline: "0.5rem",
    gap: "0.3125rem",
  },
  sm: {
    mark: "1.6rem",
    wordmark: "1rem",
    rule: "2.75rem",
    subline: "0.625rem",
    discipline: "0.5625rem",
    gap: "0.375rem",
  },
  md: {
    mark: "2.25rem",
    wordmark: "1.5rem",
    rule: "4rem",
    subline: "0.75rem",
    discipline: "0.6875rem",
    gap: "0.5rem",
  },
  lg: {
    mark: "3.25rem",
    wordmark: "2.25rem",
    rule: "6rem",
    subline: "0.875rem",
    discipline: "0.75rem",
    gap: "0.6875rem",
  },
};

const COLORS = {
  dark: {
    mark: "var(--color-gold)",
    wordmark: "var(--color-charcoal)",
    rule: "var(--color-gold)",
    subline: "var(--color-charcoal)",
    discipline: "var(--color-charcoal-muted)",
  },
  light: {
    // Gold-soft rather than gold: the darker gold loses contrast over video.
    mark: "var(--color-gold-soft)",
    wordmark: "var(--color-warm-white)",
    rule: "var(--color-gold-soft)",
    subline: "var(--color-warm-white)",
    discipline: "var(--color-cream)",
  },
};

function NefeeraMark({ color, size }) {
  return (
    <svg
      viewBox="0 0 120 74"
      style={{ height: size, width: "auto" }}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18 C12 52, 30 66, 60 66 C90 66, 108 52, 108 18" strokeWidth="5" />
        <path d="M108 18 C108 10, 102 5, 94 7" strokeWidth="3.2" opacity="0.7" />
      </g>
      <circle cx="60" cy="6" r="4.5" fill={color} />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  color = "dark",
  size = "md",
  className = "",
}) {
  const { images } = content.assets;
  const { brand } = content;

  const uploaded = useFirstAvailableAsset([images.logoSvg, images.logoPng]);

  const scale = SIZES[size] || SIZES.md;
  const palette = COLORS[color] || COLORS.dark;

  const accessibleName = `${brand.name} — ${brand.subline}, ${brand.discipline}`;

  // A real logo file was found: it replaces the whole drawn lockup.
  if (uploaded.status === "present" && uploaded.src) {
    return (
      <img
        src={resolveAssetPath(uploaded.src)}
        alt={accessibleName}
        className={`block w-auto ${className}`}
        style={{ height: `calc(${scale.mark} + ${scale.wordmark} * 2.2)` }}
      />
    );
  }

  const showMark = variant === "full" || variant === "mark";
  const showText = variant === "full" || variant === "wordmark";

  if (variant === "mark") {
    return (
      <span
        className={`inline-flex ${className}`}
        role="img"
        aria-label={brand.name}
      >
        <NefeeraMark color={palette.mark} size={scale.mark} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex flex-col items-center ${className}`}
      style={{ gap: scale.gap, lineHeight: 1 }}
    >
      {showMark ? <NefeeraMark color={palette.mark} size={scale.mark} /> : null}

      {showText ? (
        <>
          <span
            className="font-display uppercase"
            style={{
              fontSize: scale.wordmark,
              letterSpacing: "0.18em",
              // Tracking adds space after the final letter; pull it back so the
              // wordmark stays optically centered over the rule.
              textIndent: "0.18em",
              color: palette.wordmark,
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            {brand.name}
          </span>

          <span
            aria-hidden="true"
            style={{
              display: "block",
              inlineSize: scale.rule,
              blockSize: "1px",
              backgroundColor: palette.rule,
              opacity: 0.8,
            }}
          />

          <span
            className="font-body uppercase"
            style={{
              fontSize: scale.subline,
              letterSpacing: "0.22em",
              textIndent: "0.22em",
              color: palette.subline,
              fontWeight: 400,
              lineHeight: 1.2,
              opacity: 0.9,
            }}
          >
            {brand.subline}
          </span>

          <span
            className="font-body uppercase"
            style={{
              fontSize: scale.discipline,
              letterSpacing: "0.32em",
              textIndent: "0.32em",
              color: palette.discipline,
              fontWeight: 400,
              lineHeight: 1.2,
              opacity: 0.8,
            }}
          >
            {brand.discipline}
          </span>
        </>
      ) : null}
    </span>
  );
}
