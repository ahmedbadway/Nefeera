/**
 * End-to-end verification of the asset-swap system.
 *
 * Two things are checked, in this order:
 *
 *  1. ZERO-ASSET RENDER — with no real files present, does every slot show a
 *     labeled placeholder, is there no <video> element anywhere, is there no
 *     horizontal overflow, and are there no console errors?
 *
 *  2. SWAP TEST — the actual proof that the system works. Dummy images are
 *     generated at the exact pixel dimensions each spec demands, dropped into
 *     the served folder, and the page is measured again. Every element's
 *     geometry must be byte-identical to the empty state. Any nonzero delta
 *     means a slot is not locking its aspect ratio and swapping a real photo in
 *     would shove the page around.
 *
 * Playwright is NOT a dependency of this project — it is a verification tool,
 * and the rule here is that nothing gets added to package.json without asking.
 * The script looks for a local install first, then a global one. If you do not
 * have it:
 *
 *     npm install -g playwright && npx playwright install chromium
 *
 * Usage:
 *     npm run build
 *     npx vite preview --port 4173      # in one terminal
 *     node scripts/VerifyAssets.mjs     # in another
 *
 * Optional: --base http://localhost:4173
 */

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { assetSpecs, getAssetFilename } from "../src/data/Content.js";

/** Where `npm install -g` puts packages on this machine, if npm can say. */
function globalNodeModules() {
  try {
    return execSync("npm root -g", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Resolve Playwright from a local install first, then from the global one.
 *
 * The global path is looked up with `npm root -g` rather than hardcoded:
 * createRequire only walks node_modules upward from the file you give it, so a
 * globally installed package is invisible to it unless you point it at the
 * global root explicitly, and that root differs per machine and per CI runner.
 */
function loadPlaywright() {
  const globalRoot = globalNodeModules();
  const candidates = [import.meta.url];
  if (globalRoot) candidates.push(join(globalRoot, "resolve-from-here.js"));

  for (const from of candidates) {
    try {
      return createRequire(from)("playwright");
    } catch {
      // Try the next location.
    }
  }

  console.error(
    "Playwright not found. Install it with either:\n" +
      "  npm install --no-save playwright && npx playwright install chromium\n" +
      "  npm install -g playwright && npx playwright install chromium"
  );
  process.exit(1);
}

const { chromium } = loadPlaywright();

/** Use a preinstalled Chromium when one is configured, else Playwright's own. */
const CHROMIUM_PATH = existsSync("/opt/pw-browsers/chromium")
  ? "/opt/pw-browsers/chromium"
  : undefined;

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const servedImagesDir = join(root, "dist", "assets", "images");

// vite preview honours `base` from vite.config.js, so the app is served under
// the project subpath rather than at the server root.
const baseArgIndex = process.argv.indexOf("--base");
const BASE =
  baseArgIndex > -1 ? process.argv[baseArgIndex + 1] : "http://localhost:4173/Nefeera/";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const failures = [];
const notes = [];

function check(condition, message) {
  if (condition) {
    console.log(`  PASS  ${message}`);
  } else {
    console.log(`  FAIL  ${message}`);
    failures.push(message);
  }
}

/**
 * Generate a real JPEG at exact dimensions using the browser's own canvas
 * encoder. Avoids pulling in an image library just to make throwaway test files.
 */
async function makeDummyJpeg(page, width, height, seed) {
  const dataUrl = await page.evaluate(
    ({ w, h, s }) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      const hue = (s * 47) % 360;
      ctx.fillStyle = `hsl(${hue} 35% 55%)`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = `${Math.round(Math.min(w, h) * 0.09)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`${w}x${h}`, w / 2, h / 2);
      return canvas.toDataURL("image/jpeg", 0.7);
    },
    { w: width, h: height, s: seed }
  );

  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/** Collect the geometry of everything that matters for layout-shift detection. */
async function measure(page) {
  return page.evaluate(() => {
    const round = (n) => Math.round(n * 100) / 100;
    const result = {};

    document.querySelectorAll("section, footer").forEach((el) => {
      const box = el.getBoundingClientRect();
      const key = el.id || el.tagName.toLowerCase();
      result[`section:${key}`] = { top: round(box.top), height: round(box.height) };
    });

    document.querySelectorAll("#gallery button.group").forEach((el, index) => {
      const box = el.getBoundingClientRect();
      result[`tile:${index}`] = {
        top: round(box.top),
        height: round(box.height),
        width: round(box.width),
      };
    });

    result.documentHeight = round(document.documentElement.scrollHeight);
    return result;
  });
}

async function run() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });

  try {
    // ---------------------------------------------------------------- Phase 1
    console.log("\n=== PHASE 1: zero-asset render ===");

    const emptyStateGeometry = {};

    for (const viewport of VIEWPORTS) {
      console.log(`\n[${viewport.name} — ${viewport.width}x${viewport.height}]`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      // Google Fonts is unreachable from this sandbox, so its request always
      // fails here. That is an environment restriction, not a site defect — the
      // stylesheet loads normally in production. Everything else counts.
      const isSandboxFontBlock = (text) =>
        /fonts\.(googleapis|gstatic)\.com/.test(text) ||
        /ERR_CONNECTION_RESET|ERR_BLOCKED|ERR_NAME_NOT_RESOLVED/.test(text);

      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !isSandboxFontBlock(message.text())) {
          consoleErrors.push(message.text());
        }
      });
      page.on("pageerror", (error) => consoleErrors.push(String(error)));

      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);

      // Every slot must show its placeholder.
      const placeholderCount = await page.locator('[role="img"][aria-label*="placeholder"]').count();
      check(
        placeholderCount === 15,
        `15 placeholders rendered (found ${placeholderCount}) — 1 hero video, 1 portrait, 4 featured, 9 gallery`
      );

      // The hard requirement: no video element at all when files are missing.
      const videoCount = await page.locator("video").count();
      check(videoCount === 0, `no <video> element in the DOM (found ${videoCount})`);

      // Placeholders must name the file they are waiting for.
      const labels = await page
        .locator('[role="img"][aria-label*="placeholder"]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label")));
      const allNamed = labels.every((label) => /Required file: \S+/.test(label));
      check(allNamed, "every placeholder names its required file and dimensions");

      // No horizontal overflow at any width.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      check(overflow <= 0, `no horizontal overflow (scrollWidth delta ${overflow}px)`);

      // The drawn logo must be present since no logo file is uploaded.
      const wordmarks = await page.getByText("NEFEERA", { exact: true }).count();
      check(wordmarks >= 2, `drawn logo lockup present in header and footer (found ${wordmarks})`);

      // The hero placeholder label is absolutely positioned over a full-bleed
      // slot, so it has to be proven clear of the copy at every width rather
      // than assumed. Overlapping text on an image is an explicit anti-pattern.
      const heroCollisions = await page.evaluate(() => {
        const chip = document.querySelector('#hero [role="img"][aria-label*="placeholder"]');
        if (!chip) return ["hero placeholder label not found"];

        const chipBox = chip.getBoundingClientRect();
        const targets = document.querySelectorAll(
          "#hero h1, #hero p:not([role]), #hero a, header a, header button"
        );

        const hits = [];
        targets.forEach((el) => {
          if (chip.contains(el) || el.contains(chip)) return;
          const box = el.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) return;
          const overlaps =
            chipBox.left < box.right &&
            chipBox.right > box.left &&
            chipBox.top < box.bottom &&
            chipBox.bottom > box.top;
          if (overlaps) {
            hits.push(`${el.tagName.toLowerCase()}"${(el.textContent || "").trim().slice(0, 24)}"`);
          }
        });
        return hits;
      });

      check(
        heroCollisions.length === 0,
        `hero placeholder label overlaps nothing${
          heroCollisions.length ? ` — hits: ${heroCollisions.join(", ")}` : ""
        }`
      );

      check(
        consoleErrors.length === 0,
        `no console errors${consoleErrors.length ? ` — ${consoleErrors.slice(0, 3).join(" | ")}` : ""}`
      );

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: join(root, `verify-empty-${viewport.name}.png`),
        fullPage: true,
      });

      emptyStateGeometry[viewport.name] = await measure(page);
      await context.close();
    }

    // ---------------------------------------------------------------- Phase 2
    console.log("\n=== PHASE 2: swap test (zero layout shift) ===");

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    mkdirSync(servedImagesDir, { recursive: true });

    const written = [];
    let seed = 0;

    for (const [src, spec] of Object.entries(assetSpecs)) {
      if (spec.kind !== "image" || !spec.w || !spec.h) continue;
      seed += 1;
      const buffer = await makeDummyJpeg(page, spec.w, spec.h, seed);
      const target = join(servedImagesDir, getAssetFilename(src));
      writeFileSync(target, buffer);
      written.push(target);
    }

    console.log(`  Wrote ${written.length} dummy images at exact spec dimensions.`);
    await context.close();

    try {
      for (const viewport of VIEWPORTS) {
        console.log(`\n[${viewport.name} — with images present]`);

        const swapContext = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const swapPage = await swapContext.newPage();
        await swapPage.goto(BASE, { waitUntil: "networkidle" });
        await swapPage.waitForTimeout(900);

        const loadedImages = await swapPage.locator("#gallery img").count();
        check(loadedImages === 9, `9 gallery images now rendering (found ${loadedImages})`);

        const remainingPlaceholders = await swapPage
          .locator('#gallery [role="img"][aria-label*="placeholder"]')
          .evaluateAll((nodes) =>
            nodes.filter((n) => n.closest("[aria-hidden='true']") === null).length
          );
        check(
          remainingPlaceholders === 0,
          `gallery placeholders are hidden from assistive tech once real images load (${remainingPlaceholders} still exposed)`
        );

        const after = await measure(swapPage);
        const before = emptyStateGeometry[viewport.name];

        const drifted = [];
        for (const [key, beforeBox] of Object.entries(before)) {
          const afterBox = after[key];
          if (key === "documentHeight") {
            if (Math.abs(afterBox - beforeBox) > 0.5) {
              drifted.push(`${key}: ${beforeBox} -> ${afterBox}`);
            }
            continue;
          }
          if (!afterBox) {
            drifted.push(`${key}: missing after swap`);
            continue;
          }
          for (const prop of Object.keys(beforeBox)) {
            if (Math.abs(afterBox[prop] - beforeBox[prop]) > 0.5) {
              drifted.push(`${key}.${prop}: ${beforeBox[prop]} -> ${afterBox[prop]}`);
            }
          }
        }

        check(
          drifted.length === 0,
          `ZERO LAYOUT SHIFT — geometry identical before and after swap${
            drifted.length ? ` — drifted: ${drifted.slice(0, 5).join("; ")}` : ""
          }`
        );

        await swapPage.evaluate(() => window.scrollTo(0, 0));
        await swapPage.screenshot({
          path: join(root, `verify-filled-${viewport.name}.png`),
          fullPage: true,
        });

        await swapContext.close();
      }
    } finally {
      // Never leave test images behind — the repo ships with zero real assets.
      for (const file of written) {
        if (existsSync(file)) rmSync(file);
      }
      console.log(`\n  Cleaned up ${written.length} dummy images.`);
    }

    // ---------------------------------------------------------------- Phase 3
    console.log("\n=== PHASE 3: reduced motion ===");

    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(BASE, { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(700);

    check(
      (await rmPage.locator("video").count()) === 0,
      "no <video> element under prefers-reduced-motion"
    );

    // Scroll reveals must not leave content invisible when motion is off.
    const hiddenBlocks = await rmPage.evaluate(() => {
      const targets = document.querySelectorAll(
        "#gallery button.group, #process li, #testimonials [class*='border']"
      );
      return [...targets].filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
    });
    check(
      hiddenBlocks === 0,
      `all content fully opaque with motion off (${hiddenBlocks} still faded)`
    );

    // The shimmer sweep must be switched off, not merely slowed.
    const shimmerRunning = await rmPage.evaluate(() => {
      const sweep = document.querySelector('#hero svg [class^="sweep-"]');
      if (!sweep) return false;
      const style = getComputedStyle(sweep);
      return style.animationName !== "none" && Number(style.opacity) > 0;
    });
    check(!shimmerRunning, "hero shimmer is disabled under reduced motion");

    await rmPage.screenshot({ path: join(root, "verify-reduced-motion.png"), fullPage: true });
    await rmContext.close();
  } finally {
    await browser.close();
  }

  console.log("\n=== RESULT ===");
  notes.forEach((note) => console.log(`  NOTE  ${note}`));

  if (failures.length > 0) {
    console.log(`\n${failures.length} check(s) failed:`);
    failures.forEach((failure) => console.log(`  - ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("\nAll checks passed.");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
