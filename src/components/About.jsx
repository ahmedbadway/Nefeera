import { useContent } from "../utils/UseLanguage.js";
import Asset from "./Asset.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * About section — one glass panel floating over the film.
 *
 * Asymmetric 12-column split inside the panel: the portrait takes five columns
 * and sits slightly lower than the copy, which takes six starting at column
 * seven. The uneven column count and the vertical offset are what keep it from
 * reading as the standard 50/50 image-beside-text block.
 *
 * The portrait mount is glass-frame-FLAT: the panel already blurred the
 * backdrop, and nested backdrop-filters are banned (Global.css).
 */
export default function About() {
  const { about, assets } = useContent();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="glass rounded-3xl p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Portrait */}
            <div className="lg:col-span-5 lg:pt-16">
              <Reveal>
                <div className="glass-frame-flat relative rounded-2xl">
                  <Asset
                    src={assets.images.aboutYomna}
                    label="About — Yomna"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="w-full overflow-hidden rounded-[10px]"
                  />
                  {/* Offset champagne rule — a small anchor that stops the
                      portrait floating free of the grid. */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-6 start-0 block h-px w-24 bg-champagne"
                  />
                </div>
              </Reveal>
            </div>

            {/* Copy */}
            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                id="about-heading"
                eyebrow={about.eyebrow}
                headline={about.headline}
              />

              <Reveal delay={0.1} blurIn={6}>
                <p className="mt-8 font-display text-[clamp(1.25rem,2.1vw,1.625rem)] leading-[1.4] text-ink">
                  {about.lead}
                </p>
              </Reveal>

              <div className="mt-8 space-y-5">
                {about.body.map((paragraph, index) => (
                  <Reveal key={paragraph.slice(0, 32)} delay={0.14 + index * 0.05}>
                    <p className="text-[0.9375rem] leading-[1.8] text-ink-muted">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              {/* Stats. Hairline dividers rather than boxes — three bordered
                  cards here would be exactly the template look this project
                  avoids. */}
              <Reveal delay={0.24}>
                <h3 className="sr-only-focusable">{about.statsLabel}</h3>
                <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden border-y border-champagne/45 sm:grid-cols-3">
                  {about.stats.map((stat) => (
                    <div
                      key={stat.value}
                      className="border-champagne/45 py-7 pe-6 sm:border-e sm:last:border-e-0"
                    >
                      <dt className="font-display text-[1.375rem] leading-none text-ink">
                        {stat.value}
                      </dt>
                      <dd className="mt-2 text-[0.75rem] leading-relaxed text-ink-muted">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
