# CLAUDE.md — Ahmed Badway

> Work on main branch only. No new branches. Ever.

---

## 👤 Developer Profile
- **Name:** Ahmed Badway
- **Role:** Frontend Developer & Freelancer
- **Location:** Mansoura, Egypt
- **GitHub:** ahmedbadway
- **Expertise:** React, Vite, Tailwind CSS, Motion Design, Logo Design, Framer Motion, GSAP
- **Languages:** Arabic (native) + English

---

## 🌍 Project Types
- **All types:** Clinic websites, portfolios, SaaS, e-commerce, dashboards
- **Primary interface language:** English (Arabic navigation supported)
- **Design philosophy:** No generic AI templates — premium, intentional, high-end work

---

## 🌿 Git Rules
- `main` branch ONLY — never create new branches
- Every session: confirm you are on `main` before any work
- Commit messages in English, descriptive
- Never push to any branch except `main`

---

## 💻 Coding Rules
- No wireframes — start directly on code
- **PascalCase** file naming: `HeroSection.jsx`, `Navbar.jsx`, `Button.jsx`
- SVG placeholders for any missing images
- Images: always use `import.meta.env.BASE_URL`
- After every edit: flag unused or redundant code for deletion
- Main branch only — confirm before any work
- Design skills loaded before starting
- `.env` created and added to `.gitignore` before first commit
- CSS variables defined for colors — no hardcoding
- Add meta title and description to every page
- Always convert images to WebP format before using in code
- Add loading state to any button that submits a form
- Arabic content: always set dir="rtl" and lang="ar" on the HTML element

---

## 🛠️ Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Custom CSS (when needed)
- **Animation:** Motion (motion/react) / Framer Motion / GSAP
- **Fonts:** Choose what fits the design. If Claude sees a better font pairing, suggest it.
- **Build:** Vite (production-ready builds)
- **Color system:** CSS variables (OKLCH preferred) — never hardcode colors
- **Icons:** Phosphor Icons (preferred) or custom SVG

### Do NOT introduce any new library without asking me first
Examples of what NOT to add silently:
- Redux or any global state library
- styled-components or Emotion
- Material UI, Ant Design, or Chakra UI
- Axios — use native fetch only
- Any package not already in package.json

---

## 🎨 Design Skills

### Core Skills — Read at Session Start (Always)
These are the foundation. Read all three before any design work:
- `skills/Emil-Kowalski's-Motion-System/SKILL.md`
  - Animation choreography, micro-interactions, spring physics
- `skills/taste-skill/taste-skill/SKILL.md`
  - Default design language — landing pages, portfolios, anti-template
- `skills/taste-skill/output-skill/SKILL.md`
  - Complete code generation, no truncation, no placeholders

### Plugin Skills — Read on Demand (by project type)
Read only the one matching the current task:
- Final polish / audit → `skills/impeccable/SKILL.md`
- Redesign existing project → `skills/taste-skill/redesign-skill/SKILL.md`
- Premium creative / Awwwards → `skills/taste-skill/gpt-tasteskill/SKILL.md`
- Dashboard / SaaS / clean → `skills/taste-skill/minimalist-skill/SKILL.md`
- Dark / data-heavy / brutalist → `skills/taste-skill/brutalist-skill/SKILL.md`
- Soft premium UI → `skills/taste-skill/soft-skill/SKILL.md`

---

## 🤖 Claude Code Workflow
1. **Before starting:**
   - Read this file (CLAUDE.md) — mandatory
   - If LOCAL-CLAUDE.md exists in project — read it too
   - Then load relevant design skills from the list above
2. **File creation:** Always PascalCase, main branch only
3. **Code generation:** Complete, production-ready — no sketches or placeholders
4. **After editing:** Flag unused code, review bundle size
5. **Deployment:** Ask approval before any GitHub Pages or Vercel push

---

## 🚀 Deployment Options
You work with:
- **GitHub Pages** — auto-deploy via GitHub Actions
- **Vercel** — instant preview + production deployments
- **Netlify** — alternative hosting with instant builds

**Rule:** Never create `gh-pages` branch or trigger deployment without explicit approval. Always ask: **"Deploy to [platform] now?"**

