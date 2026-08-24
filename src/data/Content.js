/**
 * SINGLE SOURCE OF TRUTH FOR THE ENTIRE SITE.
 *
 * Two rules that must never be broken:
 *
 *   1. Every user-facing string is a leaf value in this file. Components import
 *      `content` and read from it — they never contain inline copy. This is what
 *      makes the future Arabic pass cheap: mirror this file as Content.ar.js and
 *      swap the object, with no component edits.
 *
 *   2. Every image and video path lives under `assets` below. Components never
 *      hardcode a path and never `import` a media file. Real files are dropped
 *      into /public/assets/ through the GitHub web UI — see public/assets/README.md.
 *
 * `assetSpecs` (bottom of this file) is keyed BY PATH and describes what each
 * slot expects. It drives three things at once, so they can never disagree:
 *   - the aspect-ratio lock that guarantees zero layout shift on swap
 *   - the caption printed inside each missing-asset placeholder
 *   - the checklist table in public/assets/README.md
 */

export const content = {
  meta: {
    title: "Nefeera — Wedding Planning & Design by Yomna El Hadad",
    description:
      "Nefeera plans and designs weddings across Egypt with a small number of couples each season. Full planning, design direction, and day-of production led by Yomna El Hadad.",
  },

  brand: {
    name: "NEFEERA",
    subline: "BY YOMNA EL HADAD",
    discipline: "WEDDING PLANNING & DESIGN",
  },

  nav: {
    skipToContent: "Skip to content",
    menuLabel: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    items: [
      { id: "about", label: "About", href: "#about" },
      { id: "featured", label: "Featured", href: "#featured" },
      { id: "process", label: "Process", href: "#process" },
      { id: "gallery", label: "Gallery", href: "#gallery" },
      { id: "contact", label: "Contact", href: "#contact" },
    ],
    cta: "Start a conversation",
  },

  hero: {
    eyebrow: "Wedding planning & design — Egypt",
    headline: "Weddings that feel like the people in them.",
    body: "Nefeera takes a small number of weddings each season, so that every one gets the attention it takes to feel considered rather than assembled — from the first conversation to the last table cleared.",
    primaryCta: "Start a conversation",
    secondaryCta: "See the work",
    secondaryHref: "#gallery",
    scrollHint: "Scroll",
    playVideo: "Play the background film",
    pauseVideo: "Pause the background film",
  },

  about: {
    eyebrow: "About",
    headline: "Yomna El Hadad",
    lead: "Nefeera is led by Yomna El Hadad, who plans and designs each wedding personally.",
    body: [
      "Nefeera exists because most weddings are planned by committee — a venue coordinator here, a florist there, a family member with a spreadsheet — and the result feels like it was negotiated rather than designed.",
      "The work here runs the other way. One person holds the whole picture: the design direction, the vendor decisions, the run of the day, and the hundred small choices in between that nobody notices individually but everybody feels together.",
      "That means taking on fewer weddings than the calendar would allow. It is the only way the standard holds.",
    ],
    statsLabel: "At a glance",
    stats: [
      { value: "Egypt", label: "Based in Cairo, working nationwide" },
      { value: "Limited", label: "A small number of weddings each season" },
      { value: "End to end", label: "Planning, design, and day-of production" },
    ],
  },

  featured: {
    eyebrow: "Featured wedding",
    headline: "One wedding, start to finish.",
    // NOTE FOR AHMED: no couple name, venue, date, or guest count appears here
    // on purpose. Inventing those would be fabricating client details. Add the
    // real ones to `details` below when you have permission to publish them —
    // the section renders a small "details to be added" note until you do.
    detailsPending: "Wedding details to be added",
    details: [],
    body: [
      "Every wedding Nefeera takes on gets the same treatment: a design direction set early and held all the way through, rather than decided piece by piece as deposits come due.",
      "The palette, the table, the light, the flowers, the paper, the pacing of the evening — all decided as one thing. When the direction is set first, the individual choices stop being arguments and start being obvious.",
    ],
    pullQuote:
      "The difference between a beautiful wedding and a memorable one is usually a decision made six months earlier.",
    captions: [
      "Ceremony and reception design",
      "Table and place setting",
      "Florals and installation",
      "Evening light and production",
    ],
  },

  process: {
    eyebrow: "Process",
    headline: "How the work runs.",
    body: "Four stages, in order. Nothing starts before the stage before it is settled.",
    steps: [
      {
        number: "01",
        title: "Conversation",
        body: "We talk before anything else — about the two of you, the guest list, the budget you actually have, and what you want the evening to feel like. No proposal until this is clear.",
      },
      {
        number: "02",
        title: "Direction",
        body: "A single design direction for the whole wedding: palette, materials, florals, paper, light, and the shape of the evening. Everything after this is measured against it.",
      },
      {
        number: "03",
        title: "Build",
        body: "Venue, vendors, contracts, timeline, and every production detail. You approve the decisions; the coordination, chasing, and problem-solving are not your job.",
      },
      {
        number: "04",
        title: "The day",
        body: "Nefeera is on site from setup to the last table cleared, running the timeline and absorbing whatever goes sideways. You are a guest at your own wedding.",
      },
    ],
  },

  gallery: {
    eyebrow: "Gallery",
    headline: "Selected work.",
    body: "A selection of details, settings, and moments from recent weddings.",
    viewLabel: "View image",
    lightbox: {
      close: "Close gallery",
      next: "Next image",
      previous: "Previous image",
      counterSeparator: "of",
      regionLabel: "Gallery image viewer",
      hint: "Use the arrow keys to move between images. Press Escape to close.",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
    },
  },

  testimonials: {
    eyebrow: "In their words",
    headline: "What couples say.",
    // NOTE FOR AHMED: Nefeera has no published testimonials yet. These three
    // cards render as VISIBLE placeholders on purpose — dashed gold border, no
    // invented names, no invented quotes. Replace each `quote`/`attribution`
    // with a real, permissioned client quote before launch. Do not ship the
    // site publicly with these still empty.
    pendingLabel: "Client testimonial — to be added",
    pendingHint: "Replace in src/data/Content.js before launch",
    items: [
      { id: "t1", quote: null, attribution: null },
      { id: "t2", quote: null, attribution: null },
      { id: "t3", quote: null, attribution: null },
    ],
  },

  contact: {
    eyebrow: "Contact",
    headline: "Tell me about your wedding.",
    body: "The fastest way to reach Nefeera is WhatsApp. Send the date you have in mind, roughly how many guests, and where you are thinking — that is enough to start.",

    // CHANGING THE NUMBER: edit these two lines and nothing else.
    // `whatsapp` is the raw international form wa.me demands — no plus, no
    // leading zero, no spaces — and the link below is built from it, so the
    // two can no longer drift apart. `whatsappDisplay` stays written out by
    // hand because that is a typographic choice, not a derivable one.
    whatsapp: "201278765948",
    whatsappDisplay: "+20 127 876 5948",
    whatsappCta: "Message on WhatsApp",
    whatsappFloatLabel: "Message Nefeera on WhatsApp",

    instagram: "https://www.instagram.com/byyomnaelhadad",
    instagramHandle: "@byyomnaelhadad",

    // NOTE FOR AHMED: replace EMAIL_PLACEHOLDER with the real address.
    // Until then the email row is hidden from the page automatically —
    // see Contact.jsx. Nothing breaks, it simply does not render.
    email: "EMAIL_PLACEHOLDER",

    channelsLabel: "Direct channels",
  },

  footer: {
    tagline: "Wedding planning and design, led personally by Yomna El Hadad.",
    navLabel: "Footer navigation",
    rights: "All rights reserved.",
    credit: "Nefeera",
  },

  /**
   * ASSET PATHS — the only place media paths exist.
   * Absolute paths under /assets/ so files can be dropped into the repo through
   * the GitHub web UI with no code change and no rebuild step.
   */
  assets: {
    video: {
      heroDesktop: "/assets/video/hero-desktop.mp4",
      heroMobile: "/assets/video/hero-mobile.mp4",
      heroWebm: "/assets/video/hero.webm",
    },
    images: {
      heroPoster: "/assets/images/hero-poster.jpg",
      logoSvg: "/assets/images/logo.svg",
      logoPng: "/assets/images/logo.png",
      aboutYomna: "/assets/images/about-yomna.webp",
    },
    cases: [
      "/assets/images/case-01.webp",
      "/assets/images/case-02.webp",
      "/assets/images/case-03.webp",
      "/assets/images/case-04.webp",
    ],
    // Seven gallery slots. To add an eighth, add the path here AND a matching
    // entry in `assetSpecs` below, then run `npm run assets`.
    gallery: [
      "/assets/images/gallery-01.webp",
      "/assets/images/gallery-02.webp",
      "/assets/images/gallery-03.webp",
      "/assets/images/gallery-04.webp",
      "/assets/images/gallery-05.webp",
      "/assets/images/gallery-06.webp",
      "/assets/images/gallery-07.webp",
    ],
  },
};

