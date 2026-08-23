import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content, getAssetSpec } from "../data/Content.js";
import Asset from "./Asset.jsx";
import { CloseIcon, ChevronIcon } from "./Icons.jsx";

/**
 * Gallery lightbox.
 *
 * Keyboard is a first-class input here, not an afterthought: Escape closes,
 * arrow keys move, and Tab is trapped inside the dialog so focus cannot wander
 * onto the page behind it. Focus returns to the thumbnail that opened it.
 *
 * Missing images work here too — a slot with no file shows the same labeled
 * placeholder it shows in the grid, at the same aspect ratio, rather than an
 * empty black frame.
 *
 * @param {object} props
 * @param {string[]} props.images   Paths from content.assets.gallery.
 * @param {number|null} props.index Which image is open; null when closed.
 * @param {() => void} props.onClose
 * @param {(next: number) => void} props.onNavigate
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);

  const isOpen = index !== null && index >= 0;
  const copy = content.gallery.lightbox;

  const goNext = useCallback(() => {
    if (!isOpen) return;
    onNavigate((index + 1) % images.length);
  }, [isOpen, index, images.length, onNavigate]);

  const goPrevious = useCallback(() => {
    if (!isOpen) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [isOpen, index, images.length, onNavigate]);

  // Remember what had focus so it can be handed back on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else if (previouslyFocused.current instanceof HTMLElement) {
      previouslyFocused.current.focus();
      previouslyFocused.current = null;
    }
  }, [isOpen]);

  // Keyboard handling + scroll lock, both live only while the dialog is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingInlineEnd = `${scrollbarWidth}px`;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (event.key !== "Tab") return;

      // Focus trap. Cycle within the dialog's own controls.
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, goNext, goPrevious]);

  const currentSrc = isOpen ? images[index] : null;
  const currentSpec = currentSrc ? getAssetSpec(currentSrc) : null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={copy.regionLabel}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.22, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header: counter and close */}
          <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-[0.75rem] uppercase tracking-wide2 text-warm-white/70">
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")} {copy.counterSeparator}{" "}
                {String(images.length).padStart(2, "0")}
              </span>
              <span className="sr-only-focusable">
                {`${index + 1} ${copy.counterSeparator} ${images.length}. ${copy.hint}`}
              </span>
            </p>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="glass-pill-dark pressable inline-flex h-11 w-11 items-center justify-center rounded-full text-warm-white hover:text-champagne"
            >
              <span className="sr-only-focusable">{copy.close}</span>
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Stage. Clicking the backdrop closes; clicking the image does not. */}
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-8"
            onClick={onClose}
          >
            <motion.div
              key={currentSrc}
              onClick={(event) => event.stopPropagation()}
              className="max-w-full"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "scale(0.97)" }
              }
              animate={{ opacity: 1, transform: "scale(1)" }}
              transition={{
                duration: prefersReducedMotion ? 0.12 : 0.28,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <Asset
                src={currentSrc}
                ratio={currentSpec?.ratio}
                objectFit="contain"
                priority
                className="h-auto max-h-[72vh] w-auto max-w-[92vw] sm:max-h-[76vh]"
              />
            </motion.div>
          </div>

          {/* Footer controls. Kept at the bottom rather than floating over the
              image edges, where they would sit on top of the photograph. */}
          <div className="flex shrink-0 items-center justify-center gap-3 pb-7 sm:pb-9">
            <button
              type="button"
              onClick={goPrevious}
              className="glass-pill-dark pressable inline-flex h-12 w-12 items-center justify-center rounded-full text-warm-white hover:text-champagne"
            >
              <span className="sr-only-focusable">{copy.previous}</span>
              <ChevronIcon className="h-5 w-5" direction="start" />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="glass-pill-dark pressable inline-flex h-12 w-12 items-center justify-center rounded-full text-warm-white hover:text-champagne"
            >
              <span className="sr-only-focusable">{copy.next}</span>
              <ChevronIcon className="h-5 w-5" direction="end" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
