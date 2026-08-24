import { useSyncExternalStore } from "react";
import { content as englishContent } from "../data/Content.js";
import { content as arabicContent } from "../data/Content.ar.js";

/**
 * Which language the site is in, and the copy that goes with it.
 *
 * A module-level store read through useSyncExternalStore rather than a React
 * context: every component on the page reads the copy, so a provider would
 * wrap the entire tree to hold one string. This keeps App.jsx as the plain
 * list of sections it is, and matches the store already used for the backdrop
 * media state in UseHeroMedia.js.
 *
 * `dir` and `lang` are written straight onto <html>. That is what makes the
 * whole layout mirror: every component was built on logical properties
 * (padding-inline, ps/pe, start/end), so the direction attribute is the only
 * switch the layout needs.
 */

const LANGUAGES = {
  en: { content: englishContent, dir: "ltr", label: "EN", fullLabel: "English" },
  ar: { content: arabicContent, dir: "rtl", label: "ع", fullLabel: "العربية" },
};

const STORAGE_KEY = "nefeera:language";
const listeners = new Set();

function readStoredLanguage() {
  if (typeof window === "undefined") return "en";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES[stored]) return stored;
  } catch {
    // Private mode, or storage disabled. Fall through to the browser's own
    // preference rather than failing.
  }

  // No stored choice: follow the browser, since an Arabic-speaking visitor
  // arriving from an Egyptian phone should not have to hunt for the toggle.
  const preferred = typeof navigator !== "undefined" ? navigator.language || "" : "";
  return preferred.toLowerCase().startsWith("ar") ? "ar" : "en";
}

let current = readStoredLanguage();

/** Push the current language onto <html>, which is what flips the layout. */
function applyToDocument(language) {
  if (typeof document === "undefined") return;
  const { dir } = LANGUAGES[language];
  document.documentElement.lang = language;
  document.documentElement.dir = dir;

  // The tab title and the meta description are outside React's tree.
  const { meta } = LANGUAGES[language].content;
  document.title = meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", meta.description);
}

// Run once at import so the first paint is already in the right direction.
applyToDocument(current);

export function setLanguage(next) {
  if (!LANGUAGES[next] || next === current) return;
  current = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // A visitor who cannot store the choice still gets it for this visit.
  }

  applyToDocument(next);
  listeners.forEach((notify) => notify());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return current;
}

/** @returns {"en"|"ar"} */
export function useLanguage() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** The copy object for the active language. Replaces importing `content`. */
export function useContent() {
  return LANGUAGES[useLanguage()].content;
}

/** @returns {boolean} true when the page is mirrored. */
export function useIsRtl() {
  return LANGUAGES[useLanguage()].dir === "rtl";
}

export { LANGUAGES };
