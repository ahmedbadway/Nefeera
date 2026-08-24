import { ArrowIcon } from "./Icons.jsx";

/**
 * The one pill button.
 *
 * Every call-to-action on the site renders through this component — the hero
 * pair, the menu CTA, the contact CTA — so the pill shape, the press scale,
 * and the hover language stay identical everywhere.
 *
 * BUTTON-IN-BUTTON: with `arrow` set, the trailing arrow sits inside its own
 * small circle that drifts up-and-forward on hover. The drift is a plain CSS
 * transition on transform — cheap, interruptible, and gated to real pointers
 * by hoverOnlyWhenSupported.
 *
 * NO GLASS HERE ON PURPOSE. Buttons usually sit inside a panel that already
 * paid for a backdrop blur, and nesting backdrop-filters is banned (see
 * Global.css). Solid ink / warm-white fills also simply read better at this
 * size than translucency would.
 *
 * @param {object} props
 * @param {"primary"|"ghost"} [props.variant] primary = solid pill,
 *   ghost = hairline translucent pill.
 * @param {"light"|"dark"} [props.tone] What the button SITS ON. "dark" means
 *   dark glass or raw footage — primary flips to a warm-white fill there
 *   because an ink pill would vanish into it.
 * @param {string} [props.href] Renders an <a> when present, else a <button>.
 * @param {React.ReactNode} [props.icon] Leading icon, e.g. <WhatsAppIcon />.
 * @param {boolean} [props.arrow] Trailing arrow in its own circle.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const VARIANTS = {
  primary: {
    light: "bg-ink text-warm-white hover:bg-sage-deep",
    dark: "bg-warm-white text-ink hover:bg-champagne",
  },
  ghost: {
    light:
      "border border-ink/25 bg-warm-white/40 text-ink hover:border-sage-deep hover:text-sage-deep",
    dark: "border border-warm-white/45 text-warm-white hover:border-champagne hover:text-champagne",
  },
};

const ARROW_CIRCLES = {
  primary: {
    light: "bg-warm-white/15",
    dark: "bg-ink/10",
  },
  ghost: {
    light: "bg-ink/5",
    dark: "bg-warm-white/15",
  },
};

export default function Button({
  variant = "primary",
  tone = "light",
  href,
  icon = null,
  arrow = false,
  className = "",
  children,
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const look = (VARIANTS[variant] || VARIANTS.primary)[tone] || VARIANTS.primary.light;
  const circle = (ARROW_CIRCLES[variant] || ARROW_CIRCLES.primary)[tone];

  return (
    <Tag
      href={href}
      type={href ? undefined : "button"}
      className={`pressable group inline-flex min-h-[3.25rem] items-center gap-2.5 rounded-full text-[0.8125rem] font-medium uppercase tracking-wide2 transition-colors duration-300 ${
        arrow ? "ps-7 pe-2" : "px-7"
      } ${look} ${className}`}
      {...rest}
    >
      {icon}
      {children}
      {arrow ? (
        <span
          aria-hidden="true"
          className={`ms-2 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${circle}`}
        >
          <ArrowIcon className="h-4 w-4" />
        </span>
      ) : null}
    </Tag>
  );
}
