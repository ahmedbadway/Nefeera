import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform, useReducedMotion } from "motion/react";
import { content } from "../data/Content.js";
import { useHeroMedia } from "../utils/UseHeroMedia.js";
import VideoAsset from "./VideoAsset.jsx";
import { WhatsAppIcon, ArrowIcon } from "./Icons.jsx";

/**
 * Full-height opening section.
 *
 * TWO DISTINCT LOOKS, NOT ONE LOOK WITH A HOLE IN IT:
 * With footage uploaded, this is a dark cinematic hero — video behind a layered
 * scrim, cream type on top. With no footage, the same section becomes a cream
 * editorial hero with charcoal type and a gold rule. The switch is driven by
 * useHeroMedia() and transitioned rather than snapped.
 *
 * That is the whole point of the asset system: the missing state is designed,
 * not merely survivable.
 *
 * The layout is deliberately bottom-and-start aligned rather than centered —
 * a centered hero is the generic default this project exists to avoid.
 */
export default function Hero() {
  const { hero, assets, contact } = content;
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);

  // hasDarkMedia, not hasVideo: under reduced motion the poster is what ends up
  // behind this copy, so that is what decides whether cream type can be read.
  // See utils/UseHeroMedia.js.
  const { hasDarkMedia } = useHeroMedia();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Media drifts slower than the page. Scaled up so the translate never exposes
  // an edge. Disabled entirely for reduced motion and when there is no footage —
  // parallaxing a static placeholder is motion for its own sake.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const parallaxTransform = useMotionTemplate`translate3d(0, ${parallaxY}px, 0) scale(1.14)`;
  const applyParallax = hasDarkMedia && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden bg-cream"
      aria-label={hero.headline}
    >
      {/* Media layer */}
      <motion.div
        className="absolute inset-0"
        style={applyParallax ? { transform: parallaxTransform } : undefined}
      >
        <VideoAsset
          fill
          desktopSrc={assets.video.heroDesktop}
          mobileSrc={assets.video.heroMobile}
          webmSrc={assets.video.heroWebm}
          poster={assets.images.heroPoster}
          label="Hero video"
        />
      </motion.div>

      {/* Scrim. Only meaningful over real footage — over the cream placeholder it
          fades away so the panel keeps its warmth. Three layers: a base wash for
          overall legibility, a top band so the transparent header stays readable,
          and a bottom band under the copy. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ease-out-strong ${
          hasDarkMedia ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      {/* Bottom padding on phones is sized to keep a clear band for the asset
          placeholder label, which sits bottom-end at that width. Top padding
          drops correspondingly so the hero still fits one viewport. */}
      <div className="shell relative flex min-h-[100svh] flex-col justify-end pb-32 pt-24 sm:pb-24 sm:pt-32">
        <div className="max-w-3xl">
          <motion.p
            className={`eyebrow transition-colors duration-700 ${
              hasDarkMedia ? "text-gold-soft" : "text-gold"
            }`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className={`mt-6 text-[clamp(2.5rem,7.4vw,5.25rem)] leading-[1.03] transition-colors duration-700 ${
              hasDarkMedia ? "text-warm-white" : "text-charcoal"
            }`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(18px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1], delay: 0.18 }}
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            className={`mt-7 max-w-xl text-[1.0625rem] leading-[1.75] transition-colors duration-700 ${
              hasDarkMedia ? "text-cream/85" : "text-charcoal-muted"
            }`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(14px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.28 }}
          >
            {hero.body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(14px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.36 }}
          >
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2.5 bg-gold px-7 py-4 text-[0.8125rem] font-medium uppercase tracking-wide2 text-warm-white hover:bg-charcoal"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {hero.primaryCta}
            </a>

            <a
              href={hero.secondaryHref}
              className={`pressable group inline-flex items-center gap-2.5 border px-7 py-4 text-[0.8125rem] font-medium uppercase tracking-wide2 transition-colors duration-300 ${
                hasDarkMedia
                  ? "border-warm-white/50 text-warm-white hover:border-gold-soft hover:text-gold-soft"
                  : "border-charcoal/25 text-charcoal hover:border-gold hover:text-gold"
              }`}
            >
              {hero.secondaryCta}
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 ease-out-strong group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Scroll hint, aligned to the inline end so it does not fight the copy.
            Hidden on phones: a scroll affordance earns little on touch, and the
            space it frees is where the asset placeholder label sits at that
            width. */}
        <div
          className={`mt-14 hidden items-center justify-end gap-3 transition-colors duration-700 sm:flex ${
            hasDarkMedia ? "text-cream/70" : "text-charcoal-muted"
          }`}
        >
          <span className="text-[0.625rem] font-medium uppercase tracking-wide3">
            {hero.scrollHint}
          </span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden">
            <span className="absolute inset-0 bg-current opacity-25" />
            <span className="absolute inset-x-0 top-0 block h-4 animate-[nefeera-scroll-line_2.4s_cubic-bezier(0.77,0,0.175,1)_infinite] bg-current" />
          </span>
        </div>
      </div>
    </section>
  );
}
