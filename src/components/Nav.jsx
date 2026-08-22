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
 * warm-white background and a gold hairline once you scroll past the hero.
 * The transition is opacity/background only — the header never moves, so it
 * cannot cause layout shift or jitter while scrolling.
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

  // Lock the page behind the open mobile menu, and restore the scrollbar gutter
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
  // light cream panel, so the header has to stay charcoal or it disappears.
  // See utils/UseHeroMedia.js.
  const { hasDarkMedia } = useHeroMedia();
  const lightType = !solid && hasDarkMedia;
  const logoColor = lightType ? "light" : "dark";

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed start-4 top-4 z-[60] rounded-sm bg-charcoal px-4 py-2 text-sm text-warm-white"
      >
        {nav.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-out-strong ${
          solid
            ? "border-b border-gold/25 bg-warm-white/95 backdrop-blur-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-6 py-4">
          <a
            href="#hero"
            className="pressable inline-flex shrink-0"
            aria-label={`${content.brand.name} — home`}
          >
            <Logo variant="wordmark" size="sm" color={logoColor} />
          </a>

          <nav aria-label={nav.menuLabel} className="hidden items-center gap-9 lg:flex">
            {nav.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`group relative py-1 text-[0.8125rem] font-medium uppercase tracking-wide2 transition-colors duration-200 ${
                  lightType
                    ? "text-warm-white hover:text-gold-soft"
                    : "text-charcoal hover:text-gold"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out-strong group-hover:scale-x-100"
                />
              </a>
            ))}

            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`pressable inline-flex items-center gap-2 border px-5 py-2.5 text-[0.75rem] font-medium uppercase tracking-wide2 ${
                lightType
                  ? "border-warm-white/60 text-warm-white hover:border-gold-soft hover:text-gold-soft"
                  : "border-gold text-charcoal hover:bg-gold hover:text-warm-white"
              }`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {nav.cta}
            </a>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`pressable -me-2 inline-flex h-11 w-11 items-center justify-center lg:hidden ${
              lightType ? "text-warm-white" : "text-charcoal"
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
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={nav.menuLabel}
            className="fixed inset-0 z-[55] bg-warm-white lg:hidden"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="shell flex h-full flex-col">
              <div className="flex items-center justify-between py-4">
                <Logo variant="wordmark" size="sm" color="dark" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="pressable -me-2 inline-flex h-11 w-11 items-center justify-center text-charcoal"
                >
                  <span className="sr-only-focusable">{nav.closeMenu}</span>
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <nav
                aria-label={nav.menuLabel}
                className="flex flex-1 flex-col justify-center gap-1 pb-24"
              >
                {nav.items.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-gold/20 py-5 font-display text-[2rem] text-charcoal transition-colors duration-200 hover:text-gold"
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
                  className="pressable mt-9 inline-flex items-center justify-center gap-2.5 bg-gold px-6 py-4 text-[0.8125rem] font-medium uppercase tracking-wide2 text-warm-white"
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
