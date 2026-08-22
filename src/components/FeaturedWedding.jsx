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
      className="relative bg-burgundy py-24 text-cream sm:py-32 lg:py-40"
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
                <dl className="space-y-3 border-s border-gold-soft/35 ps-6">
                  {featured.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-[0.6875rem] uppercase tracking-wide3 text-gold-soft">
                        {detail.label}
                      </dt>
                      <dd className="mt-1 text-[0.9375rem] text-cream/90">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="border-s border-gold-soft/35 ps-6 text-[0.75rem] uppercase tracking-wide2 text-gold-soft/80">
                  {featured.detailsPending}
                </p>
              )}
            </Reveal>
          </div>
        </div>

        {/* Opening wide image */}
        <Reveal className="mt-16 sm:mt-20">
          <figure>
            <Asset
              src={assets.cases[0]}
              ratio="3/2"
              label="Case 01"
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="w-full"
            />
            <figcaption className="mt-4 text-[0.75rem] uppercase tracking-wide2 text-cream/60">
              {featured.captions[0]}
            </figcaption>
          </figure>
        </Reveal>

        {/* Copy set between the images so the section reads as a spread rather
            than a photo dump with a heading. */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            {featured.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} delay={index * 0.06}>
                <p className="text-[1.0625rem] leading-[1.8] text-cream/80">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <blockquote className="border-s-2 border-gold-soft ps-7">
                <p className="font-display text-[clamp(1.5rem,3vw,2.125rem)] italic leading-[1.35] text-cream">
                  {featured.pullQuote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Tall pair */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 sm:gap-8">
          {[1, 2].map((caseIndex) => (
            <Reveal key={assets.cases[caseIndex]} delay={(caseIndex - 1) * 0.08}>
              <figure>
                <Asset
                  src={assets.cases[caseIndex]}
                  ratio="4/5"
                  label={`Case 0${caseIndex + 1}`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="w-full"
                />
                <figcaption className="mt-4 text-[0.75rem] uppercase tracking-wide2 text-cream/60">
                  {featured.captions[caseIndex]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Closing wide image */}
        <Reveal className="mt-8 sm:mt-10">
          <figure>
            <Asset
              src={assets.cases[3]}
              ratio="16/9"
              label="Case 04"
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="w-full"
            />
            <figcaption className="mt-4 text-[0.75rem] uppercase tracking-wide2 text-cream/60">
              {featured.captions[3]}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
