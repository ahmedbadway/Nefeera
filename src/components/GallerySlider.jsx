import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { getAssetSpec } from "../data/Content.js";
import Asset from "./Asset.jsx";
import Reveal from "./Reveal.jsx";
import { ChevronIcon } from "./Icons.jsx";

/**
 * Horizontal drag gallery — built on motion/react only, no slider library.
 *
 * The track is a draggable flex row of glass-framed cards at mixed widths:
 * every card shares one height and takes its width from its assetSpecs ratio
 * (3/4 beside 9/16), so the strip reads as an edit, not a row of tiles. Cards
 * blur the raw film directly — this is the one place .glass-frame's real
 * backdrop blur runs outside a panel.
 *
 * Full-bleed: the viewport spans the screen while the track's start padding
 * lines the first card up with the .shell column, so dragging feels edge to
 * edge without breaking the page grid.
 *
 * INPUTS: drag with momentum (pointer/touch), the prev/next buttons page by
 * 80% of the viewport, and focusing a card (keyboard Tab) springs it into
 * view. A click that ends a real swipe is swallowed by a distance guard so a
 * fling never opens the lightbox. Under prefers-reduced-motion the whole
 * thing renders as a plain scrollable row with snap points instead.
 *
 * @param {object} props
 * @param {string[]} props.images        Paths from content.assets.gallery.
 * @param {(index: number) => void} props.onOpen  Opens the lightbox.
 * @param {string} props.viewLabel       SR label prefix for each card.
 * @param {{previous: string, next: string}} props.pagingLabels  Reused from
 *   the lightbox copy — no new strings are invented for the paging buttons.
 */

// Lines the track's first card up with the .shell column: the gutter alone
// under 1440px, the centering margin plus the gutter above it.
const SHELL_ALIGNED_PADDING =
  "max(var(--gutter), calc((100% - var(--shell-max)) / 2 + var(--gutter)))";

// How far a gesture may travel and still count as a tap. Matches the ~10px
// browsers themselves allow before a touch stops being a click.
const TAP_SLOP = 10;

function GalleryCard({ src, index, viewLabel, onOpen, draggedFarRef }) {
  const spec = getAssetSpec(src);
  const label = `Gallery ${String(index + 1).padStart(2, "0")}`;

  return (
    <Reveal
      delay={(index % 3) * 0.05}
      className={`h-[clamp(300px,46vh,440px)] shrink-0 ${index % 2 === 1 ? "mt-10" : ""}`}
    >
      <button
        type="button"
        onClick={() => {
          // Swallow the click that ends a real drag, but only a real one.
          // No finger taps a phone without a few pixels of travel, so gating
          // on "a drag started" made every tap on a card do nothing. Gate on
          // DISTANCE instead: past the threshold it was a swipe, under it the
          // person meant to open the picture.
          if (draggedFarRef.current) return;
          onOpen(index);
        }}
        className="glass-frame group relative block h-full rounded-2xl"
      >
        <span className="sr-only-focusable">
          {`${viewLabel} — ${spec.alt || label}`}
        </span>

        <Asset
          src={src}
          ratio={spec.ratio}
          label={label}
          sizes="(max-width: 640px) 70vw, 30vw"
          imgClassName="transition-transform duration-[600ms] ease-out-strong group-hover:scale-[1.04]"
          className="h-full overflow-hidden rounded-[10px]"
        />
      </button>
    </Reveal>
  );
}

