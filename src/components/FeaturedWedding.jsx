import { content } from "../data/Content.js";
import Asset from "./Asset.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Featured wedding — the one burgundy section on the site.
 *
 * COLOUR SCOPE: burgundy appears here and nowhere else. It is not in the nav,
 * not on buttons, not on links, not in the footer. Confining a deep accent to a
 * single stretch of the page is what makes it read as an editorial spread
 * rather than a second brand colour.
 *
 * NO CLIENT DETAILS ARE INVENTED. Couple name, venue, date, and guest count are
 * absent on purpose — see the note in Content.js. Until real, permissioned
 * details are added to `featured.details`, the section shows a small
 * "details to be added" line and talks about the approach instead.
 */
export default function FeaturedWedding() {
  const { featured, assets } = content;
  const hasDetails = featured.details.length > 0;

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="relative bg-ink py-24 text-warm-white sm:py-32 lg:py-40"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading
              id="featured-heading"
              eyebrow={featured.eyebrow}
              headline={featured.headline}
              tone="inverted"
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.12}>
              {hasDetails ? (
                <dl className="space-y-3 border-s border-champagne/35 ps-6">
                  {featured.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-[0.6875rem] uppercase tracking-wide3 text-champagne">
                        {detail.label}
                      </dt>
                      <dd className="mt-1 text-[0.9375rem] text-warm-white/90">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="border-s border-champagne/35 ps-6 text-[0.75rem] uppercase tracking-wide2 text-champagne/80">
                  {featured.detailsPending}
                </p>
              )}
            </Reveal>
          </div>
        </div>

        {/* Opening image beside the copy.
            The source photography is vertical (9:16), and a 9:16 frame run at
            full container width would stand over 2000px tall — taller than any
            viewport, so the reader would never see it whole. Tall images are
            therefore held to a single column and the copy sits alongside,
            which is also a better use of the space than a full-bleed crop. */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <figure>
              <Asset
                src={assets.cases[0]}
                label="Case 01"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="glass-frame-dark w-full"
              />
              <figcaption className="mt-3.5 text-[0.6875rem] uppercase tracking-wide2 text-warm-white/55">
                {featured.captions[0]}
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6 lg:pt-4">
            <div className="space-y-5">
              {featured.body.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 32)} delay={index * 0.06}>
                  <p className="text-[0.9375rem] leading-[1.8] text-warm-white/80">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.16}>
              <blockquote className="mt-12 border-s-2 border-champagne ps-7">
                <p className="font-display text-[clamp(1.125rem,2vw,1.5rem)] italic leading-[1.4] text-warm-white">
                  {featured.pullQuote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* The remaining three, as an even strip. Each column lands near 410px
            on a wide screen, which keeps a 9:16 frame around 730px tall —
            readable at a glance instead of scrolling past. */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {[1, 2, 3].map((caseIndex) => (
            <Reveal key={assets.cases[caseIndex]} delay={(caseIndex - 1) * 0.07}>
              <figure>
                <Asset
                  src={assets.cases[caseIndex]}
                  label={`Case 0${caseIndex + 1}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="glass-frame-dark w-full"
                />
                <figcaption className="mt-3.5 text-[0.6875rem] uppercase tracking-wide2 text-warm-white/55">
                  {featured.captions[caseIndex]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
