import Reveal from "./Reveal.jsx";

/**
 * The eyebrow + headline pair that opens most sections.
 *
 * `tone` switches the palette for the one section that inverts — FeaturedWedding
 * sits on burgundy, everything else on warm-white or warm white.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.headline
 * @param {string} [props.body]
 * @param {"default"|"inverted"} [props.tone]
 * @param {string} [props.className]
 * @param {string} [props.id] Anchors the section's aria-labelledby.
 */
export default function SectionHeading({
  eyebrow,
  headline,
  body,
  tone = "default",
  className = "",
  id,
}) {
  const inverted = tone === "inverted";

  return (
    <div className={`max-w-2xl ${className}`}>
      <Reveal>
        <p
          className={`eyebrow ${inverted ? "text-champagne" : "text-sage-deep"}`}
        >
          {eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <h2
          id={id}
          className={`mt-4 text-[clamp(1.75rem,3.8vw,2.75rem)] ${
            inverted ? "text-warm-white" : "text-ink"
          }`}
        >
          {headline}
        </h2>
      </Reveal>

      {body ? (
        <Reveal delay={0.12}>
          <p
            className={`mt-5 max-w-lg text-[0.9375rem] leading-[1.75] ${
              inverted ? "text-warm-white/80" : "text-ink-muted"
            }`}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
