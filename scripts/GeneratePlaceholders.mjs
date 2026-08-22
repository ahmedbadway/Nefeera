/**
 * Writes one reference SVG per asset slot into /public/assets/placeholders/.
 *
 * These files are NOT fetched by the running site — Asset.jsx and VideoAsset.jsx
 * build the same SVG inline, so a missing asset costs zero extra requests. The
 * generated files exist so that whoever is uploading the real photos can open
 * public/assets/placeholders/gallery-01.svg directly on GitHub and see exactly
 * what that slot expects, at exactly the right shape.
 *
 * Run: npm run placeholders
 */

import { writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { assetSpecs, getAssetFilename, getAssetRequirementLabel } from "../src/data/Content.js";
import { buildPlaceholderSvg } from "../src/utils/PlaceholderSvg.js";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = join(here, "..", "public", "assets", "placeholders");

mkdirSync(outputDir, { recursive: true });

// Clear previously generated files so a renamed or removed slot does not leave
// a stale placeholder behind.
for (const existing of readdirSync(outputDir)) {
  if (existing.endsWith(".svg")) rmSync(join(outputDir, existing));
}

function humanize(src) {
  return getAssetFilename(src)
    .replace(/\.[^.]+$/, "")
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

let written = 0;

for (const [src, spec] of Object.entries(assetSpecs)) {
  // The logo has no fixed pixel size and its placeholder is the drawn Logo
  // component, not a file. Nothing useful to generate.
  if (spec.kind === "logo") continue;

  const svg = buildPlaceholderSvg({
    width: spec.w,
    height: spec.h,
    ratio: spec.ratio,
    label: humanize(src),
    requirement: getAssetRequirementLabel(src),
    animated: spec.kind === "video",
    idSeed: getAssetFilename(src),
  });

  const outputName = getAssetFilename(src).replace(/\.[^.]+$/, ".svg");
  writeFileSync(join(outputDir, outputName), `${svg}\n`, "utf8");
  written += 1;
}

console.log(`Generated ${written} placeholder SVGs in public/assets/placeholders/`);
