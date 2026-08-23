import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { content } from "../data/Content.js";
import Logo from "./Logo.jsx";
import { MenuIcon, CloseIcon, WhatsAppIcon } from "./Icons.jsx";

/**
 * Floating glass pill header.
 *
 * Detached from every edge, so the film stays visible around it — the header
 * reads as an object floating over the footage rather than a bar capping the
 * page. It carries its own glass at all times, which is what freed it from the
 * old dark-media color switching: the pill supplies its own contrast whatever
 * plays behind it. Scrolling only strengthens the fill a touch.
 *
 * THERE IS NO LINK BAR, AT ANY WIDTH.
 * Navigation lives entirely behind the menu button, so the header carries just
 * the lockup and one control and stays out of the way of the film behind it.
 * The panel it opens is the same one on a phone and on a desktop; only the
 * type scale changes.
 *
 * Scroll position is read through Motion's useScroll rather than a scroll
 * listener — the raw listener is the one scroll API this codebase bans.
 *
 * Spacing uses logical properties throughout (ps/pe, ms/me, start/end) so the
 * planned Arabic RTL pass is a direction flip with no layout rewrite.
 */
export default function Nav() {
  const { nav, contact } = content;
  const prefersReducedMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const { scrollY } = useScroll();
  useEffect(() => {
    setScrolled(scrollY.get() > 40);
  }, [scrollY]);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  // Lock the page behind the open menu, and restore the scrollbar gutter
  // so the header does not jump sideways as the scrollbar disappears.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingInlineEnd = `${scrollbarWidth}px`;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Move focus into the panel on open, and back to the trigger on close.
  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
    } else if (document.activeElement === document.body) {
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed start-4 top-4 z-[60] rounded-sm bg-ink px-4 py-2 text-sm text-warm-white"
      >
        {nav.skipToContent}
      </a>

      {/* The outer strip is pointer-transparent so the film stays clickable-
          through around the pill; only the pill itself takes the pointer. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className={`glass-pill pointer-events-auto mx-auto mt-3 flex w-[min(100%-2rem,64rem)] items-center justify-between gap-4 rounded-full py-2 pe-2 ps-5 transition-colors duration-500 ease-out-strong sm:mt-4 ${
            scrolled || menuOpen ? "bg-warm-white/80" : ""
          }`}
        >
          <a
            href="#hero"
            className="pressable inline-flex shrink-0"
            aria-label={`${content.brand.name} — home`}
          >
            <Logo variant="inline" size="xs" color="dark" />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="pressable inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors duration-200 hover:bg-ink/10"
          >
            <span className="sr-only-focusable">{nav.openMenu}</span>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={nav.menuLabel}
            className="fixed inset-0 z-[55] bg-warm-white/65 backdrop-blur-[var(--glass-blur)]"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="shell flex h-full flex-col">
              <div className="flex items-center justify-between py-5">
                <Logo variant="inline" size="xs" color="dark" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="pressable inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors duration-200 hover:bg-ink/10"
                >
                  <span className="sr-only-focusable">{nav.closeMenu}</span>
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <nav
                aria-label={nav.menuLabel}
                className="flex w-full max-w-xl flex-1 flex-col justify-center gap-1 pb-24"
              >
                {nav.items.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-champagne/40 py-4 font-display text-[clamp(2rem,5vw,3.25rem)] text-ink transition-colors duration-200 hover:text-sage-deep"
                    style={{
                      // Short stagger so the list cascades in rather than
                      // appearing all at once. Decorative only — the links are
                      // clickable from the first frame.
                      animation: prefersReducedMotion
                        ? undefined
                        : `nefeera-menu-in 320ms cubic-bezier(0.23,1,0.32,1) ${index * 40}ms both`,
                    }}
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="pressable mt-9 inline-flex items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-wide2 text-warm-white hover:bg-sage-deep"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {nav.cta}
                </a>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
