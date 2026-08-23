import { useEffect, useReducer } from "react";
import { content } from "../data/Content.js";
import { useAssetExists, useFirstAvailableAsset } from "./AssetProbe.js";

/**
 * Whether the hero video failed to actually PLAY, as opposed to failing to exist.
 *
 * The probe answers "is the file on the server". That is not the same question as
 * "is there a dark moving picture behind the headline right now". A file can be
 * present and still not play: a codec the browser lacks, a corrupt upload, a
 * decode error. When that happens VideoAsset drops back to the cream placeholder
 * — and if the hero and header were still styling themselves for video, cream
 * type would be sitting on a cream panel, invisible.
 *
 * Hero, Nav, and VideoAsset are siblings rather than parent and child, so this is
 * a tiny module-level store rather than a context: VideoAsset reports, the other
 * two re-render.
 */
let heroPlaybackFailed = false;
const playbackListeners = new Set();

export function reportHeroPlaybackFailed(failed) {
  if (heroPlaybackFailed === failed) return;
  heroPlaybackFailed = failed;
  playbackListeners.forEach((notify) => notify());
}

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
  const { video, images } = content.assets;

  // Re-render this consumer whenever playback state changes.
  const [, forceUpdate] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    playbackListeners.add(forceUpdate);
    return () => {
      playbackListeners.delete(forceUpdate);
    };
  }, []);

  const videoProbe = useFirstAvailableAsset([
    video.heroWebm,
    video.heroDesktop,
    video.heroMobile,
  ]);
  const posterStatus = useAssetExists(images.heroPoster);

  // A file that exists but cannot play is not media, for styling purposes.
  const hasVideo = videoProbe.status === "present" && !heroPlaybackFailed;
  const hasPoster = posterStatus === "present";

  // Reduced motion no longer removes the picture — VideoAsset holds the video's
  // first frame paused when there is no poster — so the same media counts in
  // both cases. Only a genuinely absent or unplayable file leaves the hero light.
  const hasDarkMedia = hasVideo || hasPoster;

  return { hasVideo, hasPoster, hasDarkMedia };
}

export default useHeroMedia;
