import { content as english } from "./Content.js";

/**
 * ARABIC COPY.
 *
 * This file holds ONLY the words. Everything structural — asset paths,
 * assetSpecs, the WhatsApp number and its URL, the Instagram handle — is
 * inherited from Content.js at the bottom of this file, because none of it is
 * language-dependent and two copies of a phone number is how a phone number
 * goes stale.
 *
 * TRANSLATION NOTES:
 *  - Modern Standard Arabic, written to read naturally to an Egyptian couple
 *    rather than as a literal word-for-word rendering of the English.
 *  - The brand wordmark stays Latin ("NEFEERA"). It is a logotype, not a word
 *    to be translated, and it is drawn as Latin letterforms in Logo.jsx.
 *  - The same two refusals as the English file hold here: no invented couple
 *    details in `featured`, no invented testimonials. Both render as visible
 *    "to be added" states until real, permissioned content exists.
 *
 * FOR AHMED: this is a first pass on the wording. Read it as a draft and
 * change any phrasing that is not how Yomna would say it — the meaning is
 * faithful to the English, but brand voice is yours to set.
 */
const arabic = {
  meta: {
    title: "نفيرة — تنسيق وتصميم أفراح بإشراف يمنى الحداد",
    description:
      "نفيرة تنسّق وتصمّم الأفراح في مصر لعدد محدود من العرسان كل موسم. تخطيط كامل، وتصميم، وإدارة يوم الفرح بإشراف يمنى الحداد.",
  },

  brand: {
    // The logotype stays Latin — it is a mark, not a word.
    name: "NEFEERA",
    subline: "بإشراف يمنى الحداد",
    discipline: "تنسيق وتصميم أفراح",
  },

  nav: {
    skipToContent: "تخطَّ إلى المحتوى",
    menuLabel: "القائمة الرئيسية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    items: [
      { id: "about", label: "عن نفيرة", href: "#about" },
      { id: "featured", label: "فرح مختار", href: "#featured" },
      { id: "process", label: "طريقة العمل", href: "#process" },
      { id: "gallery", label: "المعرض", href: "#gallery" },
      { id: "contact", label: "تواصل", href: "#contact" },
    ],
    cta: "ابدأ الحديث",
  },

  hero: {
    eyebrow: "تنسيق وتصميم أفراح — مصر",
    headline: "أفراح تشبه أصحابها.",
    body: "نفيرة تأخذ عددًا محدودًا من الأفراح كل موسم، حتى يحصل كل فرح على الاهتمام الذي يجعله مدروسًا لا مجمّعًا — من أول حديث إلى آخر طاولة تُرفع.",
    primaryCta: "ابدأ الحديث",
    secondaryCta: "شاهد الأعمال",
    secondaryHref: "#gallery",
    scrollHint: "انزل",
    playVideo: "تشغيل الفيلم الخلفي",
    pauseVideo: "إيقاف الفيلم الخلفي",
  },

  about: {
    eyebrow: "عن نفيرة",
    headline: "يمنى الحداد",
    lead: "نفيرة تقودها يمنى الحداد، التي تخطط وتصمم كل فرح بنفسها.",
    body: [
      "نفيرة موجودة لأن معظم الأفراح تُخطَّط بالتوزيع — منسّق القاعة هنا، ومنسّق الزهور هناك، وأحد أفراد العائلة ومعه جدول — فتخرج النتيجة وكأنها تفاوض لا تصميم.",
      "العمل هنا يسير عكس ذلك. شخص واحد يمسك الصورة كاملة: اتجاه التصميم، واختيار المورّدين، ومجرى اليوم، ومئة قرار صغير بينها لا يلاحظها أحد منفردة لكن الجميع يشعر بها مجتمعة.",
      "وهذا يعني قبول أفراح أقل مما يسمح به التقويم. إنها الطريقة الوحيدة للحفاظ على المستوى.",
    ],
    statsLabel: "لمحة سريعة",
    stats: [
      { value: "مصر", label: "المقر في القاهرة، والعمل في كل المحافظات" },
      { value: "عدد محدود", label: "عدد قليل من الأفراح كل موسم" },
      { value: "من البداية للنهاية", label: "تخطيط وتصميم وإدارة يوم الفرح" },
    ],
  },

  featured: {
    eyebrow: "فرح مختار",
    headline: "فرح واحد، من أوله لآخره.",
    // Same refusal as the English file: no couple name, venue, date, or guest
    // count until Ahmed has permission to publish real ones.
    detailsPending: "تفاصيل الفرح ستُضاف لاحقًا",
    details: [],
    body: [
      "كل فرح تأخذه نفيرة يحصل على المعاملة نفسها: اتجاه تصميمي يُحدَّد مبكرًا ويُحافَظ عليه حتى النهاية، بدل أن يُقرَّر قطعة بقطعة كلما حان موعد دفعة.",
      "الألوان، والطاولة، والإضاءة، والزهور، والمطبوعات، وإيقاع الليلة — كلها تُقرَّر كشيء واحد. حين يُحسم الاتجاه أولًا، تتوقف القرارات المنفردة عن كونها جدالًا وتصبح بديهية.",
    ],
    pullQuote:
      "الفرق بين فرح جميل وفرح لا يُنسى هو غالبًا قرار اتُّخذ قبله بستة أشهر.",
    captions: [
      "تصميم مكان العقد والاستقبال",
      "الطاولة وتنسيق المقاعد",
      "الزهور والتنفيذ",
      "إضاءة المساء والإخراج",
    ],
  },

  process: {
    eyebrow: "طريقة العمل",
    headline: "كيف يسير العمل.",
    body: "أربع مراحل، بالترتيب. لا تبدأ مرحلة قبل أن تُحسم التي قبلها.",
    steps: [
      {
        number: "٠١",
        title: "الحديث",
        body: "نتحدث قبل أي شيء آخر — عنكما، وعن قائمة المدعوين، والميزانية الحقيقية، وما تريدان أن تشعرا به تلك الليلة. لا عرض قبل أن يتضح هذا.",
      },
      {
        number: "٠٢",
        title: "الاتجاه",
        body: "اتجاه تصميمي واحد للفرح كله: الألوان، والخامات، والزهور، والمطبوعات، والإضاءة، وشكل الليلة. وكل ما يأتي بعده يُقاس عليه.",
      },
      {
        number: "٠٣",
        title: "التنفيذ",
        body: "القاعة، والمورّدون، والعقود، والجدول الزمني، وكل تفصيلة إنتاج. أنتما توافقان على القرارات؛ أما التنسيق والمتابعة وحل المشكلات فليست مهمتكما.",
      },
      {
        number: "٠٤",
        title: "يوم الفرح",
        body: "نفيرة موجودة في الموقع من التجهيز حتى رفع آخر طاولة، تدير الجدول وتمتص أي شيء يخرج عن مساره. أنتما ضيفان في فرحكما.",
      },
    ],
  },

  gallery: {
    eyebrow: "المعرض",
    headline: "أعمال مختارة.",
    body: "مجموعة من التفاصيل والأجواء واللحظات من أفراح قريبة.",
    viewLabel: "عرض الصورة",
    lightbox: {
      close: "إغلاق المعرض",
      next: "الصورة التالية",
      previous: "الصورة السابقة",
      counterSeparator: "من",
      regionLabel: "عارض صور المعرض",
      hint: "استخدم مفاتيح الأسهم للتنقل بين الصور. اضغط Escape للإغلاق.",
      zoomIn: "تكبير",
      zoomOut: "تصغير",
    },
  },

  testimonials: {
    eyebrow: "بكلماتهم",
    headline: "ماذا يقول العرسان.",
    // Same refusal as the English file: nothing invented, visible placeholders
    // until real permissioned quotes exist.
    pendingLabel: "رأي عميل — سيُضاف لاحقًا",
    pendingHint: "استبدله في src/data/Content.ar.js قبل الإطلاق",
    items: [
      { id: "t1", quote: null, attribution: null },
      { id: "t2", quote: null, attribution: null },
      { id: "t3", quote: null, attribution: null },
    ],
  },

  contact: {
    eyebrow: "تواصل",
    headline: "احكِ لي عن فرحك.",
    body: "أسرع طريقة للوصول إلى نفيرة هي واتساب. أرسل التاريخ الذي تفكر فيه، وعدد المدعوين تقريبًا، والمكان الذي في بالك — هذا يكفي للبداية.",

    whatsappCta: "راسلنا على واتساب",
    whatsappFloatLabel: "راسل نفيرة على واتساب",

    instagramCta: "شاهد المزيد على إنستغرام",
    emailCta: "أرسل بريدًا إلكترونيًا",

    channelsLabel: "قنوات مباشرة",
  },

  footer: {
    tagline: "تنسيق وتصميم أفراح، بإشراف شخصي من يمنى الحداد.",
    navLabel: "روابط التذييل",
    rights: "جميع الحقوق محفوظة.",
    credit: "نفيرة",
  },
};

/**
 * The exported object: Arabic words over the English structure.
 *
 * The spreads are shallow per section on purpose. `contact` in particular
 * MUST inherit the English entry's `whatsapp`, `whatsappUrl`, `instagram`,
 * `instagramHandle`, and `email` — those are identifiers, not copy, and the
 * WhatsApp URL carries its own prefilled Arabic-agnostic message.
 */
export const content = {
  ...english,
  meta: arabic.meta,
  brand: { ...english.brand, ...arabic.brand },
  nav: arabic.nav,
  hero: arabic.hero,
  about: arabic.about,
  featured: arabic.featured,
  process: arabic.process,
  gallery: arabic.gallery,
  testimonials: arabic.testimonials,
  contact: { ...english.contact, ...arabic.contact },
  footer: arabic.footer,
  // assets and everything else fall through from the English object.
};

export default content;
