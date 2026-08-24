import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getAssetSpec, getAssetRequirementLabel, getAssetFilename } from "../data/Content.js";
import { buildPlaceholderSvg } from "../utils/PlaceholderSvg.js";
import { probeAsset } from "../utils/AssetProbe.js";
import { resolveAssetPath } from "../utils/ResolveAssetPath.js";
import { useMediaQuery } from "../utils/UseMediaQuery.js";

// The gestures that lift iOS's Low Power Mode autoplay block.
const GESTURES = ["pointerdown", "touchstart", "keydown", "scroll"];

/**
 * A swappable background-video slot, used for the hero.
 *
 * WHY THIS PROBES INSTEAD OF USING onError:
 * The requirement is that a missing video renders NO <video> element at all —
 * never a broken player, never browser chrome, not even for a frame. A <video>
 * whose <source> children all 404 does show a blank box before anything fires,
 * and per-<source> error events are unreliable across browsers. So we ask the
 * server first (see utils/AssetProbe.js) and only mount a <video> once we know
 * a real video file is there.
 *
 * WHAT RENDERS WHEN:
 *   probe pending        -> shimmer placeholder (the same thing it becomes if
 *                           the files are missing, so there is no content flash)
 *   no video files       -> the poster if one exists, else the shimmer
 *                           placeholder. No <video> in the DOM either way.
 *   video files present  -> <video>, looping continuously
 *
 * The film loops with no on-screen control at all — see the playback notes
 * below for how that is held up on iOS, and what prefers-reduced-motion does.
 *
 * @param {object} props
 * @param {string} props.desktopSrc  Video path used at every width.
 * @param {string} [props.mobileSrc]  Optional portrait cut for phones. Omit it
 *   to serve the single `desktopSrc` file everywhere and adapt the framing with
 *   `objectPositionClass` instead — that is what the hero does.
 * @param {string} props.webmSrc     WebM version, offered before the MP4.
 * @param {string} props.poster      Still image path, shown before playback.
 * @param {string} [props.label]     Placeholder label, e.g. "Hero video".
 * @param {string} [props.ratio]     Aspect-ratio box. Omit when `fill` is set.
 * @param {boolean} [props.fill]     Fill the nearest positioned parent instead of boxing itself.
 * @param {string} [props.className] Classes for the wrapper.
 * @param {string} [props.objectPositionClass] Responsive object-position classes
 *   applied to the video and poster, e.g. "object-[35%_15%] md:object-center".
 * @param {(failed: boolean) => void} [props.onPlaybackFailed]
 *   Called when a video file exists but will not play, so the surrounding
 *   layout can stop styling itself for dark media it is not actually getting.
 * @param {React.RefObject} [props.videoRef] External ref attached to the
 *   <video> element, for a parent that needs to inspect playback.
 */
