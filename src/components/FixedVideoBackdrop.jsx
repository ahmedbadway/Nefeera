import { useRef, useState } from "react";
import { useContent } from "../utils/UseLanguage.js";
import { useHeroMedia, reportHeroPlaybackFailed } from "../utils/UseHeroMedia.js";
import VideoAsset from "./VideoAsset.jsx";
import { PlayIcon, PauseIcon } from "./Icons.jsx";

/**
 * The film behind the whole site.
 *
 * One fixed, full-viewport video layer rendered ONCE, behind everything. Every
 * section floats over it as a glass panel; the gaps between panels are where
 * the footage shows through. Fixed rather than re-rendered per section: one
 * <video> element decodes once, and scrolling costs nothing extra.
 *
 * THE VEIL: a plain warm-white wash (opacity var(--backdrop-veil), 0.32) laid
 * over the footage. It is what makes text contrast independent of whatever the
 * client uploads — the glass fills were tuned against black footage WITH this
 * veil in place. A plain background-color, never a filter: the glass panels
 * above already pay the blur cost. Under prefers-reduced-transparency the
 * variable rises to 0.9 (see Global.css).
 *
 * STACKING CONTRACT: this component, Nav, WhatsAppFloat, and the pause button
 * below must stay direct children of a transform-free root. A transform or
 * filter on any ancestor would become their containing block and break
 * position: fixed (see App.jsx).
 *
 * The pause control lives here — OUTSIDE the aria-hidden media layer — at the
 * bottom-start corner, mirroring WhatsAppFloat at bottom-end. It satisfies
 * WCAG 2.2.2 (stop anything auto-moving longer than five seconds) and it is
 * the only way to start the film where autoplay is refused (iOS Low Power
 * Mode, and every visitor with prefers-reduced-motion — see VideoAsset).
 */
export default function FixedVideoBackdrop() {
  const { hero, assets } = useContent();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Probe-backed: true only when a real, playable video file is mounted.
  const { hasVideo } = useHeroMedia();

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.loop = true;
      video.play().catch(() => {
        // A refused play() is not a broken file — leave the frame up.
      });
    } else {
      video.pause();
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ transform: "translateZ(0)" }}
      >
        <VideoAsset
          fill
          hideControl
          videoRef={videoRef}
          onPlayStateChange={setIsPlaying}
          objectPositionClass="object-[35%_15%] md:object-center"
          desktopSrc={assets.video.heroDesktop}
          mobileSrc={assets.video.heroMobile}
          webmSrc={assets.video.heroWebm}
          poster={assets.images.heroPoster}
          label="Background film"
          onPlaybackFailed={reportHeroPlaybackFailed}
        />

        {/* The veil. Plain color + one cheap gradient that lifts the nav and
            footer zones a touch — no filters on this layer, ever. */}
        <div
          className="absolute inset-0 bg-warm-white"
          style={{ opacity: "var(--backdrop-veil)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white/25 via-transparent to-warm-white/20" />
      </div>

      {hasVideo ? (
        <button
          type="button"
          onClick={togglePlayback}
          className={`glass-pill-dark pressable fixed bottom-5 start-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full text-warm-white transition-opacity duration-500 ease-out-strong hover:text-champagne focus-visible:opacity-100 sm:bottom-7 sm:start-7 ${
            isPlaying ? "opacity-60 hover:opacity-100" : "opacity-100"
          }`}
        >
          <span className="sr-only-focusable">
            {isPlaying ? hero.pauseVideo : hero.playVideo}
          </span>
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
      ) : null}
    </>
  );
}
