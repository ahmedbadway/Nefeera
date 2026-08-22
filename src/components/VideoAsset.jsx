import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getAssetSpec, getAssetRequirementLabel, getAssetFilename } from "../data/Content.js";
import { buildPlaceholderSvg } from "../utils/PlaceholderSvg.js";
import { probeAsset } from "../utils/AssetProbe.js";
import { resolveAssetPath } from "../utils/ResolveAssetPath.js";
import { useMediaQuery } from "../utils/UseMediaQuery.js";

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
 *   no video files       -> shimmer placeholder, no <video> in the DOM
 *   reduced motion       -> the poster still, or the placeholder if there is no
 *                           poster. Never a <video>, never a shimmer.
 *   video files present  -> <video> over the poster/placeholder
 *
 * @param {object} props
 * @param {string} props.desktopSrc  Landscape video path (768px and wider).
 * @param {string} props.mobileSrc   Portrait video path (below 768px).
 * @param {string} props.webmSrc     WebM version, offered before the MP4.
 * @param {string} props.poster      Still image path, shown before playback.
 * @param {string} [props.label]     Placeholder label, e.g. "Hero video".
 * @param {string} [props.ratio]     Aspect-ratio box. Omit when `fill` is set.
 * @param {boolean} [props.fill]     Fill the nearest positioned parent instead of boxing itself.
 * @param {string} [props.className] Classes for the wrapper.
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
}) {
  const prefersReducedMotion = useReducedMotion();
  const isPhone = useMediaQuery("(max-width: 767px)");

  // null while probing; an object once we know what exists on the server.
  const [available, setAvailable] = useState(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

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

  const showVideo = !prefersReducedMotion && sources.length > 0 && !playbackFailed;
  const showPoster =
    Boolean(available?.poster) && !posterFailed && (prefersReducedMotion || !showVideo);

  // Under reduced motion the file this slot is actually waiting for is the
  // poster, not the video — so that is what the placeholder should ask for.
  const specSource = prefersReducedMotion ? poster : isPhone ? mobileSrc : desktopSrc;
  const spec = getAssetSpec(specSource);
  const requirement = getAssetRequirementLabel(specSource);
  const resolvedLabel = prefersReducedMotion ? "Hero poster" : label;

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
        // Full-bleed slots draw the cream field only. The artwork is cropped
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
  } inset-0 overflow-hidden bg-cream [&>div>svg]:block [&>div>svg]:h-full [&>div>svg]:w-full ${className}`;

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
          className="pointer-events-none absolute bottom-6 end-[var(--gutter)] max-w-[min(18rem,68vw)] border border-gold/50 bg-warm-white/70 px-4 py-3 text-end backdrop-blur-[2px] sm:bottom-auto sm:top-28"
          role="img"
          aria-label={`${resolvedLabel} placeholder. Required file: ${requirement}`}
        >
          <p className="text-[0.6875rem] uppercase tracking-wide2 text-gold">{resolvedLabel}</p>
          <p className="mt-1 text-[0.75rem] leading-snug text-charcoal-muted">{requirement}</p>
        </div>
      ) : null}

      {showPoster ? (
        <img
          src={resolveAssetPath(poster)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterFailed(true)}
        />
      ) : null}

      {showVideo ? (
        <video
          key={sources.map((source) => source.src).join("|")}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={available?.poster ? resolveAssetPath(poster) : undefined}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setPlaybackFailed(true)}
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
