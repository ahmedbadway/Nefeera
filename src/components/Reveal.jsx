import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-triggered entrance.
 *
 * Motion-system decisions baked in here rather than repeated at every call site:
 *
 * - Animates the full `transform` string, not Motion's `x`/`y` shorthands.
 *   The shorthands run on the main thread via requestAnimationFrame and drop
 *   frames while the page is still loading images; the full string is
 *   hardware-accelerated.
 * - Never starts from `scale(0)` or from a large offset. 12px and a slight
 *   opacity ramp is enough to read as "arriving" without looking like a slide.
 * - `once: true` — this fires as you scroll down the page. Re-triggering on the
 *   way back up turns a nice detail into an irritation.
 * - Under `prefers-reduced-motion` the wrapper renders as a plain element with
 *   no transform and no transition at all.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.delay] Stagger delay in seconds. Keep under ~0.24.
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as] Element to render.
 * @param {number} [props.distance] Travel distance in px.
 * @param {number} [props.blurIn] Entry blur in px (0 disables). TEXT BLOCKS
 *   ONLY, and keep it at 6-8: `filter` is painted on the main thread, so a
 *   blur across a large image or panel surface drops frames while a small
 *   text block does not.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  distance = 12,
  blurIn = 0,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const initial = { opacity: 0, transform: `translateY(${distance}px)` };
  const target = { opacity: 1, transform: "translateY(0px)" };
  if (blurIn > 0) {
    initial.filter = `blur(${blurIn}px)`;
    target.filter = "blur(0px)";
  }

  return (
    <MotionTag
      className={className}
      initial={initial}
      whileInView={target}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
