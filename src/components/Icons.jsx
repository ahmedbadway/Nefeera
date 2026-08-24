import { useIsRtl } from "../utils/UseLanguage.js";

/**
 * Custom SVG icons.
 *
 * Drawn by hand rather than pulled from an icon library — adding a dependency
 * for six glyphs is not worth the bundle weight, and these are tuned to the
 * hairline weight the rest of the page uses.
 *
 * All of them inherit `currentColor` and are marked aria-hidden: the accessible
 * name always comes from the surrounding button or link, never from the icon.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

/**
 * Arrows and chevrons point along the reading direction, so they mirror under
 * Arabic. Every other glyph here is symmetric or orientation-free and stays
 * exactly as drawn — a mirrored WhatsApp mark or magnifier would just look
 * broken.
 */
export function ArrowIcon({ className = "" }) {
  const isRtl = useIsRtl();
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: isRtl ? "scaleX(-1)" : undefined }}
      {...base}
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function ChevronIcon({ className = "", direction = "end" }) {
  const isRtl = useIsRtl();
  // `direction` is logical, so "start" already means "left in English, right
  // in Arabic". Two flips cancel: a start-chevron in RTL points right again.
  const flipped = (direction === "start") !== isRtl;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      {...base}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function MenuIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

/**
 * WhatsApp glyph. Solid fill rather than a stroke — the handset-in-bubble mark
 * is only recognizable in its filled form.
 */
export function WhatsAppIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.94 9.94 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 1.82c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.76c0 4.5-3.66 8.15-8.16 8.15a8.16 8.16 0 0 1-4.15-1.14l-.3-.18-3.06.8.82-2.99-.2-.31a8.09 8.09 0 0 1-1.24-4.33c0-4.5 3.66-8.15 8.13-8.15Z" />
      <path d="M9.47 7.23c-.18-.4-.36-.41-.53-.42h-.46c-.16 0-.42.06-.63.3-.22.24-.83.81-.83 1.98s.85 2.3.97 2.46c.12.16 1.65 2.64 4.07 3.6 2.01.79 2.42.63 2.86.59.43-.04 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.53.12-.16.24-.61.77-.75.93-.14.16-.28.18-.51.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.63-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.3-.73-1.77Z" />
    </svg>
  );
}

export function PlayIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M8 5.5l11 6.5-11 6.5z" />
    </svg>
  );
}

export function PauseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9.5 5v14" />
      <path d="M14.5 5v14" />
    </svg>
  );
}

export function ZoomInIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

export function ZoomOutIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
      <path d="M8 11h6" />
    </svg>
  );
}
