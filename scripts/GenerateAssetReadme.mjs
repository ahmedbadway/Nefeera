/**
 * Writes /public/assets/README.md from `assetSpecs` in src/data/Content.js.
 *
 * The checklist table is generated rather than hand-written so that it can
 * never disagree with the dimensions the site actually enforces. Change a spec
 * in Content.js, run `npm run assets:readme`, and the instructions update.
 *
 * Run: npm run assets:readme   (or `npm run assets` to also rebuild placeholders)
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { assetSpecs, getAssetFilename } from "../src/data/Content.js";

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, "..", "public", "assets", "README.md");

mkdirSync(dirname(outputPath), { recursive: true });

function formatSize(maxKB) {
  if (!maxKB) return "—";
  if (maxKB >= 1000) return `${(maxKB / 1000).toFixed(0)} MB`;
  return `${maxKB} KB`;
}

function formatDimensions(spec) {
  if (spec.kind === "logo" && !spec.w) return "Any (vector)";
  if (spec.kind === "logo" && spec.w) return `${spec.w} px wide (any height)`;
  if (!spec.w || !spec.h) return "—";
  return `${spec.w} × ${spec.h}`;
}

function formatShape(spec) {
  if (spec.ratio === "auto") return "—";
  const readable = {
    "16/9": "Wide (16:9)",
    "9/16": "Tall phone (9:16)",
    "4/5": "Portrait (4:5)",
    "3/2": "Landscape (3:2)",
    "1/1": "Square (1:1)",
  };
  return readable[spec.ratio] || spec.ratio;
}

function folderFor(src) {
  return src.includes("/video/") ? "assets/video/" : "assets/images/";
}

function rowsFor(predicate) {
  return Object.entries(assetSpecs)
    .filter(([, spec]) => predicate(spec))
    .map(
      ([src, spec]) =>
        `| \`${getAssetFilename(src)}\` | \`${folderFor(src)}\` | ${formatDimensions(
          spec
        )} | ${formatShape(spec)} | ${formatSize(spec.maxKB)} | ${spec.usedIn} |`
    )
    .join("\n");
}

const header =
  "| File name | Put it in | Exact size (pixels) | Shape | Max file size | Where it shows on the page |\n" +
  "| --- | --- | --- | --- | --- | --- |";

const totalImages = Object.values(assetSpecs).filter((spec) => spec.kind === "image").length;
const totalVideos = Object.values(assetSpecs).filter((spec) => spec.kind === "video").length;

const readme = `# Nefeera — Asset Upload Guide

This folder is where all the photos and videos for the website live. You do not
need to know how to code to add them. You need three things: the **exact file
name**, the **exact size**, and the **right folder**.

The website is already finished and working. Every picture slot currently shows
a cream-and-gold placeholder that names the file it is waiting for. When you
upload a file with the matching name, that placeholder disappears and your photo
takes its place — the layout does not move, and nothing else changes.

You can upload files one at a time or all at once. There is no rush and no
order. A half-filled site still looks finished.

---

## How to upload a file (no coding)

1. Go to the repository on GitHub: **ahmedbadway/Nefeera**
2. Click into the folder you need — \`public\` → \`assets\` → then \`images\` or \`video\`
3. Click the **Add file** button near the top right, then **Upload files**
4. Drag your file in, or click **choose your files** and pick it
5. Scroll down and click the green **Commit changes** button
6. Wait about a minute for the site to rebuild, then refresh the page

**That is the whole process.** No code changes are needed, ever.

### The three rules

1. **The file name must match exactly.** \`gallery-01.jpg\` works.
   \`Gallery-01.jpg\`, \`gallery-1.jpg\`, \`gallery-01.JPG\`, and
   \`gallery-01 (1).jpg\` do not. Lower case, exact spelling, exact extension.
2. **The size must match.** The sizes in the table below are not suggestions.
   A different size will still display, but it will be cropped to fit the slot,
   and you may lose part of the picture.
3. **Stay under the max file size.** Most guests in Egypt will open this site on
   mobile data. An oversized photo is the single fastest way to make the site
   feel slow.

### Replacing a file you already uploaded

Click the existing file in GitHub, click the pencil or the **⋯** menu, choose
delete, commit — then upload the new one with the same name. Or upload a file
with the same name and GitHub will offer to replace it.

---

## The checklist

${totalImages} images and ${totalVideos} video files in total. Tick them off as you go.

### Images — put these in \`public/assets/images/\`

${header}
${rowsFor((spec) => spec.kind === "image")}

### Logo — put this in \`public/assets/images/\`

${header}
${rowsFor((spec) => spec.kind === "logo")}

Upload **either** \`logo.svg\` **or** \`logo.png\` — not both. If both are
present, the \`.svg\` wins.

- **\`logo.svg\` is strongly preferred.** It stays perfectly sharp at every size
  and on every screen. Ask your designer for "the logo as an SVG".
- **\`logo.png\` is the fallback** if a vector file does not exist. It must have a
  **transparent background** (no white box behind it) and be at least 1200px wide.

Until you upload one of these, the site draws the Nefeera lockup in code — the
mark, the NEFEERA wordmark, the gold rule, and both lines beneath it. It is a
stand-in for the real logo, not a replacement for it.

### Video — put these in \`public/assets/video/\`

${header}
${rowsFor((spec) => spec.kind === "video")}

The hero works with **any one** of these three files — you do not need all
three. But each one earns its place:

- \`hero.webm\` is the smallest file, and most browsers will pick it first.
- \`hero-desktop.mp4\` is the universal fallback. If you only upload one file,
  make it this one.
- \`hero-mobile.mp4\` is a **portrait** crop for phones. Without it, phones show
  the middle slice of the landscape video, which usually cuts people's heads off.

Until at least one video is uploaded, the hero shows a still cream panel with a
slow gold shimmer. **No broken video player ever appears.**

---

## Making the hero video files

You need a video editor or the free command-line tool **ffmpeg**
(<https://ffmpeg.org/download.html>). If you are handing this to a video editor,
give them this section.

Start with your best footage as \`source.mov\` or \`source.mp4\` in the same folder.

### 1. Desktop version — \`hero-desktop.mp4\`

\`\`\`bash
ffmpeg -i source.mp4 \\
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \\
  -c:v libx264 -profile:v high -crf 23 -preset slow \\
  -pix_fmt yuv420p -movflags +faststart \\
  -an \\
  hero-desktop.mp4
\`\`\`

### 2. Phone version — \`hero-mobile.mp4\` (portrait)

\`\`\`bash
ffmpeg -i source.mp4 \\
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \\
  -c:v libx264 -profile:v high -crf 26 -preset slow \\
  -pix_fmt yuv420p -movflags +faststart \\
  -an \\
  hero-mobile.mp4
\`\`\`

### 3. WebM version — \`hero.webm\` (smaller, modern browsers)

\`\`\`bash
ffmpeg -i source.mp4 \\
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \\
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \\
  -an \\
  hero.webm
\`\`\`

### 4. Still frame — \`hero-poster.jpg\`

This is the image shown before the video starts playing, and instead of the
video for visitors who have switched off animations. Take it from four seconds
into the video, or use any photo you prefer at 1920 × 1080.

\`\`\`bash
ffmpeg -ss 00:00:04 -i hero-desktop.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
\`\`\`

### Notes for whoever cuts the video

- **Keep it to 10–20 seconds and make it loop cleanly.** It plays on repeat.
- **There is no sound.** The \`-an\` flag strips the audio track — browsers block
  autoplaying audio anyway, and dropping it makes the file meaningfully smaller.
- **\`-movflags +faststart\` matters.** It moves the index to the front of the
  file so playback begins before the whole thing has downloaded. Without it the
  hero sits blank for several seconds on a slow connection.
- **Check the file size afterwards.** If \`hero-desktop.mp4\` came out over 6 MB,
  raise \`-crf 23\` to \`-crf 26\` and run it again. Higher number, smaller file,
  slightly softer picture.
- Avoid fast motion and hard cuts. A slow, steady shot compresses far better and
  suits the page.

---

## Photos: a few things worth knowing

**Sizing them.** Any photo editor can do this — Photoshop, Preview on a Mac,
Photos on Windows, or a free web tool like <https://squoosh.app>. Squoosh also
shows the file size as you adjust the quality, which makes hitting the limits
easy.

**Getting under the size limit.** Export as JPEG at around 80% quality. That is
almost always enough to land under the limit with no visible loss. If a photo is
still too big, drop to 70% before you consider reducing the dimensions.

**Cropping.** The table's "Shape" column is what matters most. A portrait (4:5)
slot given a landscape photo will crop the sides off. Crop to the right shape
first, then resize to the exact pixels.

**Faces near the edges.** Slots crop from the centre outward. Keep anything
important away from the outer edges.

---

## If you would rather use WebP

WebP files are typically 25–35% smaller than JPEG at the same quality. The site
supports them, but it needs one small change to switch over — every file name is
listed in a single file, \`src/data/Content.js\`, and the \`.jpg\` endings would
need changing to \`.webp\`. Ask Ahmed; it is a two-minute job.

To convert:

\`\`\`bash
cwebp -q 80 gallery-01.jpg -o gallery-01.webp
\`\`\`

Do not rename \`.jpg\` files to \`.webp\` by hand — that produces a broken file.
Convert them properly.

---

## What the folders are

\`\`\`
public/assets/
├── images/         ← photos and the logo go here
├── video/          ← the three hero video files go here
└── placeholders/   ← reference only, do not upload anything here
\`\`\`

\`placeholders/\` contains one SVG per slot, at the exact shape that slot expects.
Open any of them on GitHub to see what is required. These are generated
automatically — editing or deleting them changes nothing on the live site.

---

## If something does not appear after uploading

Work down this list:

1. **Check the file name against the table, character by character.** This is
   the cause roughly nine times out of ten. Watch for capital letters, a missing
   leading zero (\`gallery-1\` instead of \`gallery-01\`), and \`.JPG\` versus \`.jpg\`.
2. **Check it is in the right folder** — \`images/\` or \`video/\`, not loose in
   \`assets/\`.
3. **Give it a minute and hard-refresh.** The site rebuilds after each upload.
   Ctrl+Shift+R on Windows, Cmd+Shift+R on a Mac.
4. **Still the placeholder?** The placeholder itself names the exact file it is
   waiting for. Read what it says and compare.

---

*This file is generated from \`src/data/Content.js\`. To change the required
sizes, edit the specs there and run \`npm run assets:readme\`.*
`;

writeFileSync(outputPath, readme, "utf8");
console.log(`Wrote ${outputPath}`);
