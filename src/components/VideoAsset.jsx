import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getAssetSpec, getAssetRequirementLabel, getAssetFilename } from "../data/Content.js";
import { buildPlaceholderSvg } from "../utils/PlaceholderSvg.js";
import { resolveAssetPath } from "../utils/ResolveAssetPath.js";

// The gestures that lift iOS's Low Power Mode autoplay block.
const GESTURES = ["pointerdown", "touchstart", "keydown", "scroll"];

// How many times a media error is retried before the slot admits defeat and
// falls back to the placeholder.
const MAX_MEDIA_RETRIES = 2;

// How long to let the element sit at readyState 0 — having fetched literally
// nothing — before asking it again. iOS can accept `preload="auto"` and then
// quietly do nothing with it, and nothing else in the page will notice.
const LOAD_WATCHDOG_MS = [2500, 6500];

/**
 * The background-video slot, used for the film behind the site.
 *
 * ONE FILE, EVERY DEVICE — AND THAT IS THE FIX.
 * This component used to be handed three candidate files (a landscape MP4, a
 * portrait phone cut, a WebM) and choose between them at runtime, which meant
 * a phone could not start playing until it had asked the server which of them
 * existed. Two things went wrong with that, and both of them ended with a
 * phone showing no film at all:
 *
 *   - the portrait cut was never uploaded, so phones spent their first seconds
 *     resolving a 404 instead of playing the file that was sitting there;
 *   - resource selection across <source> children is the fragile path in
 *     Safari — it is where "the file is fine but nothing plays" comes from,
 *     and it leaves load() nothing obvious to re-fetch.
 *
 * So there is exactly ONE src now, identical on a 375px phone and a 1440px
 * desktop, set as a direct attribute on the element from the first render.
 * Nothing is asked of the server before playback begins. Framing differences
 * between portrait and landscape screens are handled in CSS by
 * `objectPositionClass`, which cannot fail.
 *
 * WHAT RENDERS WHEN:
 *   first paint       -> <video> on the file, with the placeholder underneath
 *                        it until a frame decodes
 *   file will not play -> the poster if one exists, else the placeholder, and
 *                        the <video> leaves the DOM
 *
 * The film loops with no on-screen control at all — see the playback notes
 * below for how that is held up on iOS, and what prefers-reduced-motion does.
 *
 * @param {object} props
 * @param {string} props.src        The video path. One file, all widths.
 * @param {string} props.poster     Still image path, shown before playback.
 * @param {string} [props.label]    Placeholder label, e.g. "Background film".
 *
 * The slot always fills its positioned parent. It used to take `ratio`,
 * `className`, and a `fill` toggle for a boxed variant, but the film is the
 * only thing that has ever used this component and it always filled — so the
 * boxed path was unreachable code pretending to be an option.
 *
 * @param {string} [props.objectPositionClass] Responsive object-position classes
 *   applied to the video and poster, e.g. "object-[35%_15%] md:object-center".
 * @param {(failed: boolean) => void} [props.onPlaybackFailed]
 *   Called when the video will not play, so the surrounding layout can stop
 *   styling itself for dark media it is not actually getting.
 * @param {React.RefObject} [props.videoRef] External ref attached to the
 *   <video> element, for a parent that needs to inspect playback.
 * @param {(showing: boolean) => void} [props.onFilmShowing] Fires when the
 *   element actually starts or stops rendering frames. This is what the hero
 *   styles against — "the file exists" is a different and much weaker claim.
 */
