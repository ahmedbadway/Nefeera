import Reveal from "./Reveal.jsx";

/**
 * The eyebrow + headline pair that opens most sections.
 *
 * It used to carry a `tone` prop that switched the palette to an inverted
 * variant, documented as being for FeaturedWedding sitting on burgundy. No
 * call site ever passed it — FeaturedWedding included — so `inverted` was
 * permanently false and every inverted branch was unreachable. A `className`
 * escape hatch went the same way, passed by none of the five call sites.
 * Both are gone; if a section ever does need to invert, it should arrive with
 * the section that needs it rather than sit here waiting.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.headline
 * @param {string} [props.body]
 * @param {string} [props.id] Anchors the section's aria-labelledby.
 */
export default function SectionHeading({ eyebrow, headline, body, id }) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="eyebrow text-sage-deep">{eyebrow}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 id={id} className="mt-4 text-[clamp(1.75rem,3.8vw,2.75rem)] text-ink">
          {headline}
        </h2>
      </Reveal>

      {body ? (
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.75] text-ink-muted">
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
