import { motion, useReducedMotion } from "motion/react";
import { LANGUAGES, setLanguage, useLanguage } from "../utils/UseLanguage.js";

/**
 * EN / ع switch.
 *
 * A segmented control rather than a single button that flips: both languages
 * stay visible, so an Arabic speaker landing on the English page can see their
 * option without reading the English label first. The active side is marked by
 * an ink pill that slides between the two — one `layoutId`, so Motion animates
 * the movement rather than cross-fading two separate pills.
 *
 * Both labels are set in their own language ("EN", "ع"), never translated.
 * A language switch that renders its options in the language you are trying to
 * leave is the classic version of this control done wrong.
 *
 * @param {object} props
 * @param {"pill"|"menu"} [props.variant] "pill" is the compact form for the
 *   nav bar; "menu" is the larger form inside the open menu panel.
 */
export default function LanguageToggle({ variant = "pill", className = "" }) {
  const language = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const compact = variant === "pill";
  const codes = Object.keys(LANGUAGES);

  return (
    <div
      role="group"
      aria-label="Language / اللغة"
      className={`relative inline-flex shrink-0 items-center rounded-full bg-ink/5 p-0.5 ${className}`}
    >
      {codes.map((code) => {
        const active = code === language;
        const { label, fullLabel } = LANGUAGES[code];

        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={`pressable relative inline-flex items-center justify-center rounded-full transition-colors duration-200 ${
              compact ? "h-9 min-w-[2.25rem] px-2.5" : "h-11 min-w-[3rem] px-4"
            } ${active ? "text-warm-white" : "text-ink-muted hover:text-ink"}`}
          >
            {active ? (
              <motion.span
                aria-hidden="true"
                layoutId={`language-pill-${variant}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.4, bounce: 0.15 }
                }
              />
            ) : null}

            {/* The visible label is the language's own name; the accessible
                name spells it out so a screen reader does not announce a bare
                "ع" or "EN" with no context. */}
            <span className="sr-only-focusable">{fullLabel}</span>
            <span
              aria-hidden="true"
              className={`relative font-medium leading-none ${
                compact ? "text-[0.6875rem]" : "text-[0.8125rem]"
              } ${code === "en" ? "uppercase tracking-wide2" : "tracking-normal"}`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
