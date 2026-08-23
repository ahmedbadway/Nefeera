# Nefeera — Asset Upload Guide

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
2. Click into the folder you need — `public` → `assets` → then `images` or `video`
3. Click the **Add file** button near the top right, then **Upload files**
4. Drag your file in, or click **choose your files** and pick it
5. Scroll down and click the green **Commit changes** button
6. Wait about a minute for the site to rebuild, then refresh the page

**That is the whole process.** No code changes are needed, ever.

### The three rules

1. **The file name must match exactly.** `gallery-01.webp` works.
   `Gallery-01.webp`, `gallery-1.webp`, `gallery-01.WEBP`, and
   `gallery-01 (1).webp` do not. Lower case, exact spelling, exact extension.
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

13 images and 3 video files in total. Tick them off as you go.

### Images — put these in `public/assets/images/`

| File name | Put it in | Exact size (pixels) | Shape | Max file size | Where it shows on the page |
| --- | --- | --- | --- | --- | --- |
| `hero-poster.jpg` | `assets/images/` | 1920 × 1080 | Wide (16:9) | 300 KB | Hero — the still frame shown before the video plays, and instead of it on reduced-motion settings |
| `about-yomna.webp` | `assets/images/` | 1200 × 1200 | Square (1:1) | 300 KB | About section — portrait of Yomna El Hadad |
| `case-01.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 450 KB | Featured wedding — the opening image, beside the introduction copy |
| `case-02.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Featured wedding — first image in the row of three |
| `case-03.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Featured wedding — second image in the row of three |
| `case-04.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Featured wedding — third image in the row of three |
| `gallery-01.webp` | `assets/images/` | 1200 × 1600 | 3/4 | 400 KB | Gallery — column 1, first image |
| `gallery-02.webp` | `assets/images/` | 1200 × 1600 | 3/4 | 400 KB | Gallery — column 1, second image |
| `gallery-03.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Gallery — column 1, third image (tall) |
| `gallery-04.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Gallery — column 2, first image (tall) |
| `gallery-05.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Gallery — column 2, second image (tall) |
| `gallery-06.webp` | `assets/images/` | 1200 × 1600 | 3/4 | 400 KB | Gallery — column 2, third image |
| `gallery-07.webp` | `assets/images/` | 1080 × 1920 | Tall phone (9:16) | 400 KB | Gallery — column 3, first image (tall) |

### Logo — put this in `public/assets/images/`

| File name | Put it in | Exact size (pixels) | Shape | Max file size | Where it shows on the page |
| --- | --- | --- | --- | --- | --- |
| `logo.svg` | `assets/images/` | Any (vector) | — | 20 KB | Header, footer, and favicon — preferred format. Overrides the drawn logo everywhere at once. |
| `logo.png` | `assets/images/` | 1200 px wide (any height) | — | 200 KB | Header and footer — fallback if you only have a raster logo. Must have a transparent background. |

Upload **either** `logo.svg` **or** `logo.png` — not both. If both are
present, the `.svg` wins.

- **`logo.svg` is strongly preferred.** It stays perfectly sharp at every size
  and on every screen. Ask your designer for "the logo as an SVG".
- **`logo.png` is the fallback** if a vector file does not exist. It must have a
  **transparent background** (no white box behind it) and be at least 1200px wide.

Until you upload one of these, the site draws the Nefeera lockup in code — the
mark, the NEFEERA wordmark, the gold rule, and both lines beneath it. It is a
stand-in for the real logo, not a replacement for it.

### Video — put these in `public/assets/video/`

| File name | Put it in | Exact size (pixels) | Shape | Max file size | Where it shows on the page |
| --- | --- | --- | --- | --- | --- |
| `hero-desktop.mp4` | `assets/video/` | 1920 × 1080 | Wide (16:9) | 6 MB | Hero background video — desktop and tablet. Landscape. A vertical file works too, but wide screens will crop it to its middle band. |
| `hero-mobile.mp4` | `assets/video/` | 1080 × 1920 | Tall phone (9:16) | 4 MB | Hero background video — phones. Same shape as the desktop file while the source footage is vertical. |
| `hero.webm` | `assets/video/` | 1920 × 1080 | Wide (16:9) | 5 MB | Hero background video — smaller WebM version of the landscape file, used first when the browser supports it |

### If the hero video looks soft on a desktop screen

Resolution is the whole story here. A 464x832 clip (a typical WhatsApp or
social export) stretched across a 1440px screen is being enlarged more than
three times, and no amount of code can put back detail the file does not have.

Two separate things to check:

1. **Re-export from the ORIGINAL recording, not from a shared copy.** Phones
   record at 1080x1920 or better; the version that came out of a chat app is a
   fraction of that. Sending the original by AirDrop, Google Drive, or email
   "actual size" keeps the resolution.
2. **Landscape footage suits a desktop background; vertical footage does not.**
   A vertical clip used as a full-screen desktop background can only ever show
   its middle strip — roughly a third of the height — because the rest falls
   outside a wide frame. That is cropping, not blur, and a bigger file will not
   change it. If there is any horizontal footage, use it for
   `hero-desktop.mp4` and keep the vertical clip for `hero-mobile.mp4`.

The hero works with **any one** of these three files — you do not need all
three. But each one earns its place:

- `hero.webm` is the smallest file, and most browsers will pick it first.
- `hero-desktop.mp4` is the universal fallback. If you only upload one file,
  make it this one.
- `hero-mobile.mp4` is a **portrait** crop for phones. Without it, phones show
  the middle slice of the landscape video, which usually cuts people's heads off.

Until at least one video is uploaded, the hero shows a still cream panel with a
slow gold shimmer. **No broken video player ever appears.**

---

## Making the hero video files

You need a video editor or the free command-line tool **ffmpeg**
(<https://ffmpeg.org/download.html>). If you are handing this to a video editor,
give them this section.

Start with your best footage as `source.mov` or `source.mp4` in the same folder.

### 1. Desktop version — `hero-desktop.mp4`

```bash
ffmpeg -i source.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -profile:v high -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  -an \
  hero-desktop.mp4