---



## 📧 EmailJS Integration

### When to use
Only add EmailJS when I explicitly request it.
Contact method varies per project — implement whatever I specify.

### Setup (per client)
1. Create EmailJS account using CLIENT's email — never yours
2. Connect client's Gmail in EmailJS dashboard
3. Create template with these variables:
   - {{from_name}} — sender name
   - {{from_email}} — sender email
   - {{phone}} — phone number (optional)
   - {{message}} — message body
   - {{to_name}} — client name (doctor/company)
4. Copy Service ID, Template ID, Public Key into client's `.env`

### Install
```bash
npm install @emailjs/browser
```

### Environment Variables
Create `.env` in project root:
```
VITE_EMAILJS_SERVICE_ID=service_XXXXXXX
VITE_EMAILJS_TEMPLATE_ID=template_XXXXXXX
VITE_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXX
```

### Usage in code
```javascript
import.meta.env.VITE_EMAILJS_SERVICE_ID
import.meta.env.VITE_EMAILJS_TEMPLATE_ID
import.meta.env.VITE_EMAILJS_PUBLIC_KEY
```

### Delivery Rule
After project delivery — hand client their EmailJS account credentials. The account must be independent from yours.

---

## 🔒 Security — Environment Variables

Any key, token, or API secret MUST go in `.env` — never hardcode in code.

This includes:
- EmailJS keys (SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY)
- Any API keys (Google Maps, OpenAI, etc.)
- Any third-party service tokens

Rules:
- Always prefix with `VITE_` for Vite projects
- Always add `.env` to `.gitignore` before first commit
- Never commit `.env` to GitHub — ever
- If key is accidentally pushed — rotate it immediately

---

## 📝 Communication Style

### Response Format (ALWAYS)
1. **Arabic for explanations** — all conversational responses, explanations, and summaries in Arabic. **English only for code** — code itself and code comments stay in English regardless of reply language.
2. **Three-sentence summary** — what was done, what changed, what to expect next
3. **Concise output** — avoid long preambles or excessive explanation
4. **Production mindset** — code is ready to ship, not exploratory

### Design Advisor Mode
- **Flag problems immediately** — "This layout won't work on mobile because…"
- **Suggest alternatives** — "Instead, try this approach…"
- **Enforce best practices** — even if I didn't ask
- **Be direct** — no vague warnings, concrete advice only
- **Default recommendation:** You recommend what's best for the website, not what I said

---



## 🔧 Verification Commands

```bash
npm run build
npm run dev
npm run lint
npm run typecheck
```

---

## 📂 Project Structure (When Creating New)

```
my-project/
├── CLAUDE.md
├── .env                ← never push to GitHub
├── .gitignore          ← must include .env
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── styles/
│   ├── utils/
│   └── App.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎯 Key Principles

1. **No templates** — every site is custom, intentional, high-end
2. **Motion-first** — animations are considered from the start
3. **Responsive always** — tested at 375px, 768px, 1440px
4. **Performance matters** — no bloat, optimize for speed
5. **Production ready** — code ships as-is, no "polish later"
6. **Accessibility** — contrast, keyboard nav, semantic HTML mandatory
7. **Design authority** — I catch design issues before they happen

---

## 🚫 Anti-Patterns (Never Do These)

- Generic AI design templates (three-equal-cards, centered hero, etc.)
- Pure black (#000000) — use Off-Black or Zinc-950
- Gradient text on large headings
- Neon outer glows or generic shadows
- Emojis in code or UI
- Hardcoded colors — always use CSS variables
- Hardcoded API keys or secrets — always use `.env`
- Overlapping text and images (clean spatial separation)
- Placeholder copy ("Lorem ipsum", "John Doe", "Acme Corp")
- Disabled buttons without clear visual state
- No alt text on meaningful images

---



## 🔐 Important Rules
- **Work on `main` only** — this cannot be overstated
- **No breaking changes without discussion** — major refactors need approval
- **Commit often** — one logical change per commit
- **Test before saying done** — build, lint, typecheck, visual review
- **`.env` never on GitHub** — rotate any accidentally pushed key immediately

---

**Last updated:** June 14, 2026
**Committed to:** main branch only
