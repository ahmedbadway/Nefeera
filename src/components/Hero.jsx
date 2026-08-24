import { motion, useReducedMotion } from "motion/react";
import { useContent } from "../utils/UseLanguage.js";
import { useHeroMedia } from "../utils/UseHeroMedia.js";
import Button from "./Button.jsx";
import { WhatsAppIcon } from "./Icons.jsx";

/**
 * Full-height opening section.
 *
 * THE HERO NO LONGER OWNS THE FILM. The video lives in FixedVideoBackdrop,
 * behind the whole page; this section is transparent, so the opening viewport
 * shows the footage raw with the type directly on it — the one place on the
 * site where text sits on film instead of on glass. Depth comes free: the
 * content scrolls while the film stays put, which reads like parallax without
 * a scroll-linked transform.
 *
 * TWO DISTINCT LOOKS, NOT ONE LOOK WITH A HOLE IN IT:
 * With footage uploaded, warm-white type over a directional ink scrim. With no
 * media, the backdrop shows its sage-mist placeholder field, the scrim fades
 * out, and the type flips to ink. The switch is driven by useHeroMedia() and
 * transitioned rather than snapped.
 *
 * The layout is deliberately bottom-and-start aligned rather than centered —
 * a centered hero is the generic default this project exists to avoid.
 */
export default function Hero() {
  const { hero, contact } = useContent();
  const prefersReducedMotion = useReducedMotion();

  // hasDarkMedia, not hasVideo: a poster with no playable film still puts a
  // dark picture behind this copy. See utils/UseHeroMedia.js.
  const { hasDarkMedia } = useHeroMedia();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh]"
      aria-label={hero.headline}
    >
      {/* Scrim. Only meaningful over real footage — over the placeholder field
          it fades away.

          Directional rather than flat: the copy sits at the inline start, so
          the wash is heaviest there and thins out across the frame, leaving
          the end side of the footage genuinely visible. A second, softer
          bottom gradient keeps the scroll cue readable. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ease-out-strong ${
          hasDarkMedia ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/35 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
      </div>

      {/* Content */}
      {/* Bottom padding on phones is sized to keep a clear band for the asset
          placeholder label, which sits bottom-end at that width. Top padding
          drops correspondingly so the hero still fits one viewport. */}
      <div className="shell relative flex min-h-[100svh] flex-col justify-end pb-32 pt-24 sm:pb-24 sm:pt-32">
        <div className="max-w-3xl">
          <motion.p
            className={`eyebrow transition-colors duration-700 ${
              hasDarkMedia ? "text-champagne" : "text-sage-deep"
            }`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className={`mt-6 text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.05] transition-colors duration-700 ${
              hasDarkMedia ? "text-warm-white" : "text-ink"
            }`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: "translateY(14px)", filter: "blur(6px)" }
            }
            animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.11 }}
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            className={`mt-6 max-w-lg text-[0.9375rem] leading-[1.75] transition-colors duration-700 ${
              hasDarkMedia ? "text-warm-white/85" : "text-ink-muted"
            }`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.18 }}
          >
            {hero.body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.25 }}
          >
            <Button
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              tone={hasDarkMedia ? "dark" : "light"}
              icon={<WhatsAppIcon className="h-4 w-4" />}
            >
              {hero.primaryCta}
            </Button>

            <Button
              href={hero.secondaryHref}
              variant="ghost"
              tone={hasDarkMedia ? "dark" : "light"}
              arrow
            >
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </div>

        {/* Scroll hint, aligned to the inline end so it does not fight the copy.
            Hidden on phones: a scroll affordance earns little on touch, and the
            space it frees is where the asset placeholder label sits at that
            width. */}
        <div
          className={`mt-14 hidden items-center justify-end gap-3 transition-colors duration-700 sm:flex ${
            hasDarkMedia ? "text-warm-white/70" : "text-ink-muted"
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