export default function VideoAsset({
  desktopSrc,
  mobileSrc,
  webmSrc,
  poster,
  label = "Hero video",
  ratio,
  fill = false,
  className = "",
  objectPositionClass = "object-center",
  onPlaybackFailed,
  videoRef = null,
}) {
  const prefersReducedMotion = useReducedMotion();
  const isPhone = useMediaQuery("(max-width: 767px)");

  // null while probing; an object once we know what exists on the server.
  const [available, setAvailable] = useState(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const fallbackVideoRef = useRef(null);
  const resolvedVideoRef = videoRef || fallbackVideoRef;

  useEffect(() => {
    let active = true;

    Promise.all([
      probeAsset(webmSrc),
      probeAsset(desktopSrc),
      probeAsset(mobileSrc),
      probeAsset(poster),
    ]).then(([webm, desktop, mobile, posterExists]) => {
      if (active) setAvailable({ webm, desktop, mobile, poster: posterExists });
    });

    return () => {
      active = false;
    };
  }, [webmSrc, desktopSrc, mobileSrc, poster]);

  // Build the <source> list from what actually exists, in preference order.
  const sources = useMemo(() => {
    if (!available) return [];

    // Phones get the portrait crop when it exists; otherwise they fall back to
    // the landscape files rather than showing a placeholder unnecessarily.
    if (isPhone && available.mobile) {
      return [{ src: mobileSrc, type: "video/mp4" }];
    }

    const list = [];
    if (available.webm) list.push({ src: webmSrc, type: "video/webm" });
    if (available.desktop) list.push({ src: desktopSrc, type: "video/mp4" });
    if (list.length === 0 && available.mobile) {
      list.push({ src: mobileSrc, type: "video/mp4" });
    }
    return list;
  }, [available, isPhone, webmSrc, desktopSrc, mobileSrc]);

  const videoAvailable = sources.length > 0 && !playbackFailed;
  const posterAvailable = Boolean(available?.poster) && !posterFailed;

  // The film loops continuously, with one exception: prefers-reduced-motion.
  // A visitor who has asked their OS to stop moving interfaces is not asking
  // about this site in particular, and a film running behind every section is
  // precisely what that setting exists to refuse. They get a still first frame
  // instead. That is also what keeps WCAG 2.2.2 satisfied now that there is no
  // pause button: the mechanism to stop the motion is the OS preference.
  const showPoster = posterAvailable && !videoAvailable;
  const showVideo = videoAvailable;
  const autoPlayVideo = showVideo && !prefersReducedMotion;

  // KEEPING IT PLAYING, EVERYWHERE.
  //
  // Three separate things stop a background film, and there is no button to
  // fall back on any more, so each one is handled:
  //
  //  1. iOS reads the `muted` ATTRIBUTE to decide whether autoplay is allowed,
  //     and React only ever sets the property — the attribute never reaches
  //     the markup. Without it an iPhone sits on a black frame forever, so it
  //     is stamped on imperatively before play() is attempted.
  //  2. iOS in Low Power Mode refuses autoplay outright, no matter the markup.
  //     Nothing can override that, but the refusal is lifted by the visitor's
  //     first real gesture — so the first tap, click, or scroll anywhere on
  //     the page retries playback, once, and then unbinds itself.
  //  3. Returning to a backgrounded tab can leave the element paused, so
  //     visibility changes retry too.
  useEffect(() => {
    const video = resolvedVideoRef.current;
    if (!video || !showVideo) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");

    if (!autoPlayVideo) return undefined;

    const attemptPlay = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Still refused. The next gesture gets another turn.
        });
      }
    };

    attemptPlay();

    const onFirstGesture = () => {
      attemptPlay();
      // One retry per gesture type is enough; a film that could not start on
      // a real tap is not going to start on the tenth.
      GESTURES.forEach((type) => window.removeEventListener(type, onFirstGesture));
    };

    GESTURES.forEach((type) =>
      window.addEventListener(type, onFirstGesture, { once: false, passive: true })
    );
    document.addEventListener("visibilitychange", attemptPlay);

    return () => {
      GESTURES.forEach((type) => window.removeEventListener(type, onFirstGesture));
      document.removeEventListener("visibilitychange", attemptPlay);
    };
  }, [showVideo, autoPlayVideo, resolvedVideoRef, sources]);

  const specSource = (isPhone && mobileSrc) || desktopSrc;
  const spec = getAssetSpec(specSource);
  const requirement = getAssetRequirementLabel(specSource);
  const resolvedLabel = label;

  const placeholderMarkup = useMemo(
    () =>
      buildPlaceholderSvg({
        width: spec.w,
        height: spec.h,
        ratio: ratio || spec.ratio || "16/9",
        label: resolvedLabel,
        requirement,
        // No shimmer under reduced motion — that is movement too.
        animated: !prefersReducedMotion,
        idSeed: getAssetFilename(specSource) || "video",
        // Full-bleed slots draw the warm-white field only. The artwork is cropped
        // unpredictably by `slice` at this size, so the label is rendered as
        // positioned HTML below instead. See PlaceholderSvg.js.
        showLockup: !fill,
      }),
    [
      spec.w,
      spec.h,
      spec.ratio,
      ratio,
      resolvedLabel,
      requirement,
      specSource,
      prefersReducedMotion,
      fill,
    ]
  );

  const mediaPresent = showVideo || showPoster;

  const wrapperStyle = fill ? undefined : { aspectRatio: ratio || spec.ratio || "16/9" };
  const wrapperClass = `${
    fill ? "absolute" : "relative"
  } inset-0 overflow-hidden bg-sage-mist [&>div>svg]:block [&>div>svg]:h-full [&>div>svg]:w-full ${className}`;

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {/* Placeholder. Stays mounted underneath so it also covers the gap before
          the first video frame paints. */}
      <div
        className="absolute inset-0"
        aria-hidden={mediaPresent ? "true" : undefined}
        dangerouslySetInnerHTML={{ __html: placeholderMarkup }}
      />

      {/* Requirement label for full-bleed slots, as HTML rather than SVG so it
          cannot be cropped away and cannot land on top of the hero copy. Sits
          below the header at the inline end, clear of everything else. */}
      {/* Bottom-end on phones, top-end from 640px up. On a 375px hero there is
          only ~50px between the header and the first line of copy, so the top
          slot does not exist at that width; the bottom is clear there because
          the scroll hint is hidden on small screens. */}
      {fill && !mediaPresent ? (
        <div
          className="pointer-events-none absolute bottom-6 end-[var(--gutter)] max-w-[min(18rem,68vw)] border border-champagne-deep/50 bg-warm-white/70 px-4 py-3 text-end backdrop-blur-[2px] sm:bottom-auto sm:top-28"
          role="img"
          aria-label={`${resolvedLabel} placeholder. Required file: ${requirement}`}
        >
          <p className="text-[0.6875rem] uppercase tracking-wide2 text-champagne-deep">{resolvedLabel}</p>
          <p className="mt-1 text-[0.75rem] leading-snug text-ink-muted">{requirement}</p>
        </div>
      ) : null}

      {showPoster ? (
        <img
          src={resolveAssetPath(poster)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover ${objectPositionClass}`}
          onError={() => setPosterFailed(true)}
        />
      ) : null}

      {showVideo ? (
        <video
          key={sources.map((source) => source.src).join("|")}
          className={`absolute inset-0 h-full w-full object-cover ${objectPositionClass}`}
          autoPlay={autoPlayVideo}
          muted
          loop={autoPlayVideo}
          playsInline
          // "auto" rather than "metadata": when a browser refuses autoplay the
          // video sits paused, and a paused video with only metadata loaded can
          // paint nothing at all. This guarantees there is a frame to show.
          preload="auto"
          poster={available?.poster ? resolveAssetPath(poster) : undefined}
          ref={resolvedVideoRef}
          aria-hidden="true"
          tabIndex={-1}

          onError={() => {
            // The file is there but the browser will not play it — a missing
            // codec, a corrupt upload, a decode error. Fall back to the
            // placeholder and tell the parent, so a hero styled for dark video
            // does not end up with warm-white type on a warm-white panel.
            setPlaybackFailed(true);
            onPlaybackFailed?.(true);
          }}
        >
          {sources.map((source) => (
            <source
              key={source.src}
              src={resolveAssetPath(source.src)}
              type={source.type}
            />
          ))}
        </video>
      ) : null}
    </div>
  );
}
