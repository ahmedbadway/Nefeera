import { useSyncExternalStore } from "react";
import { content } from "../data/Content.js";
import { useAssetExists } from "./AssetProbe.js";

/**
 * Is there actually a dark picture behind the hero copy right now?
 *
 * THE QUESTION THIS ANSWERS CHANGED, AND THAT WAS THE BUG.
 * It used to answer "does a video file exist on the server", which the probe
 * can tell you. But that is not the same question, and on iOS the gap between
 * them is visible: a <video> that has not started playing paints NOTHING when
 * there is no poster, so the file existed, the hero dressed itself for dark
 * footage — warm-white type over a heavy ink scrim — and what actually sat
 * behind it was the light placeholder field. The result read as a muddy green
 * rectangle rather than either of the two states that were designed.
 *
 * So the answer now comes from the element itself: the backdrop reports when
 * the film is genuinely rendering, and only then does the hero dress for it.
 * Every way playback can fail to start — a blocked autoplay, a slow file, a
 * decode error, Low Power Mode — lands on the light editorial hero, which is a
 * designed state rather than an accident.
 *
 * Hero and FixedVideoBackdrop are siblings rather than parent and child, so
 * this is a tiny module-level store rather than a context: the backdrop
 * reports, the hero re-renders.
 */
let filmIsShowing = false;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * Called by the backdrop when the film starts or stops actually rendering.
 * @param {boolean} showing
 */
export function reportFilmShowing(showing) {
  if (filmIsShowing === showing) return;
  filmIsShowing = showing;
  notify();
}

/** Kept for the failure path: a film that cannot play is not showing. */
export function reportHeroPlaybackFailed(failed) {
  if (failed) reportFilmShowing(false);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getFilmIsShowing() {
  return filmIsShowing;
}

/**
 * `pending` counts as absent on purpose — that is the state the page opens in,
 * and the hero transitions its colours rather than snapping them, so a film
 * that starts a moment later crossfades in.
 *
 * @returns {{ hasDarkMedia: boolean }}
 */
export function useHeroMedia() {
  const { images } = content.assets;

  const showing = useSyncExternalStore(subscribe, getFilmIsShowing, getFilmIsShowing);
  const posterStatus = useAssetExists(images.heroPoster);

  // A poster counts too: it is a real dark still, and it is what visitors with
  // reduced motion see in place of the film.
  const hasDarkMedia = showing || posterStatus === "present";

  return { hasDarkMedia };
}

export default useHeroMedia;
