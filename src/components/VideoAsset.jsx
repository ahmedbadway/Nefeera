import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getAssetSpec, getAssetRequirementLabel, getAssetFilename } from "../data/Content.js";
import { buildPlaceholderSvg } from "../utils/PlaceholderSvg.js";
import { probeAsset } from "../utils/AssetProbe.js";
import { resolveAssetPath } from "../utils/ResolveAssetPath.js";
import { useMediaQuery } from "../utils/UseMediaQuery.js";

// The gestures that lift iOS's Low Power Mode autoplay block.
const GESTURES = ["pointerdown", "touchstart", "keydown", "scroll"];

// How many times a media error is retried before the slot admits defeat and
// falls back to the placeholder.
const MAX_MEDIA_RETRIES = 2;

// How long to let the element sit at readyState 0 — having fetched literally
// nothing — before asking it again. iOS can accept `preload="auto"` and then
// quietly do nothing with it, and nothing else in the page will notice.
const LOAD_WATCHDOG_MS = [2500, 6500];

// Where to seek to force a paint when the film is not allowed to move. Not 0:
// seeking to the time the element is already at is a no-op, and it is the seek
// completing that puts a frame on screen.
const STILL_FRAME_TIME = 0.05;

/**
 * A swappable background-video slot, used for the hero.
 *
 * THE PROBE ADVISES, IT NO LONGER DECIDES.
 * The requirement is that a MISSING video renders no <video> element — never a
 * broken player, never browser chrome. That is still true, and the probe (see
 * utils/AssetProbe.js) is still what tells us which optional cuts exist so the
 * right one is offered.
 *
 * But it used to be a gate: nothing mounted until the probe came back positive,
 * which quietly made a HEAD request a prerequisite for playing a video. Any
 * device where that request did not come back clean — an offline blink, a
 * carrier proxy, a browser economising on a metered connection — got no
 * <video> element at all, so the file on the server never had a chance to
 * prove itself and no amount of playback hardening downstream could help,
 * because there was nothing in the DOM to harden. That is the bug this file
 * had, and it is why "the file is fine and nothing plays" was possible.
 *
 * So the element now mounts on the primary file immediately and the probe only
 * refines it afterwards. The media element is the one thing here that can
 * actually fetch the bytes, so it gets to be the judge; `handleMediaError`
 * below is the safety net that retires the slot if it truly cannot play.
 *
 * WHAT RENDERS WHEN:
 *   first paint          -> <video> on the primary file, plus the placeholder
 *                           underneath it until a frame decodes
 *   file confirmed gone  -> the poster if one exists, else the placeholder,
 *                           and the <video> leaves the DOM
 *   anything else        -> <video>, looping continuously
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
 * @param {(showing: boolean) => void} [props.onFilmShowing] Fires when the
 *   element actually starts or stops rendering frames. This is what the hero
 *   styles against — "the file exists" is a different and much weaker claim.
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
  onFilmShowing,
}) {
  const prefersReducedMotion = useReducedMotion();
  const isPhone = useMediaQuery("(max-width: 767px)");

  // null while probing; a map of path -> "present"|"missing"|"unknown" after.
  const [available, setAvailable] = useState(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const errorCount = useRef(0);
  const fallbackVideoRef = useRef(null);
  const resolvedVideoRef = videoRef || fallbackVideoRef;

  useEffect(() => {
    let active = true;

    Promise.all([
      probeAsset(webmSrc),
      probeAsset(desktopSrc),
      probeAsset(mobileSrc),
      probeAsset(poster),
    ]).then(([webm, desktop, mobile, posterStatus]) => {
      if (active) setAvailable({ webm, desktop, mobile, poster: posterStatus });
    });

    return () => {
      active = false;
    };
  }, [webmSrc, desktopSrc, mobileSrc, poster]);

  // Build the <source> list, in preference order.
  //
  // The asymmetry here is the point. An OPTIONAL cut — the WebM, the portrait
  // phone file — has to be proven present before it is offered, because
  // pointing the element at a file that is not there is how resource selection
  // stalls. The PRIMARY file is the opposite: it is the one the site is
  // guaranteed to ship, so it is offered from the first render and only a
  // server that actually answered 404 takes it away again.
  const sources = useMemo(() => {
    const primary = desktopSrc ? [{ src: desktopSrc, type: "video/mp4" }] : [];

    // Nothing known yet, and waiting to find out is exactly what used to cost
    // us the whole film. Start loading.
    if (!available) return primary;

    // Phones get the portrait crop when it genuinely exists; otherwise they
    // fall back to the landscape file, framed by objectPositionClass.
    if (isPhone && available.mobile === "present") {
      return [{ src: mobileSrc, type: "video/mp4" }];
    }

    const list = [];
    if (available.webm === "present") list.push({ src: webmSrc, type: "video/webm" });
    if (desktopSrc && available.desktop !== "missing") {
      list.push({ src: desktopSrc, type: "video/mp4" });
    }
    if (list.length === 0 && mobileSrc && available.mobile !== "missing") {
      list.push({ src: mobileSrc, type: "video/mp4" });
    }
    return list;
  }, [available, isPhone, webmSrc, desktopSrc, mobileSrc]);

  const videoAvailable = sources.length > 0 && !playbackFailed;
  const posterAvailable = available?.poster === "present" && !posterFailed;

  // The film loops continuously, with one exception: prefers-reduced-motion.
  // A visitor who has asked their OS to stop moving interfaces is not asking
  // about this site in particular, and a film running behind every section is
  // precisely what that setting exists to refuse. They get a still frame
  // instead. That is also what keeps WCAG 2.2.2 satisfied now that there is no
  // pause button: the mechanism to stop the motion is the OS preference.
  //
  // A STILL FRAME MEANS A FRAME. This was the second way to end up looking at
  // nothing: the element mounted, autoplay was correctly withheld, and with no
  // poster file uploaded a paused <video> that has never fetched anything
  // paints absolutely nothing. Reduced motion asks for stillness, not for a
  // blank rectangle where the film should be — so that path now loads the file
  // and seeks a frame onto the screen, and simply never plays it.
  const showPoster = posterAvailable && !videoAvailable;
  const showVideo = videoAvailable;
  const autoPlayVideo = showVideo && !prefersReducedMotion;

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
  //  4. Reduced motion: no play() is coming, so a frame has to be seeked into
  //     place deliberately.
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
    // right after calling it — which is what this did at first — threw away
    // every remaining chance the moment one attempt was refused, and a refused
    // first attempt is the normal case on iOS.
    const attemptPlay = () => {
      if (!video.paused) return;
      const started = video.play();
      if (started && typeof started.then === "function") {
        started.then(unbind).catch(() => {
          // Refused. Keep listening; the next gesture gets another turn.
        });
      }
    };

    // Reduced motion: put one frame up and stop. A seek is what forces the
    // paint — merely having data loaded does not.
    const showStillFrame = () => {
      if (video.readyState < 1) return;
      if (video.currentTime >= STILL_FRAME_TIME) {
        unbind();
        return;
      }
      try {
        video.currentTime = STILL_FRAME_TIME;
      } catch {
        // Not seekable yet; a later readiness event tries again.
      }
    };

    const settle = autoPlayVideo ? attemptPlay : showStillFrame;

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
      settle();
    }

    settle();

    GESTURES.forEach((type) => window.addEventListener(type, kick, { passive: true }));
    document.addEventListener("visibilitychange", settle);
    // A file that arrives slowly is ready long after mount, and on a phone
    // connection that gap is where the first attempt quietly gets skipped.
    video.addEventListener("canplay", settle);
    video.addEventListener("loadeddata", settle);
    video.addEventListener("loadedmetadata", settle);

    // The watchdog. Nothing above fires when iOS decides not to fetch at all,
    // because "did nothing" raises no event — so this is the only thing that
    // catches that case, and it is the case a visitor on 4G actually hits.
    LOAD_WATCHDOG_MS.forEach((delay) => timers.push(window.setTimeout(kick, delay)));

    return () => {
      unbind();
      document.removeEventListener("visibilitychange", settle);
      video.removeEventListener("canplay", settle);
      video.removeEventListener("loadeddata", settle);
      video.removeEventListener("loadedmetadata", settle);
    };
  }, [showVideo, autoPlayVideo, resolvedVideoRef, sources]);

  // GIVING UP IS A LAST RESORT, NOT A FIRST RESPONSE.
  //
  // This used to retire the video permanently on the first error event, which
  // was survivable while a play button existed to bring it back. It is not
  // survivable now. And a media error is very often transient — a stalled
  // segment on a phone connection, a dropped request mid-download — rather
  // than the codec problem the handler assumed. So a failure reloads the
  // element and tries again, and only a run of them falls back to the
  // placeholder, which is the state that also tells the parent to restyle.
  const handleMediaError = () => {
    const video = resolvedVideoRef.current;
    const attempts = errorCount.current + 1;
    errorCount.current = attempts;

    if (attempts <= MAX_MEDIA_RETRIES && video) {
      // load() restarts resource selection from the top of the source list.
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
          poster={posterAvailable ? resolveAssetPath(poster) : undefined}
          ref={resolvedVideoRef}
          aria-hidden="true"
          tabIndex={-1}
          // A DIRECT src, not <source> children, whenever there is only one
          // file to offer — which is every case this site actually ships.
          // Safari's resource selection over <source> is the fragile path: it
          // is where "the file is fine but nothing plays" reports come from,
          // and it gives load() nothing obvious to re-fetch. With a single
          // candidate the element list buys nothing anyway.
          src={sources.length === 1 ? resolveAssetPath(sources[0].src) : undefined}

          // A DECODED FRAME is what means pixels are on screen — which is not
          // the same as playing, and getting that distinction wrong is what
          // made a reduced-motion visitor's hero dress itself for footage it
          // was never going to be shown. `loadeddata` and `seeked` both mean a
          // frame is up; a paused element keeps painting the one it has, so a
          // pause is NOT the picture going away and must not be reported as
          // one. Only `emptied` — the element genuinely holding nothing — is.
          onPlaying={() => onFilmShowing?.(true)}
          onLoadedData={() => onFilmShowing?.(true)}
          onSeeked={() => onFilmShowing?.(true)}
          onEmptied={() => onFilmShowing?.(false)}
          onError={handleMediaError}
        >
          {sources.length > 1
            ? sources.map((source) => (
                <source
                  key={source.src}
                  src={resolveAssetPath(source.src)}
                  type={source.type}
                />
              ))
            : null}
        </video>
      ) : null}
    </div>
  );
}
