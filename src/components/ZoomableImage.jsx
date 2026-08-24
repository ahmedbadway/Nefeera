import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

/**
 * Pinch / wheel / double-tap zoom surface for the lightbox.
 *
 * Written against pointer events directly rather than layered on Motion's
 * drag: a pinch needs two pointers tracked together, and the pan has to stay
 * bounded by whatever the current scale is, which a generic drag helper does
 * not know about. Everything here still animates through Motion values, so
 * the transform stays on the compositor.
 *
 * WHAT EACH INPUT DOES:
 *   two fingers   -> pinch to scale, anchored between the fingers
 *   double tap    -> toggle between fit and 2.5x, anchored at the tap
 *   wheel / trackpad -> scale, anchored at the cursor
 *   one finger    -> pan, but only while zoomed in, so a tap still closes and
 *                    a swipe on an unzoomed image never fights the dialog
 *
 * ANCHORING is the whole trick. Scaling around the element's centre makes the
 * thing you were looking at slide away from under your fingers. Every path
 * here solves for the offset that keeps the anchor point pinned:
 *   offset' = p - (p - offset) * (scale' / scale)
 *
 * @param {object} props
 * @param {React.ReactNode} props.children  The image to make zoomable.
 * @param {number} [props.max]              Ceiling for the scale.
 * @param {(zoomed: boolean) => void} [props.onZoomChange]  Lets the dialog
 *   know, so it can keep its own gestures out of the way.
 * @param {unknown} [props.resetKey]        Change it to snap back to fit —
 *   the lightbox passes the current src so moving to another picture starts
 *   unzoomed.
 *
 * The forwarded ref exposes { zoomIn, zoomOut, reset } so on-screen buttons
 * can drive the same zoom the gestures do — a pointer is not the only way in,
 * and neither is a trackpad.
 */