export default function VideoAsset({
  src,
  poster,
  label = "Background film",
  objectPositionClass = "object-center",
  onPlaybackFailed,
  videoRef = null,
  onFilmShowing,
}) {
  const prefersReducedMotion = useReducedMotion();

  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const errorCount = useRef(0);
  const fallbackVideoRef = useRef(null);
  const resolvedVideoRef = videoRef || fallbackVideoRef;

  // NOTHING IS PROBED HERE ANY MORE, AND THAT IS THE POINT.
  //
  // The poster used to wait on a HEAD request before it was allowed onto the
  // element, which made it useless for the one job it has: covering the gap
  // before the first video frame decodes. That gap is at its widest in exactly
  // the first moment, and the probe guaranteed the poster arrived after it.
  //
  // A `poster` attribute pointing at a file that is not there costs nothing —
  // the browser paints no poster and shows no broken-image chrome, which is
  // the same outcome the probe was buying at the price of a round trip. So it
  // goes on the element immediately, and only the <img> fallback below (used
  // once the video has been retired) needs an onError at all.
  const videoAvailable = Boolean(src) && !playbackFailed;
  const posterAvailable = Boolean(poster) && !posterFailed;

  // THE FILM RUNS EVERYWHERE, prefers-reduced-motion INCLUDED.
  //
  // This is the client's standing decision, and it is recorded in
  // scripts/VerifyAssets.mjs: the film is a decorative background, and WCAG
  // 2.2.2 asks for a way to STOP motion that runs over five seconds, not for
  // it never to start. Reduced motion was briefly treated here as that stop
  // mechanism — the element loaded but was held on a single seeked frame
  // instead of playing.
  //
  // That silently reinstated a block the client had already removed, and it
  // was invisible from the outside: a visitor with the iOS Reduce Motion
  // setting on saw a page whose film simply never ran, with no error and
  // nothing to react to, which is indistinguishable from the film being
  // broken. It is a widely enabled setting, so "the video does not work on my
  // phone" was, for that visitor, exactly true.
  //
  // Everything else on the page still honours the preference — the placeholder
  // shimmer below, the Reveal animations, the parallax, the CSS guard in
  // Global.css. Only the background film is exempt.
  const showPoster = posterAvailable && !videoAvailable;
  const showVideo = videoAvailable;

  // GETTING A PICTURE ON SCREEN, EVERYWHERE.
  //
  // Four separate things leave this element blank, and there is no button to
  // fall back on any more, so each one is handled:
  //
  //  1. iOS reads the `muted` ATTRIBUTE to decide whether autoplay is allowed,
  //     and React only ever sets the property — the attribute never reaches
  //     the markup. Without it an iPhone sits on a black frame forever, so it
  //     is stamped on imperatively before play() is attempted.
  //  2. iOS in Low Power Mode refuses autoplay outright, no matter the markup.
  //     Nothing can override that, but the refusal is lifted by the visitor's
  //     first real gesture — so every tap, click, keypress, or scroll retries
  //     until one actually succeeds.
  //  3. On a cellular connection iOS downloads NOTHING up front, `preload`
  //     included: readyState stays 0, play() has no data to start from, and
  //     the failure is completely silent — no error, no event, nothing to
  //     react to. Only asking again fixes it, so a watchdog does exactly that
  //     on a timer as well as on the first gesture.
  useEffect(() => {
    const video = resolvedVideoRef.current;
    if (!video || !showVideo) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");

    let unbound = false;
    const timers = [];

    const unbind = () => {
      if (unbound) return;
      unbound = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      GESTURES.forEach((type) => window.removeEventListener(type, kick));
    };

    // Only stop once a play() actually RESOLVES. play() is async, so unbinding
    // right after calling it throws away every remaining chance the moment one
    // attempt is refused — and a refused first attempt is normal on iOS.
    const attemptPlay = () => {
      if (!video.paused) return;
      const started = video.play();
      if (started && typeof started.then === "function") {
        started.then(unbind).catch(() => {
          // Refused. Keep listening; the next gesture gets another turn.
        });
      }
    };

    // The one move that turns iOS's silent refusal around. Calling play() on an
    // element that fetched nothing just stalls; load() is what asks for bytes.
    function kick() {
      if (video.readyState === 0) {
        try {
          video.load();
        } catch {
          // Nothing to recover from; the attempt below still runs.
        }
      }
      attemptPlay();
    }

    attemptPlay();

    GESTURES.forEach((type) => window.addEventListener(type, kick, { passive: true }));
    document.addEventListener("visibilitychange", attemptPlay);
    // A file that arrives slowly is ready long after mount, and on a phone
    // connection that gap is where the first attempt quietly gets skipped.
    video.addEventListener("canplay", attemptPlay);
    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("loadedmetadata", attemptPlay);

    // The watchdog. Nothing above fires when iOS decides not to fetch at all,
    // because "did nothing" raises no event — so this is the only thing that
    // catches that case, and it is the case a visitor on 4G actually hits.
    LOAD_WATCHDOG_MS.forEach((delay) => timers.push(window.setTimeout(kick, delay)));

    return () => {
      unbind();
      document.removeEventListener("visibilitychange", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
      video.removeEventListener("loadeddata", attemptPlay);
      video.removeEventListener("loadedmetadata", attemptPlay);
    };
  }, [showVideo, resolvedVideoRef, src]);

  // GIVING UP IS A LAST RESORT, NOT A FIRST RESPONSE.
  //
  // A media error is very often transient — a stalled segment on a phone
  // connection, a dropped request mid-download — rather than a codec problem.
  // So a failure reloads the element and tries again, and only a run of them
  // falls back to the placeholder, which is the state that also tells the
  // parent to restyle.
  const handleMediaError = () => {
    const video = resolvedVideoRef.current;
    const attempts = errorCount.current + 1;
    errorCount.current = attempts;

    if (attempts <= MAX_MEDIA_RETRIES && video) {
      window.setTimeout(() => {
        try {
          video.load();
        } catch {
          // The element went away between the failure and this retry.
        }
      }, attempts * 400);
      return;
    }

    onFilmShowing?.(false);
    setPlaybackFailed(true);
    onPlaybackFailed?.(true);
  };

  const spec = getAssetSpec(src);
  const requirement = getAssetRequirementLabel(src);
  const resolvedLabel = label;

  const placeholderMarkup = useMemo(
    () =>
      buildPlaceholderSvg({
        width: spec.w,
        height: spec.h,
        ratio: spec.ratio || "16/9",
        label: resolvedLabel,
        requirement,
        // No shimmer under reduced motion — that is movement too.
        animated: !prefersReducedMotion,
        idSeed: getAssetFilename(src) || "video",
        // The warm-white field only: the artwork is cropped unpredictably by
        // `slice` at this size, so the label is rendered as positioned HTML
        // below instead. See PlaceholderSvg.js.
        showLockup: false,
      }),
    [
      spec.w,
      spec.h,
      spec.ratio,
      resolvedLabel,
      requirement,
      src,
      prefersReducedMotion,
    ]
  );

  const mediaPresent = showVideo || showPoster;

  return (
    <div className="absolute inset-0 overflow-hidden bg-sage-mist [&>div>svg]:block [&>div>svg]:h-full [&>div>svg]:w-full">
      {/* Placeholder. Stays mounted underneath so it also covers the gap before
          the first video frame paints. */}
      <div
        className="absolute inset-0"
        aria-hidden={mediaPresent ? "true" : undefined}
        dangerouslySetInnerHTML={{ __html: placeholderMarkup }}
      />

      {/* Requirement label as HTML rather than SVG so it cannot be cropped
          away and cannot land on top of the hero copy. Sits below the header
          at the inline end, clear of everything else. */}
      {/* Bottom-end on phones, top-end from 640px up. On a 375px hero there is
          only ~50px between the header and the first line of copy, so the top
          slot does not exist at that width; the bottom is clear there because
          the scroll hint is hidden on small screens. */}
      {!mediaPresent ? (
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
          className={`absolute inset-0 h-full w-full object-cover ${objectPositionClass}`}
          autoPlay
          muted
          loop
          playsInline
          // "auto" rather than "metadata": when a browser refuses autoplay the
          // video sits paused, and a paused video with only metadata loaded can
          // paint nothing at all. This guarantees there is a frame to show.
          preload="auto"
          poster={posterAvailable ? resolveAssetPath(poster) : undefined}
          ref={resolvedVideoRef}
          aria-hidden="true"
          tabIndex={-1}
          // A DIRECT src, never <source> children. There is one file, so there
          // is nothing to select between, and Safari's resource selection over
          // <source> is precisely the path that fails silently.
          src={resolveAssetPath(src)}
          // A DECODED FRAME is what means pixels are on screen — which is not
          // the same as playing. `loadeddata` means a frame is up; a paused
          // element keeps painting the one it has, so a pause is NOT the
          // picture going away and must not be reported as one. Only `emptied`
          // — the element genuinely holding nothing — is.
          onPlaying={() => onFilmShowing?.(true)}
          onLoadedData={() => onFilmShowing?.(true)}
          onEmptied={() => onFilmShowing?.(false)}
          onError={handleMediaError}
        />
      ) : null}
    </div>
  );
}
