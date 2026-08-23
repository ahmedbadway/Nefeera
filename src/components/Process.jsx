import { content } from "../data/Content.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Process — four stages, one glass panel.
 *
 * Laid out as an ordered list with hairline rules and oversized sage numerals,
 * not as four equal cards. Each step from the large breakpoint up starts a
 * little further along the inline axis than the last, so the sequence walks
 * across the panel — the eye reads order without a single box being drawn.
 *
 * No images here on purpose. Icons or stock photos on a process list are
 * decoration that the client would then have to source; the typography carries
 * it, and there are four fewer slots to fill before launch.
 */

// Static classes, not a computed ps-[calc(...)] — Tailwind only compiles class
// strings it can see at build time.
const STEP_INDENTS = ["", "lg:ps-12", "lg:ps-24", "lg:ps-36"];

export default function Process() {
  const { process } = content;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="glass rounded-3xl p-6 sm:p-10 lg:p-14">
          <SectionHeading
            id="process-heading"
            eyebrow={process.eyebrow}
            headline={process.headline}
            body={process.body}
          />

          <ol className="mt-14 border-t border-champagne/45 sm:mt-16">
            {process.steps.map((step, index) => (
              <Reveal
                key={step.number}
                as="li"
                delay={index * 0.05}
                className="border-b border-champagne/45"
              >
                <div
                  className={`grid grid-cols-1 gap-4 py-10 sm:grid-cols-12 sm:gap-8 sm:py-12 ${
                    STEP_INDENTS[index % STEP_INDENTS.length]
                  }`}
                >
                  <div className="sm:col-span-2">
                    <span
                      className="font-display text-[clamp(2.25rem,3.5vw,3rem)] leading-none text-sage"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <h3 className="text-[clamp(1.125rem,1.7vw,1.4375rem)] text-ink">
                      {step.title}
                    </h3>
                  </div>

                  <div className="sm:col-span-6">
                    <p className="text-[0.9375rem] leading-[1.8] text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
