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

    whatsapp: "201278765948",
    whatsappUrl:
      "https://wa.me/201278765948?text=Hi%20Nefeera%2C%20I%27d%20like%20to%20talk%20about%20planning%20my%20wedding.",
    whatsappDisplay: "+20 127 876 5948",
    whatsappCta: "Message on WhatsApp",
    whatsappFloatLabel: "Message Nefeera on WhatsApp",

    instagram: "https://www.instagram.com/byyomnaelhadad",
    instagramHandle: "@byyomnaelhadad",
    instagramCta: "See more on Instagram",

    // NOTE FOR AHMED: replace EMAIL_PLACEHOLDER with the real address.
    // Until then the email row is hidden from the page automatically —
    // see Contact.jsx. Nothing breaks, it simply does not render.
    email: "EMAIL_PLACEHOLDER",
    emailCta: "Send an email",

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
      aboutYomna: "/assets/images/about-yomna.jpg",
    },
    cases: [
      "/assets/images/case-01.jpg",
      "/assets/images/case-02.jpg",
      "/assets/images/case-03.jpg",
      "/assets/images/case-04.jpg",
    ],
    gallery: [
      "/assets/images/gallery-01.jpg",
      "/assets/images/gallery-02.jpg",
      "/assets/images/gallery-03.jpg",
      "/assets/images/gallery-04.jpg",
      "/assets/images/gallery-05.jpg",
      "/assets/images/gallery-06.jpg",
      "/assets/images/gallery-07.jpg",
      "/assets/images/gallery-08.jpg",
      "/assets/images/gallery-09.jpg",
    ],
  },
};

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
    usedIn: "Hero background video — desktop and tablet (768px and wider)",
    alt: "Nefeera wedding film",
  },
  "/assets/video/hero-mobile.mp4": {
    kind: "video",
    w: 1080,
    h: 1920,
    ratio: "9/16",
    maxKB: 4000,
    usedIn: "Hero background video — phones (below 768px), portrait crop",
    alt: "Nefeera wedding film",
  },
  "/assets/video/hero.webm": {
    kind: "video",
    w: 1920,
    h: 1080,
    ratio: "16/9",
    maxKB: 5000,
    usedIn: "Hero background video — smaller WebM version, used first when the browser supports it",
    alt: "Nefeera wedding film",
  },

  // ---- Hero still ----------------------------------------------------------
  "/assets/images/hero-poster.jpg": {
    kind: "image",
    w: 1920,
    h: 1080,
    ratio: "16/9",
    maxKB: 300,
    usedIn: "Hero — the still frame shown before the video plays, and instead of it on reduced-motion settings",
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
  "/assets/images/about-yomna.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 300,
    usedIn: "About section — portrait of Yomna El Hadad",
    alt: "Yomna El Hadad, founder and lead planner of Nefeera",
  },

  // ---- Featured wedding ----------------------------------------------------
  "/assets/images/case-01.jpg": {
    kind: "image",
    w: 1800,
    h: 1200,
    ratio: "3/2",
    maxKB: 450,
    usedIn: "Featured wedding — the wide opening image at the top of the section",
    alt: "Ceremony and reception design for a Nefeera wedding",
  },
  "/assets/images/case-02.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Featured wedding — tall image, left of the pair below the opening image",
    alt: "Table and place setting detail",
  },
  "/assets/images/case-03.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Featured wedding — tall image, right of the pair below the opening image",
    alt: "Floral installation detail",
  },
  "/assets/images/case-04.jpg": {
    kind: "image",
    w: 1600,
    h: 900,
    ratio: "16/9",
    maxKB: 400,
    usedIn: "Featured wedding — the wide closing image at the bottom of the section",
    alt: "Evening light across the reception",
  },

  // ---- Gallery -------------------------------------------------------------
  // Ratios are deliberately mixed so the grid reads as an editorial mosaic
  // rather than a row of identical cards. Each slot's ratio is fixed here, so
  // the mixed grid is exactly as strict a contract as a uniform one would be.
  "/assets/images/gallery-01.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Gallery — column 1, first image (tall)",
    alt: "Wedding detail — gallery image 1",
  },
  "/assets/images/gallery-02.jpg": {
    kind: "image",
    w: 1500,
    h: 1000,
    ratio: "3/2",
    maxKB: 400,
    usedIn: "Gallery — column 1, second image (wide)",
    alt: "Wedding detail — gallery image 2",
  },
  "/assets/images/gallery-03.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Gallery — column 1, third image (tall)",
    alt: "Wedding detail — gallery image 3",
  },
  "/assets/images/gallery-04.jpg": {
    kind: "image",
    w: 1200,
    h: 1200,
    ratio: "1/1",
    maxKB: 400,
    usedIn: "Gallery — column 2, first image (square)",
    alt: "Wedding detail — gallery image 4",
  },
  "/assets/images/gallery-05.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Gallery — column 2, second image (tall)",
    alt: "Wedding detail — gallery image 5",
  },
  "/assets/images/gallery-06.jpg": {
    kind: "image",
    w: 1500,
    h: 1000,
    ratio: "3/2",
    maxKB: 400,
    usedIn: "Gallery — column 2, third image (wide)",
    alt: "Wedding detail — gallery image 6",
  },
  "/assets/images/gallery-07.jpg": {
    kind: "image",
    w: 1200,
    h: 1500,
    ratio: "4/5",
    maxKB: 400,
    usedIn: "Gallery — column 3, first image (tall)",
    alt: "Wedding detail — gallery image 7",
  },
  "/assets/images/gallery-08.jpg": {
    kind: "image",
    w: 1200,
    h: 1200,
    ratio: "1/1",
    maxKB: 400,
    usedIn: "Gallery — column 3, second image (square)",
    alt: "Wedding detail — gallery image 8",
  },
  "/assets/images/gallery-09.jpg": {
    kind: "image",
    w: 1500,
    h: 1000,
    ratio: "3/2",
    maxKB: 400,
    usedIn: "Gallery — column 3, third image (wide)",
    alt: "Wedding detail — gallery image 9",
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

/** "gallery-01.jpg" from "/assets/images/gallery-01.jpg". */
export function getAssetFilename(src) {
  if (!src) return "";
  return src.split("/").pop();
}

/**
 * The requirement line printed inside a placeholder, e.g.
 * "gallery-01.jpg — 1200×1500". Falls back to just the filename for vector
 * assets that have no fixed pixel size.
 */
export function getAssetRequirementLabel(src) {
  const spec = getAssetSpec(src);
  const filename = getAssetFilename(src);
  if (!spec.w || !spec.h) return filename;
  return `${filename} — ${spec.w}×${spec.h}`;
}

export default content;
