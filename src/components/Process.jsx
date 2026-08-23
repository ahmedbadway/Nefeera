import { content } from "../data/Content.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Process — four stages.
 *
 * Laid out as an ordered list with hairline rules and large gold numerals, not
 * as four equal cards. The numeral sits in its own narrow column so the eye
 * tracks straight down the sequence, which is the point of the section: these
 * stages happen in order.
 *
 * No images here on purpose. Icons or stock photos on a process list are
 * decoration that the client would then have to source; the typography carries
 * it, and there are four fewer slots to fill before launch.
 */
export default function Process() {
  const { process } = content;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative bg-cream py-24 sm:py-32 lg:py-40"
    >
      <div className="shell">
        <SectionHeading
          id="process-heading"
          eyebrow={process.eyebrow}
          headline={process.headline}
          body={process.body}
        />

        <ol className="mt-16 border-t border-gold/25 sm:mt-20">
          {process.steps.map((step, index) => (
            <Reveal
              key={step.number}
              as="li"
              delay={index * 0.05}
              className="border-b border-gold/25"
            >
              <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-12 sm:gap-8 sm:py-12">
                <div className="sm:col-span-2">
                  <span
                    className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-gold"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                </div>

                <div className="sm:col-span-4">
                  <h3 className="text-[clamp(1.0625rem,1.6vw,1.3125rem)] text-charcoal">
                    {step.title}
                  </h3>
                </div>

                <div className="sm:col-span-6">
                  <p className="text-[0.9375rem] leading-[1.8] text-charcoal-muted">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
