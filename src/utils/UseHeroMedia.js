import { useEffect, useReducer } from "react";
import { content } from "../data/Content.js";
import { useAssetExists, useFirstAvailableAsset } from "./AssetProbe.js";

/**
 * Whether the backdrop film failed to actually PLAY, as opposed to failing to
 * exist. (The film lives in FixedVideoBackdrop behind the whole page; the hero
 * is still the consumer that styles itself against it.)
 *
 * The probe answers "is the file on the server". That is not the same question as
 * "is there a dark moving picture behind the headline right now". A file can be
 * present and still not play: a codec the browser lacks, a corrupt upload, a
 * decode error. When that happens VideoAsset drops back to the placeholder
 * field — and if the hero were still styling itself for video, warm-white type
 * would be sitting on a light panel, invisible.
 *
 * Hero and FixedVideoBackdrop are siblings rather than parent and child, so this
 * is a tiny module-level store rather than a context: the backdrop reports, the
 * hero re-renders.
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
 * The hero styles its type and scrim off `hasDarkMedia`; FixedVideoBackdrop
 * gates its pause control on `hasVideo`. The probe cache in AssetProbe.js is
 * keyed by path, so every caller here shares one HEAD request per file.
 *
 * WHY `hasDarkMedia` IS NOT THE SAME AS `hasVideo`:
 * The question the styling actually needs answered is "is there a dark image
 * behind the text", and the video is not always what ends up there — a poster
 * with no playable film still puts a dark picture behind the copy.
 *
 * `pending` counts as absent on purpose — that is the state the site ships in
 * today, and callers transition the colour change rather than snapping it, so a
 * late-arriving "present" crossfades.
 *
 * @returns {{ hasDarkMedia: boolean }}
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

  // hasPoster stays local: it feeds hasDarkMedia, but nothing outside this
  // module has ever needed to ask about the poster on its own.
  // hasVideo and hasPoster both stay local: they feed hasDarkMedia, and since
  // the film lost its play control nothing outside asks about either on its own.
  return { hasDarkMedia };
}

export default useHeroMedia;
