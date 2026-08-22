import { useReducedMotion } from "motion/react";
import { content } from "../data/Content.js";
import { useAssetExists, useFirstAvailableAsset } from "./AssetProbe.js";

/**
 * What is actually behind the hero copy right now?
 *
 * Hero and Nav both style themselves off this, and they must agree — a hero
 * dressed for video while the header is dressed for the cream placeholder looks
 * broken. The probe cache in AssetProbe.js is keyed by path, so every caller
 * here shares one HEAD request per file.
 *
 * WHY `hasDarkMedia` IS NOT THE SAME AS `hasVideo`:
 * The question the styling actually needs answered is "is there a dark image
 * behind the text", and the video is not always what ends up there. Under
 * `prefers-reduced-motion` VideoAsset renders the POSTER and no video at all —
 * so a site with footage uploaded but no poster still shows the cream
 * placeholder to those visitors. Keying the scrim off video presence painted a
 * dark scrim over a cream panel and left cream text washed out on top of it.
 *
 * So: reduced motion asks about the poster, everything else asks about the
 * video (with the poster as a fallback, since it shows first while the video
 * buffers).
 *
 * `pending` counts as absent on purpose — that is the state the site ships in
 * today, and callers transition the colour change rather than snapping it, so a
 * late-arriving "present" crossfades.
 *
 * @returns {{ hasVideo: boolean, hasPoster: boolean, hasDarkMedia: boolean }}
 */
export function useHeroMedia() {
  const prefersReducedMotion = useReducedMotion();
  const { video, images } = content.assets;

  const videoProbe = useFirstAvailableAsset([
    video.heroWebm,
    video.heroDesktop,
    video.heroMobile,
  ]);
  const posterStatus = useAssetExists(images.heroPoster);

  const hasVideo = videoProbe.status === "present";
  const hasPoster = posterStatus === "present";

  const hasDarkMedia = prefersReducedMotion ? hasPoster : hasVideo || hasPoster;

  return { hasVideo, hasPoster, hasDarkMedia };
}

export default useHeroMedia;
