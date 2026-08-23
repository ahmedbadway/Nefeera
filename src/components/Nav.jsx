import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "../data/Content.js";
import { useHeroMedia } from "../utils/UseHeroMedia.js";
import Logo from "./Logo.jsx";
import { MenuIcon, CloseIcon, WhatsAppIcon } from "./Icons.jsx";

/**
 * Fixed header.
 *
 * Sits transparent over the hero video with the light logo, then picks up a
 * glass background and a gold hairline once you scroll past the hero. The
 * transition is opacity/background only — the header never moves, so it cannot
 * cause layout shift or jitter while scrolling.
 *
 * THERE IS NO LINK BAR, AT ANY WIDTH.
 * Navigation lives entirely behind the menu button, so the header carries just
 * the lockup and one control and stays out of the way of the film behind it.
 * The panel it opens is the same one on a phone and on a desktop; only the
 * type scale changes.
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const solid = scrolled || menuOpen;

  // At the top of the page the header sits on the hero. Cream type only works
  // there if there is real media behind it — with nothing uploaded the hero is a
  // light warm-white panel, so the header has to stay ink or it disappears.
  // See utils/UseHeroMedia.js.
  const { hasDarkMedia } = useHeroMedia();
  const lightType = !solid && hasDarkMedia;
  const logoColor = lightType ? "light" : "dark";

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed start-4 top-4 z-[60] rounded-sm bg-ink px-4 py-2 text-sm text-warm-white"
      >
        {nav.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-out-strong ${
          solid
            ? "glass border-x-0 border-t-0"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-6 py-4">
          <a
            href="#hero"
            className="pressable inline-flex shrink-0"
            aria-label={`${content.brand.name} — home`}
          >
            <Logo variant="wordmark" size="xs" color={logoColor} />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`pressable -me-2 inline-flex h-11 w-11 items-center justify-center ${
              lightType ? "text-warm-white" : "text-ink"
            }`}
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
            className="fixed inset-0 z-[55] bg-warm-white/85 backdrop-blur-2xl"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="shell flex h-full flex-col">
              <div className="flex items-center justify-between py-4">
                <Logo variant="wordmark" size="xs" color="dark" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="pressable -me-2 inline-flex h-11 w-11 items-center justify-center text-ink"
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
                        : `nefeera-menu-in 380ms cubic-bezier(0.23,1,0.32,1) ${index * 45}ms both`,
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
                  className="pressable mt-9 inline-flex items-center justify-center gap-2.5 bg-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-wide2 text-warm-white"
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
