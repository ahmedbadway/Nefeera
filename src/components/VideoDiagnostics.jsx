import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * An on-screen readout of what the background film is actually doing.
 *
 * WHY THIS EXISTS:
 * Every remaining way the film can fail is invisible from the outside — the
 * element paints nothing whether it was refused autoplay, never fetched a
 * byte, hit a decode error, or is playing perfectly behind a veil the visitor's
 * accessibility settings turned opaque. Those need completely different fixes
 * and look identical in a screenshot, and the device that knows the answer is
 * the visitor's phone, not any machine a developer can reach.
 *
 * So the phone can be asked directly. Open the site with `?debug=video` and
 * this panel reports the element's real state, refreshed four times a second.
 * It is opt-in and renders nothing at all otherwise — no cost, and no way for
 * a visitor to meet it by accident.
 *
 * Rendered through a PORTAL to <body>. Its natural parent is the fixed backdrop
 * layer, which carries z-0 and therefore opens a stacking context of its own —
 * inside it no z-index can lift the panel above the page, and the hero copy
 * draws straight through the readout. The portal steps outside that context so
 * the panel is genuinely on top.
 *
 * @param {object} props
 * @param {React.RefObject<HTMLVideoElement>} props.videoRef The film element.
 * @param {string} props.src The path the element was given.
 */
export default function VideoDiagnostics({ videoRef, src }) {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.get("debug") === "video");
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    // readyState and networkState are numbers in the spec; the names are what
    // make the readout answerable by someone who is not holding the spec.
    const READY = ["0 NOTHING", "1 METADATA", "2 CURRENT", "3 FUTURE", "4 ENOUGH"];
    const NETWORK = ["0 EMPTY", "1 IDLE", "2 LOADING", "3 NO_SOURCE"];
    const ERRORS = ["", "1 ABORTED", "2 NETWORK", "3 DECODE", "4 SRC_NOT_SUPPORTED"];

    const read = () => {
      const video = videoRef?.current;
      const root = document.documentElement;
      setState({
        element: video ? "yes" : "NO ELEMENT",
        src: video ? video.currentSrc || video.getAttribute("src") || "none" : "-",
        ready: video ? READY[video.readyState] : "-",
        network: video ? NETWORK[video.networkState] : "-",
        paused: video ? String(video.paused) : "-",
        time: video ? video.currentTime.toFixed(2) : "-",
        size: video ? `${video.videoWidth}x${video.videoHeight}` : "-",
        error: video && video.error ? ERRORS[video.error.code] : "none",
        errorText: video && video.error ? video.error.message : "",
        canPlay: video ? video.canPlayType('video/mp4; codecs="avc1.42E01E"') || "NO" : "-",
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        reducedTransparency: window.matchMedia("(prefers-reduced-transparency: reduce)").matches,
        lowData: window.matchMedia("(prefers-reduced-data: reduce)").matches,
        blurSupported: CSS.supports("backdrop-filter: blur(1px)") ||
          CSS.supports("-webkit-backdrop-filter: blur(1px)"),
        veil: getComputedStyle(root).getPropertyValue("--backdrop-veil").trim(),
      });
    };

    read();
    const id = window.setInterval(read, 250);
    return () => window.clearInterval(id);
  }, [enabled, videoRef, src]);

  if (!enabled || !state) return null;

  const rows = [
    ["element", state.element],
    ["src", state.src],
    ["readyState", state.ready],
    ["networkState", state.network],
    ["paused", state.paused],
    ["currentTime", state.time],
    ["videoSize", state.size],
    ["error", state.error],
    ["canPlay h264", state.canPlay],
    ["reduced motion", String(state.reducedMotion)],
    ["reduced transp.", String(state.reducedTransparency)],
    ["reduced data", String(state.lowData)],
    ["blur support", String(state.blurSupported)],
    ["veil", state.veil],
  ];

  return createPortal(
    <div
      dir="ltr"
      className="pointer-events-auto fixed inset-x-2 top-2 z-[100] max-h-[70vh] overflow-auto rounded-lg bg-ink p-3 font-mono text-[11px] leading-snug text-warm-white"
    >
      <p className="mb-2 font-bold uppercase tracking-wide2">Film diagnostics</p>
      <table className="w-full">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td className="pe-3 align-top opacity-70">{label}</td>
              <td className="break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.errorText ? <p className="mt-2 break-all">{state.errorText}</p> : null}
    </div>,
    document.body
  );
}