/**
 * The WhatsApp deep link, built from the raw number above so a number change
 * cannot leave a stale link behind. The prefilled opener matters: a message
 * already written measurably raises the chance someone actually sends it.
 *
 * Assigned after the object literal rather than inside it because an object
 * cannot reference its own properties while it is still being defined.
 */
content.contact.whatsappUrl = `https://wa.me/${content.contact.whatsapp}?text=${encodeURIComponent(
  "Hi Nefeera, I'd like to talk about planning my wedding."
)}`;

/**
 * ASSET SPECIFICATIONS — keyed by the exact path in `content.assets`.
 *
 * kind:   "image" | "video" | "logo"
 * w / h:  exact pixel dimensions the final file must be
 * ratio:  CSS aspect-ratio string — locks the slot's box so swapping a real
 *         file in causes ZERO layout shift
 * maxKB:  maximum file size; larger files hurt load time on Egyptian mobile data
 * usedIn: plain-language location, for the non-developer uploading the file
 * alt:    the alt text used when the real image loads (screen readers)
 */
export const assetSpecs = {
  // ---- Hero video ----------------------------------------------------------
  "/assets/video/hero-desktop.mp4": {
    kind: "video",
    w: 1920,
    h: 1080,
    ratio: "16/9",
    maxKB: 6000,
    usedIn:
      "Hero background video — desktop and tablet. Landscape. A vertical file works too, but wide screens will crop it to its middle band.",
    alt: "Nefeera wedding film",
  },
  "/assets/video/hero-mobile.mp4": {
    kind: "video",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 4000,
    usedIn:
      "Hero background video — phones. Same shape as the desktop file while the source footage is vertical.",
    alt: "Nefeera wedding film",
  },
  "/assets/video/hero.webm": {
    kind: "video",
    w: 1920,
    h: 1080,
    ratio: "16/9",
    maxKB: 5000,
    usedIn:
      "Hero background video — smaller WebM version of the landscape file, used first when the browser supports it",
    alt: "Nefeera wedding film",
  },

  // ---- Hero still ----------------------------------------------------------
  "/assets/images/hero-poster.jpg": {
    kind: "image",
    w: 1920,
    h: 1080,
    ratio: "16/9",
    maxKB: 300,
    usedIn:
      "Hero — the still frame shown before the video plays, and instead of it on reduced-motion settings",
    alt: "A Nefeera wedding at dusk",
  },

  // ---- Logo ----------------------------------------------------------------
  "/assets/images/logo.svg": {
    kind: "logo",
    w: null,
    h: null,
    ratio: "auto",
    maxKB: 20,
    usedIn: "Header, footer, and favicon — preferred format. Overrides the drawn logo everywhere at once.",
    alt: "Nefeera — wedding planning and design by Yomna El Hadad",
  },
  "/assets/images/logo.png": {
    kind: "logo",
    w: 1200,
    h: null,
    ratio: "auto",
    maxKB: 200,
    usedIn: "Header and footer — fallback if you only have a raster logo. Must have a transparent background.",
    alt: "Nefeera — wedding planning and design by Yomna El Hadad",
  },

  // ---- About ---------------------------------------------------------------
  "/assets/images/about-yomna.webp": {
    kind: "image",
    w: 1200,
    h: 1200,
    ratio: "1/1",
    maxKB: 300,
    usedIn:
      "About section — portrait of Yomna El Hadad",
    alt: "Yomna El Hadad, founder and lead planner of Nefeera",
  },

  // ---- Featured wedding ----------------------------------------------------
  "/assets/images/case-01.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 450,
    usedIn:
      "Featured wedding — the opening image, beside the introduction copy",
    alt: "Ceremony and reception design for a Nefeera wedding",
  },
  "/assets/images/case-02.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Featured wedding — first image in the row of three",
    alt: "Table and place setting detail",
  },
  "/assets/images/case-03.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Featured wedding — second image in the row of three",
    alt: "Floral installation detail",
  },
  "/assets/images/case-04.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Featured wedding — third image in the row of three",
    alt: "Evening light across the reception",
  },

  // ---- Gallery -------------------------------------------------------------
  // Ratios are deliberately mixed so the grid reads as an editorial mosaic
  // rather than a row of identical cards. Each slot's ratio is fixed here, so
  // the mixed grid is exactly as strict a contract as a uniform one would be.
  "/assets/images/gallery-01.webp": {
    kind: "image",
    w: 1200,
    h: 1600,
    ratio: "3/4",
    maxKB: 400,
    usedIn:
      "Gallery — column 1, first image",
    alt: "Wedding detail — gallery image 1",
  },
  "/assets/images/gallery-02.webp": {
    kind: "image",
    w: 1200,
    h: 1600,
    ratio: "3/4",
    maxKB: 400,
    usedIn:
      "Gallery — column 1, second image",
    alt: "Wedding detail — gallery image 2",
  },
  "/assets/images/gallery-03.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Gallery — column 1, third image (tall)",
    alt: "Wedding detail — gallery image 3",
  },
  "/assets/images/gallery-04.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Gallery — column 2, first image (tall)",
    alt: "Wedding detail — gallery image 4",
  },
  "/assets/images/gallery-05.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Gallery — column 2, second image (tall)",
    alt: "Wedding detail — gallery image 5",
  },
  "/assets/images/gallery-06.webp": {
    kind: "image",
    w: 1200,
    h: 1600,
    ratio: "3/4",
    maxKB: 400,
    usedIn:
      "Gallery — column 2, third image",
    alt: "Wedding detail — gallery image 6",
  },
  "/assets/images/gallery-07.webp": {
    kind: "image",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 400,
    usedIn:
      "Gallery — column 3, first image (tall)",
    alt: "Wedding detail — gallery image 7",
  },
};

/**
 * Look up the spec for a path. Returns a safe default rather than throwing, so a
 * typo in a path degrades to a visible placeholder instead of a blank page.
 */
export function getAssetSpec(src) {
  return (
    assetSpecs[src] || {
      kind: "image",
      w: null,
      h: null,
      ratio: "4/5",
      maxKB: null,
      usedIn: "Unspecified slot",
      alt: "",
    }
  );
}

/** "gallery-01.webp" from "/assets/images/gallery-01.webp". */
export function getAssetFilename(src) {
  if (!src) return "";
  return src.split("/").pop();
}

/**
 * The requirement line printed inside a placeholder, e.g.
 * "gallery-01.webp — 1200×1600". Falls back to just the filename for vector
 * assets that have no fixed pixel size.
 */
export function getAssetRequirementLabel(src) {
  const spec = getAssetSpec(src);
  const filename = getAssetFilename(src);
  if (!spec.w || !spec.h) return filename;
  return `${filename} — ${spec.w}×${spec.h}`;
}

export default content;
