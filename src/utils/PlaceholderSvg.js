import { tokens } from "../data/Tokens.js";

/**
 * Builds the missing-asset placeholder as an SVG string.
 *
 * ONE FUNCTION, TWO CONSUMERS — on purpose:
 *   - Asset.jsx / VideoAsset.jsx render the output inline, so a missing file
 *     costs zero extra network requests.
 *   - scripts/GeneratePlaceholders.mjs writes the same output to
 *     /public/assets/placeholders/*.svg, which are viewable directly on GitHub
 *     so a non-developer can see exactly what a slot expects before uploading.
 *
 * Keeping it in one place means the reference files can never drift from what
 * the live site actually shows.
 */

/** Escape the five XML entities. Copy comes from Content.js, which humans edit. */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Turn "4/5" into a { w, h } pair for slots with no fixed pixel size. */
function ratioToBox(ratio) {
  const [w, h] = String(ratio || "4/5")
    .split("/")
    .map((part) => Number(part.trim()));
  if (!w || !h) return { w: 1200, h: 1500 };
  // Scale up so stroke widths and font sizes have room to be expressed.
  const scale = 1200 / w;
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

let uidCounter = 0;
function nextUid(seed) {
  uidCounter += 1;
  const safeSeed = String(seed || "ph").replace(/[^a-zA-Z0-9]/g, "");
  return `${safeSeed}${uidCounter}`;
}

/**
 * @param {object} options
 * @param {number|null} options.width   Intended pixel width of the final file.
 * @param {number|null} options.height  Intended pixel height of the final file.
 * @param {string} options.ratio        CSS aspect-ratio, used when width/height are absent.
 * @param {string} options.label        Human label for the slot, e.g. "Gallery 01".
 * @param {string} options.requirement  e.g. "gallery-01.jpg — 1200×1500".
 * @param {boolean} options.animated    Slow gold shimmer (hero video placeholder only).
 * @param {string} options.idSeed       Seed for unique gradient/class ids.
 * @param {boolean} options.showLockup  Draw the centered mark, wordmark, and labels.
 *
 *   Set showLockup to FALSE for full-bleed slots. Those render the SVG with
 *   `preserveAspectRatio="slice"` into a container whose shape does not match
 *   the viewBox, so the SVG gets cropped — and how much, from which edges,
 *   depends entirely on the viewport. At 375x812 against a 16:9 viewBox only
 *   the central quarter of the width survives; at 1440x900 almost none is cut.
 *   There is no position inside the artwork that is both uncropped on a phone
 *   and clear of the hero copy on a desktop. So full-bleed slots draw the field
 *   only, and the caller places the label as ordinary positioned HTML on top.
 *
 * @returns {string} A complete <svg> element as a string.
 */
export function buildPlaceholderSvg({
  width = null,
  height = null,
  ratio = "4/5",
  label = "",
  requirement = "",
  animated = false,
  idSeed = "ph",
  showLockup = true,
} = {}) {
  const box = width && height ? { w: width, h: height } : ratioToBox(ratio);
  const { w, h } = box;

  // Size everything against the SHORT edge so the mark stays proportionate in
  // both a 9/16 portrait hero and a 3/2 landscape gallery slot.
  const base = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;

  const markHeight = base * 0.15;
  const markWidth = markHeight * 1.6;
  const wordmarkSize = base * 0.058;
  const ruleWidth = base * 0.3;
  const labelSize = base * 0.044;
  const requirementSize = base * 0.038;
  const inset = Math.max(base * 0.02, 8);

  // Vertical stack, centered as a group.
  const markTop = cy - base * 0.245;
  const wordmarkY = markTop + markHeight + base * 0.085;
  const ruleY = wordmarkY + base * 0.055;
  const labelY = ruleY + base * 0.085;
  const requirementY = labelY + requirementSize * 1.65;

  const uid = nextUid(idSeed);
  const shimmerId = `shimmer-${uid}`;
  const shimmerClass = `sweep-${uid}`;

  // The mark: a stylized noon (ن) bowl with its dot — the first letter of the
  // name, drawn as a single nib-weighted stroke. Deliberately abstract: this is
  // a stand-in until /assets/images/logo.svg is uploaded, not the brand mark.
  const markSvg = `
    <g transform="translate(${(cx - markWidth / 2).toFixed(2)} ${markTop.toFixed(2)}) scale(${(
    markWidth / 120
  ).toFixed(4)})" fill="none" stroke="${tokens.gold}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
      <path d="M12 18 C12 52, 30 66, 60 66 C90 66, 108 52, 108 18" stroke-width="5" />
      <path d="M108 18 C108 10, 102 5, 94 7" stroke-width="3.2" opacity="0.7" />
      <circle cx="60" cy="6" r="4.5" fill="${tokens.gold}" stroke="none" />
    </g>`;

  const shimmerSvg = animated
    ? `
    <defs>
      <linearGradient id="${shimmerId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${tokens.gold}" stop-opacity="0" />
        <stop offset="50%" stop-color="${tokens.gold}" stop-opacity="0.16" />
        <stop offset="100%" stop-color="${tokens.gold}" stop-opacity="0" />
      </linearGradient>
    </defs>
    <style>
      @keyframes ${shimmerClass}-move {
        0%   { transform: translateX(-70%); }
        100% { transform: translateX(170%); }
      }
      .${shimmerClass} {
        animation: ${shimmerClass}-move 6s cubic-bezier(0.77, 0, 0.175, 1) infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .${shimmerClass} { animation: none; opacity: 0; }
      }
    </style>
    <rect class="${shimmerClass}" x="0" y="0" width="${(w * 0.6).toFixed(
        2
      )}" height="${h}" fill="url(#${shimmerId})" />`
    : "";

  const frameSvg = `<rect x="${inset.toFixed(2)}" y="${inset.toFixed(2)}" width="${(
    w -
    inset * 2
  ).toFixed(2)}" height="${(h - inset * 2).toFixed(
    2
  )}" fill="none" stroke="${tokens.gold}" stroke-width="1" vector-effect="non-scaling-stroke" opacity="0.55" />`;

  // Field-only variant for full-bleed slots. Safe to crop from any edge.
  if (!showLockup) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
  <rect width="${w}" height="${h}" fill="${tokens.cream}" />
  ${shimmerSvg}
  ${frameSvg}
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${escapeXml(
    label || "Placeholder"
  )} placeholder. Required file: ${escapeXml(requirement)}">
  <rect width="${w}" height="${h}" fill="${tokens.cream}" />
  ${shimmerSvg}
  ${frameSvg}
  ${markSvg}
  <text x="${cx.toFixed(2)}" y="${wordmarkY.toFixed(
    2
  )}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="${wordmarkSize.toFixed(
    2
  )}" letter-spacing="${(wordmarkSize * 0.18).toFixed(2)}" fill="${
    tokens.charcoal
  }" opacity="0.9">NEFEERA</text>
  <line x1="${(cx - ruleWidth / 2).toFixed(2)}" y1="${ruleY.toFixed(2)}" x2="${(
    cx +
    ruleWidth / 2
  ).toFixed(2)}" y2="${ruleY.toFixed(2)}" stroke="${
    tokens.gold
  }" stroke-width="1" vector-effect="non-scaling-stroke" opacity="0.7" />
  <text x="${cx.toFixed(2)}" y="${labelY.toFixed(
    2
  )}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${labelSize.toFixed(
    2
  )}" letter-spacing="${(labelSize * 0.1).toFixed(2)}" fill="${
    tokens.charcoal
  }">${escapeXml(label)}</text>
  <text x="${cx.toFixed(2)}" y="${requirementY.toFixed(
    2
  )}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${requirementSize.toFixed(
    2
  )}" fill="${tokens.charcoalMuted}">${escapeXml(requirement)}</text>
</svg>`;
}

export default buildPlaceholderSvg;
