import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "../data/Content.js";
import { WhatsAppIcon } from "./Icons.jsx";

/**
 * Floating WhatsApp button.
 *
 * Hidden while the hero is on screen — the hero already carries the same call to
 * action, and stacking a floating copy on top of it is just clutter. It appears
 * once you have scrolled past roughly one viewport, which is the point at which
 * the hero's button is gone and someone might actually want it back.
 *
 * Positioned with logical properties (`end-5`) rather than `right-5`, so an RTL
 * pass moves it to the correct corner with no change here.
 *
 * The link and its prefilled message come from Content.js — the same values the
 * hero, the header, and the contact section use. There is no second copy of the
 * number anywhere in the codebase.
 */
export default function WhatsAppFloat() {
  const { contact } = content;
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable float-elevation fixed bottom-5 end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage-deep text-warm-white hover:bg-ink sm:bottom-7 sm:end-7"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(14px) scale(0.92)" }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(14px) scale(0.92)" }
          }
          transition={{
            // Exit is faster than entry: arriving should feel considered,
            // leaving should just get out of the way.
            duration: prefersReducedMotion ? 0.12 : 0.32,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <span className="sr-only-focusable">{contact.whatsappFloatLabel}</span>
          <WhatsAppIcon className="h-7 w-7" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