export default function GallerySlider({ images, onOpen, viewLabel, pagingLabels }) {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  // True only once a gesture has travelled far enough to be a swipe rather
  // than a tap. Read by the cards to decide whether their click was meant.
  const draggedFarRef = useRef(false);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    const measure = () => {
      const overflow = track.scrollWidth - viewport.offsetWidth;
      // LTR: dragging start-ward means negative x. TODO for the Arabic pass:
      // flip to { left: 0, right: overflow } when dir="rtl".
      setConstraints({ left: -Math.max(overflow, 0), right: 0 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);

    // Focusing a card that sits off-screen makes the browser scroll this
    // overflow-hidden box itself. That scroll is invisible but real, and it
    // desynchronizes the drag geometry — the track's x and the box's
    // scrollLeft then fight each other. Undo it; onCardFocus below moves the
    // track instead, which is the motion the reader actually sees.
    const resetScroll = () => {
      viewport.scrollLeft = 0;
    };
    viewport.addEventListener("scroll", resetScroll);

    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", resetScroll);
    };
  }, [prefersReducedMotion, images.length]);

  const clampX = (value) =>
    Math.min(constraints.right, Math.max(constraints.left, value));

  const springTo = (value) =>
    animate(x, clampX(value), { type: "spring", duration: 0.5, bounce: 0.2 });

  const page = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    springTo(x.get() - direction * viewport.offsetWidth * 0.8);
  };

  // Keyboard: bring the focused card fully into view.
  const onCardFocus = (event) => {
    const viewport = viewportRef.current;
    const card = event.target.closest("[data-gallery-card]");
    if (!viewport || !card) return;

    // Undo the browser's own focus scroll before measuring, or the card looks
    // already-visible and the track never moves. See the listener above.
    viewport.scrollLeft = 0;

    const viewportRect = viewport.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const margin = 32;

    if (cardRect.left < viewportRect.left + margin) {
      springTo(x.get() + (viewportRect.left + margin - cardRect.left));
    } else if (cardRect.right > viewportRect.right - margin) {
      springTo(x.get() - (cardRect.right - (viewportRect.right - margin)));
    }
  };

  // Reduced motion: a plain scrollable row. Native scrolling, native focus
  // handling, snap points, no drag physics, no paging chrome.
  if (prefersReducedMotion) {
    return (
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
        style={{
          paddingInlineStart: SHELL_ALIGNED_PADDING,
          paddingInlineEnd: "var(--gutter)",
        }}
      >
        {images.map((src, index) => (
          <div key={src} className="snap-start">
            <GalleryCard
              src={src}
              index={index}
              viewLabel={viewLabel}
              onOpen={onOpen}
              draggedFarRef={draggedFarRef}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{
            x,
            paddingInlineStart: SHELL_ALIGNED_PADDING,
            paddingInlineEnd: "var(--gutter)",
          }}
          dragConstraints={constraints}
          dragElastic={0.08}
          dragTransition={{
            power: 0.28,
            timeConstant: 320,
            bounceStiffness: 240,
            bounceDamping: 28,
          }}
          onPointerDownCapture={() => {
            // Every gesture starts innocent; the move handler decides.
            draggedFarRef.current = false;
          }}
          onDrag={(event, info) => {
            if (Math.abs(info.offset.x) > TAP_SLOP) {
              draggedFarRef.current = true;
            }
          }}
          onDragEnd={() => {
            // Cleared a frame later so the click fired by this same pointer-up
            // still sees the guard; the next pointerdown resets it anyway.
            requestAnimationFrame(() => {
              draggedFarRef.current = false;
            });
          }}
          onFocus={onCardFocus}
          className="flex cursor-grab select-none items-start gap-4 active:cursor-grabbing sm:gap-6"
        >
          {images.map((src, index) => (
            <div key={src} data-gallery-card="">
              <GalleryCard
                src={src}
                index={index}
                viewLabel={viewLabel}
                onOpen={onOpen}
                draggedFarRef={draggedFarRef}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Paging, under the strip like film credits. Labels reuse the lightbox
          copy rather than inventing new strings. */}
      <div className="shell mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => page(-1)}
          className="pressable flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 bg-warm-white/60 text-ink hover:border-sage-deep hover:text-sage-deep"
        >
          <span className="sr-only-focusable">{pagingLabels.previous}</span>
          <ChevronIcon className="h-5 w-5" direction="start" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          className="pressable flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 bg-warm-white/60 text-ink hover:border-sage-deep hover:text-sage-deep"
        >
          <span className="sr-only-focusable">{pagingLabels.next}</span>
          <ChevronIcon className="h-5 w-5" direction="end" />
        </button>
      </div>
    </div>
  );
}
