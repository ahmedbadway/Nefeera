import { useContent } from "../utils/UseLanguage.js";
import { reportFilmShowing, reportHeroPlaybackFailed } from "../utils/UseHeroMedia.js";
import VideoAsset from "./VideoAsset.jsx";

/**
 * The film behind the whole site.
 *
 * One fixed, full-viewport video layer rendered ONCE, behind everything. Every
 * section floats over it as a glass panel; the gaps between panels are where
 * the footage shows through. Fixed rather than re-rendered per section: one
 * <video> element decodes once, and scrolling costs nothing extra.
 *
 * NO CONTROL, BY DESIGN. The film runs continuously on every platform and
 * there is nothing on screen to start or stop it. Keeping that promise on iOS
 * takes real work — see the playback notes in VideoAsset.jsx — and the one
 * case where the film deliberately holds still is prefers-reduced-motion,
 * which is also what stands in for the pause control WCAG would otherwise
 * want. The whole layer is aria-hidden: it is decoration, and a screen reader
 * has nothing to say about it.
 *
 * THE VEIL: a plain warm-white wash (opacity var(--backdrop-veil), 0.32) laid
 * over the footage. It is what makes text contrast independent of whatever the
 * client uploads — the glass fills were tuned against black footage WITH this
 * veil in place. A plain background-color, never a filter: the glass panels
 * above already pay the blur cost. Under prefers-reduced-transparency the
 * variable rises to 0.9 (see Global.css).
 *
 * STACKING CONTRACT: this component, Nav, and WhatsAppFloat must stay direct
 * children of a transform-free root. A transform or filter on any ancestor
 * would become their containing block and break position: fixed (see App.jsx).
 */
export default function FixedVideoBackdrop() {
  const { assets } = useContent();

  return (
    // No transform on this layer. It carried a translateZ(0) compositing hint,
    // but a transform on an ancestor of a <video> is one of the ways iOS Safari
    // is known to stop painting it, and the hint bought nothing measurable.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <VideoAsset
        fill
        objectPositionClass="object-[35%_15%] md:object-center"
        desktopSrc={assets.video.heroDesktop}
        mobileSrc={assets.video.heroMobile}
        webmSrc={assets.video.heroWebm}
        poster={assets.images.heroPoster}
        label="Background film"
        onFilmShowing={reportFilmShowing}
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
  );
}
