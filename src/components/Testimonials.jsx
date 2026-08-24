import { useContent } from "../utils/UseLanguage.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Testimonials.
 *
 * NOTHING HERE IS INVENTED. Nefeera has no published client quotes yet, so
 * these render as visible, obviously-unfinished placeholders — dashed champagne
 * border, no name, no photograph, no quote. Writing plausible-sounding reviews
 * and attaching invented names to them would be fabricating client
 * endorsements, which is not a thing to ship even as a stand-in.
 *
 * Fill `testimonials.items` in Content.js with real, permissioned quotes and
 * each card switches to its finished form automatically.
 *
 * THE ONE SECTION WITHOUT A WRAPPING PANEL: the heading gets a small glass
 * plate of its own and the three cards float free over the film, offset
 * vertically — three identical cards in a level row inside a box is the stock
 * template shape this avoids.
 */
export default function Testimonials() {
  const { testimonials } = useContent();

  // Vertical offsets, applied only from the large breakpoint up.
  const offsets = ["lg:mt-0", "lg:mt-14", "lg:mt-6"];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="glass inline-block rounded-3xl p-6 sm:p-8 lg:p-10">
          <SectionHeading
            id="testimonials-heading"
            eyebrow={testimonials.eyebrow}
            headline={testimonials.headline}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.items.map((item, index) => {
            const isPending = !item.quote;

            return (
              <Reveal
                key={item.id}
                delay={index * 0.07}
                className={offsets[index % offsets.length]}
              >
                {isPending ? (
                  <div className="glass-soft flex h-full min-h-[14rem] flex-col items-start justify-center rounded-2xl border-dashed border-champagne/60 p-7">
                    <span
                      aria-hidden="true"
                      className="font-display text-[2rem] leading-none text-champagne-deep/50"
                    >
                      &ldquo;
                    </span>
                    <p className="mt-4 text-[0.875rem] leading-relaxed text-ink">
                      {testimonials.pendingLabel}
                    </p>
                    <p className="mt-3 text-[0.6875rem] uppercase tracking-wide2 text-sage-deep">
                      {testimonials.pendingHint}
                    </p>
                  </div>
                ) : (
                  <figure className="glass flex h-full min-h-[14rem] flex-col justify-between rounded-2xl p-7">
                    <div>
                      <span
                        aria-hidden="true"
                        className="font-display text-[2rem] leading-none text-champagne-deep/60"
                      >
                        &ldquo;
                      </span>
                      <blockquote className="mt-4">
                        <p className="font-display text-[1.125rem] leading-[1.55] text-ink">
                          {item.quote}
                        </p>
                      </blockquote>
                    </div>
                    {item.attribution ? (
                      <figcaption className="mt-7 text-[0.75rem] uppercase tracking-wide2 text-ink-muted">
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
