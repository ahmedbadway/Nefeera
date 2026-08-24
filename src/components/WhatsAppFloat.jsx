import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useContent } from "../utils/UseLanguage.js";
import { WhatsAppIcon } from "./Icons.jsx";

/**
 * Floating WhatsApp button.
 *
 * A solid sage core inside a thin glass ring — the ring ties it to the site's
 * glass chrome while the core stays opaque, because a translucent WhatsApp
 * button reads as a ghost of itself over moving footage.
 *
 * Hidden while the hero is on screen — the hero already carries the same call to
 * action, and stacking a floating copy on top of it is just clutter. It appears
 * once you have scrolled past roughly one viewport, which is the point at which
 * the hero's button is gone and someone might actually want it back. Scroll
 * position comes from Motion's useScroll — the raw listener stays banned.
 *
 * Positioned with logical properties (`end-5`) rather than `right-5`, so an RTL
 * pass moves it to the correct corner with no change here. It mirrors the film's
 * pause control, which holds the bottom-start corner.
 *
 * The link and its prefilled message come from Content.js — the same values the
 * hero, the header, and the contact section use. There is no second copy of the
 * number anywhere in the codebase.
 */
export default function WhatsAppFloat() {
  const { contact } = useContent();
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const { scrollY } = useScroll();
  useEffect(() => {
    setVisible(scrollY.get() > window.innerHeight * 0.9);
  }, [scrollY]);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > window.innerHeight * 0.9);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill pressable float-elevation fixed bottom-5 end-5 z-40 block rounded-full p-1 sm:bottom-7 sm:end-7"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(14px) scale(0.95)" }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(14px) scale(0.95)" }
          }
          transition={{
            // Exit is faster than entry: arriving should feel considered,
            // leaving should just get out of the way.
            duration: prefersReducedMotion ? 0.12 : 0.32,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <span className="sr-only-focusable">{contact.whatsappFloatLabel}</span>
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-deep text-warm-white transition-colors duration-200 hover:bg-ink"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
