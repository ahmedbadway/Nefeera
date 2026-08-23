import { content } from "../data/Content.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Testimonials.
 *
 * NOTHING HERE IS INVENTED. Nefeera has no published client quotes yet, so
 * these render as visible, obviously-unfinished placeholders — dashed gold
 * border, no name, no photograph, no quote. Writing plausible-sounding reviews
 * and attaching invented names to them would be fabricating client
 * endorsements, which is not a thing to ship even as a stand-in.
 *
 * Fill `testimonials.items` in Content.js with real, permissioned quotes and
 * each card switches to its finished form automatically.
 *
 * The cards are offset vertically rather than sitting in a level row — three
 * identical cards in a line is the stock template shape.
 */
export default function Testimonials() {
  const { testimonials } = content;

  // Vertical offsets, applied only from the large breakpoint up.
  const offsets = ["lg:mt-0", "lg:mt-14", "lg:mt-6"];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative bg-cream py-24 sm:py-32 lg:py-40"
    >
      <div className="shell">
        <SectionHeading
          id="testimonials-heading"
          eyebrow={testimonials.eyebrow}
          headline={testimonials.headline}
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.items.map((item, index) => {
            const isPending = !item.quote;

            return (
              <Reveal
                key={item.id}
                delay={index * 0.07}
                className={offsets[index % offsets.length]}
              >
                {isPending ? (
                  <div className="glass flex h-full min-h-[14rem] flex-col items-start justify-center border-dashed p-7">
                    <span
                      aria-hidden="true"
                      className="font-display text-[2rem] leading-none text-gold/50"
                    >
                      &ldquo;
                    </span>
                    <p className="mt-4 text-[0.875rem] leading-relaxed text-charcoal-muted">
                      {testimonials.pendingLabel}
                    </p>
                    <p className="mt-3 text-[0.6875rem] uppercase tracking-wide2 text-gold">
                      {testimonials.pendingHint}
                    </p>
                  </div>
                ) : (
                  <figure className="glass flex h-full min-h-[14rem] flex-col justify-between p-7">
                    <div>
                      <span
                        aria-hidden="true"
                        className="font-display text-[2rem] leading-none text-gold/60"
                      >
                        &ldquo;
                      </span>
                      <blockquote className="mt-4">
                        <p className="font-display text-[1.0625rem] leading-[1.6] text-charcoal">
                          {item.quote}
                        </p>
                      </blockquote>
                    </div>
                    {item.attribution ? (
                      <figcaption className="mt-7 text-[0.75rem] uppercase tracking-wide2 text-charcoal-muted">
                        {item.attribution}
                      </figcaption>
                    ) : null}
                  </figure>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