const ZoomableImage = forwardRef(function ZoomableImage(
  { children, max = 4, onZoomChange, resetKey, className = "" },
  ref
) {
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef(null);
  const contentRef = useRef(null);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [zoomed, setZoomed] = useState(false);

  // Live pointers, keyed by pointerId. Two of them means a pinch.
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const pan = useRef(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  const settle = useMemo(
    () =>
      prefersReducedMotion
        ? { duration: 0 }
        : { type: "spring", duration: 0.35, bounce: 0 },
    [prefersReducedMotion]
  );

  /** How far the content may travel at a given scale before it shows a gap. */
  const panBounds = useCallback((atScale) => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return { maxX: 0, maxY: 0 };

    const frameRect = frame.getBoundingClientRect();
    // Divide out the current scale to recover the unzoomed size.
    const current = scale.get() || 1;
    const naturalW = content.getBoundingClientRect().width / current;
    const naturalH = content.getBoundingClientRect().height / current;

    return {
      maxX: Math.max(0, (naturalW * atScale - frameRect.width) / 2),
      maxY: Math.max(0, (naturalH * atScale - frameRect.height) / 2),
    };
  }, [scale]);

  const clampOffsets = useCallback(
    (atScale, nextX, nextY) => {
      const { maxX, maxY } = panBounds(atScale);
      return {
        x: Math.min(maxX, Math.max(-maxX, nextX)),
        y: Math.min(maxY, Math.max(-maxY, nextY)),
      };
    },
    [panBounds]
  );

  /** Scale to `next`, keeping the point under (px, py) — frame-centre relative — still. */
  const zoomAround = useCallback(
    (next, px, py, animated = false) => {
      const from = scale.get();
      const to = Math.min(max, Math.max(1, next));
      const ratio = to / from;

      const rawX = px - (px - x.get()) * ratio;
      const rawY = py - (py - y.get()) * ratio;
      const bounded = to === 1 ? { x: 0, y: 0 } : clampOffsets(to, rawX, rawY);

      if (animated && !prefersReducedMotion) {
        animate(scale, to, settle);
        animate(x, bounded.x, settle);
        animate(y, bounded.y, settle);
      } else {
        scale.set(to);
        x.set(bounded.x);
        y.set(bounded.y);
      }

      setZoomed(to > 1.01);
    },
    [clampOffsets, max, prefersReducedMotion, scale, settle, x, y]
  );

  /** Pointer position relative to the frame's centre. */
  const relativeToCentre = (event) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return { px: 0, py: 0 };
    return {
      px: event.clientX - (rect.left + rect.width / 2),
      py: event.clientY - (rect.top + rect.height / 2),
    };
  };

  const reset = useCallback(
    (animated = true) => {
      if (animated && !prefersReducedMotion) {
        animate(scale, 1, settle);
        animate(x, 0, settle);
        animate(y, 0, settle);
      } else {
        scale.set(1);
        x.set(0);
        y.set(0);
      }
      setZoomed(false);
    },
    [prefersReducedMotion, scale, settle, x, y]
  );

  // A new picture always starts fitted.
  useEffect(() => {
    reset(false);
    // reset is stable enough for this: it only closes over motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    onZoomChange?.(zoomed);
  }, [zoomed, onZoomChange]);

  // Buttons step through the same anchored zoom, centred on the frame.
  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomAround(scale.get() * 1.6, 0, 0, true),
      zoomOut: () => zoomAround(scale.get() / 1.6, 0, 0, true),
      reset: () => reset(true),
    }),
    [reset, scale, zoomAround]
  );

  const onPointerDown = (event) => {
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    event.currentTarget.setPointerCapture?.(event.pointerId);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const rect = frameRef.current.getBoundingClientRect();
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale: scale.get(),
        px: (a.x + b.x) / 2 - (rect.left + rect.width / 2),
        py: (a.y + b.y) / 2 - (rect.top + rect.height / 2),
        x: x.get(),
        y: y.get(),
      };
      pan.current = null;
      return;
    }

    if (pointers.current.size === 1 && scale.get() > 1.01) {
      pan.current = {
        startX: event.clientX,
        startY: event.clientY,
        x: x.get(),
        y: y.get(),
      };
    }
  };

  const onPointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (!pinch.current.distance) return;

      const next = Math.min(
        max,
        Math.max(1, (distance / pinch.current.distance) * pinch.current.scale)
      );
      const ratio = next / pinch.current.scale;
      const rawX = pinch.current.px - (pinch.current.px - pinch.current.x) * ratio;
      const rawY = pinch.current.py - (pinch.current.py - pinch.current.y) * ratio;
      const bounded = clampOffsets(next, rawX, rawY);

      scale.set(next);
      x.set(bounded.x);
      y.set(bounded.y);
      setZoomed(next > 1.01);
      return;
    }

    if (pan.current) {
      const bounded = clampOffsets(
        scale.get(),
        pan.current.x + (event.clientX - pan.current.startX),
        pan.current.y + (event.clientY - pan.current.startY)
      );
      x.set(bounded.x);
      y.set(bounded.y);
    }
  };

  const endPointer = (event) => {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) pan.current = null;

    // A pinch that ended near 1 snaps cleanly back to fit.
    if (!pinch.current && scale.get() < 1.05 && scale.get() !== 1) reset(true);
  };

  const onDoubleTap = (event) => {
    const { px, py } = relativeToCentre(event);
    if (scale.get() > 1.01) {
      reset(true);
    } else {
      zoomAround(2.5, px, py, true);
    }
  };

  // Touch has no dblclick, so pair up two quick taps in the same spot.
  const onPointerUp = (event) => {
    endPointer(event);
    if (event.pointerType === "mouse") return;

    const now = performance.now();
    const isDouble =
      now - lastTap.current.time < 300 &&
      Math.hypot(event.clientX - lastTap.current.x, event.clientY - lastTap.current.y) < 30;

    if (isDouble) {
      onDoubleTap(event);
      lastTap.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTap.current = { time: now, x: event.clientX, y: event.clientY };
    }
  };

  const onWheel = (event) => {
    event.preventDefault();
    const { px, py } = relativeToCentre(event);
    zoomAround(scale.get() * Math.exp(-event.deltaY * 0.0015), px, py, false);
  };

  // React's onWheel is passive, so preventDefault there is ignored and the page
  // scrolls behind the dialog. Bind it non-passively instead.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const handler = (event) => onWheel(event);
    frame.addEventListener("wheel", handler, { passive: false });
    return () => frame.removeEventListener("wheel", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={frameRef}
      // inline-flex, and no size of its own: the frame takes the picture's
      // fitted dimensions, which does two things at once. Zoomed content is
      // clipped to the picture's own rectangle rather than sprawling over the
      // dialog, and the empty space around it still belongs to the backdrop,
      // so clicking beside the photo closes the lightbox as it always has.
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      // The browser's own pan/zoom would fight every gesture above.
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={endPointer}
      onDoubleClick={onDoubleTap}
    >
      <motion.div
        ref={contentRef}
        style={{ x, y, scale, cursor: zoomed ? "grab" : "zoom-in" }}
        className="origin-center touch-none"
      >
        {children}
      </motion.div>
    </div>
  );
});

export default ZoomableImage;