```

### 2. Phone version — `hero-mobile.mp4` (portrait)

```bash
ffmpeg -i source.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -profile:v high -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  -an \
  hero-mobile.mp4
```

### 3. WebM version — `hero.webm` (smaller, modern browsers)

```bash
ffmpeg -i source.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  -an \
  hero.webm
```

### 4. Still frame — `hero-poster.jpg`

This is the image shown before the video starts playing, and instead of the
video for visitors who have switched off animations. Take it from four seconds
into the video, or use any photo you prefer at 1920 × 1080.

```bash
ffmpeg -ss 00:00:04 -i hero-desktop.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

### Notes for whoever cuts the video

- **Keep it to 10–20 seconds and make it loop cleanly.** It plays on repeat.
- **There is no sound.** The `-an` flag strips the audio track — browsers block
  autoplaying audio anyway, and dropping it makes the file meaningfully smaller.
- **`-movflags +faststart` matters.** It moves the index to the front of the
  file so playback begins before the whole thing has downloaded. Without it the
  hero sits blank for several seconds on a slow connection.
- **Check the file size afterwards.** If `hero-desktop.mp4` came out over 6 MB,
  raise `-crf 23` to `-crf 26` and run it again. Higher number, smaller file,
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

## The photos are WebP

Every photo slot expects a `.webp` file. WebP is typically 25–35% smaller than
JPEG at the same quality, which matters because most guests will open this site
on mobile data.

If your photo is a JPEG, convert it first. On a Mac or PC, any of the free
online converters will do, or on the command line:

```bash
cwebp -q 82 my-photo.jpg -o gallery-01.webp
```

Do not rename a `.jpg` file to `.webp` by hand — that produces a broken file
that will not display. Convert it properly.

The one exception is the video still frame, `hero-poster.jpg`, which stays a
JPEG: it is also used as the preview image when the site is shared on WhatsApp
and Facebook, and those expect a JPEG.

---

## What the folders are

```
public/assets/
├── images/         ← photos and the logo go here
├── video/          ← the three hero video files go here
└── placeholders/   ← reference only, do not upload anything here
```

`placeholders/` contains one SVG per slot, at the exact shape that slot expects.
Open any of them on GitHub to see what is required. These are generated
automatically — editing or deleting them changes nothing on the live site.

---

## If something does not appear after uploading

Work down this list:

1. **Check the file name against the table, character by character.** This is
   the cause roughly nine times out of ten. Watch for capital letters, a missing
   leading zero (`gallery-1` instead of `gallery-01`), and `.WEBP` versus
   `.webp`.
2. **Check it is in the right folder** — `images/` or `video/`, not loose in
   `assets/`.
3. **Give it a minute and hard-refresh.** The site rebuilds after each upload.
   Ctrl+Shift+R on Windows, Cmd+Shift+R on a Mac.
4. **Still the placeholder?** The placeholder itself names the exact file it is
   waiting for. Read what it says and compare.

---

*This file is generated from `src/data/Content.js`. To change the required
sizes, edit the specs there and run `npm run assets:readme`.*
