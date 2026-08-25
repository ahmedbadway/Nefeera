import { useEffect, useState } from "react";
import { resolveAssetPath } from "./ResolveAssetPath.js";

/**
 * Does a file actually exist at this path?
 *
 * WHY A PROBE AND NOT JUST onError:
 * For <img> we can render the element and let onError tell us it failed — that
 * is cheaper and needs no extra request. But two cases cannot work that way:
 *
 *   - The background film needs to know whether a poster still exists before
 *     deciding what to paint before the first frame decodes. (The VIDEO itself
 *     is never gated on a probe any more — see VideoAsset.jsx.)
 *   - Logo must choose between logo.svg, logo.png, and the drawn fallback.
 *
 * THE HTML TRAP:
 * Static hosts (Vercel, Netlify, GitHub Pages with SPA rewrites) answer a
 * request for a missing file with `200 OK` and the contents of index.html
 * rather than a 404. Checking `res.ok` alone would report every missing asset
 * as present. So we also require the Content-Type to match what the extension
 * implies — an HTML body under a .mp4 request is a miss, not a hit.
 *
 * "MISSING" AND "COULD NOT TELL" ARE NOT THE SAME ANSWER.
 * This used to collapse them: any thrown fetch — an offline moment, a captive
 * portal, a carrier proxy that dislikes HEAD, a browser that declines the
 * request on a metered connection — came back as `false`, exactly as if the
 * server had said 404. For an <img> that is harmless. For the background film
 * it was fatal: a probe that could not reach the server meant no <video>
 * element was ever created, so a file that was sitting right there on the
 * server could never get a chance to play, and nothing downstream could
 * recover because there was nothing in the DOM to recover.
 *
 * So there are three answers now, and callers decide what an unknown is worth.
 * A decorative logo treats it as absent (the drawn mark is a fine outcome).
 * The film treats it as present and lets the media element be the judge — it
 * is the only thing here that can actually load the bytes.
 */

/** @typedef {"present"|"missing"|"unknown"} AssetStatus */

/** path -> Promise<AssetStatus>. One probe per path per page load, shared by all callers. */
const probeCache = new Map();

const TYPE_BY_EXTENSION = {
  mp4: "video/",
  webm: "video/",
  mov: "video/",
  jpg: "image/",
  jpeg: "image/",
  png: "image/",
  webp: "image/",
  avif: "image/",
  gif: "image/",
  svg: "image/",
};

function expectedTypePrefix(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  return TYPE_BY_EXTENSION[extension] || null;
}

/**
 * @param {string} path Absolute path such as "/assets/video/hero-desktop.mp4".
 * @returns {Promise<AssetStatus>} "present" only when a real file of the right
 *   type answered; "missing" when the server said so; "unknown" when the
 *   question could not be put to the server at all.
 */
export function probeAsset(path) {
  if (!path) return Promise.resolve("missing");
  if (probeCache.has(path)) return probeCache.get(path);

  const request = (async () => {
    if (typeof fetch !== "function") return "unknown";

    try {
      // Cache keys and returned values stay logical; only the request itself is
      // resolved against the deployment base. See ResolveAssetPath.js.
      const response = await fetch(resolveAssetPath(path), {
        method: "HEAD",
        cache: "force-cache",
      });

      // 404 and 410 are the server actually answering the question. Anything
      // else in the failure range — 403 from a proxy, 429, a 5xx, a gateway
      // timeout — says something went wrong on the way, not that the file is
      // absent, and must not be reported as absence.
      if (!response.ok) {
        return response.status === 404 || response.status === 410 ? "missing" : "unknown";
      }

      const expected = expectedTypePrefix(path);
      if (!expected) return "present";

      const contentType = (response.headers.get("content-type") || "").toLowerCase();

      // No Content-Type at all: trust the 200. Some static hosts omit it on HEAD.
      if (!contentType) return "present";

      // An HTML body under a .mp4 request is the SPA-rewrite trap: a real miss.
      return contentType.startsWith(expected) ? "present" : "missing";
    } catch {
      // Network error, a blocked or rewritten request, an offline browser. We
      // learned nothing about the file, and saying "missing" here is what used
      // to stop the film from ever mounting.
      return "unknown";
    }
  })();

  probeCache.set(path, request);
  return request;
}

/**
 * Probe several paths in order and resolve with the first one that is
 * definitely there. Used by Logo to prefer logo.svg, then logo.png, then the
 * drawn mark — a decorative choice, so an unknown falls through to the mark.
 *
 * @param {string[]} paths
 * @returns {Promise<string|null>}
 */
export async function probeFirstAvailable(paths) {
  for (const path of paths) {
    // Sequential on purpose: the common case is that none of them exist, and
    // this keeps us from firing several requests when the first would answer it.
    if ((await probeAsset(path)) === "present") return path;
  }
  return null;
}

/**
 * React hook wrapper around probeAsset.
 * @param {string} path
 * @returns {"pending"|"present"|"missing"|"unknown"}
 */
export function useAssetExists(path) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let active = true;
    setStatus("pending");

    probeAsset(path).then((result) => {
      if (active) setStatus(result);
    });

    return () => {
      active = false;
    };
  }, [path]);

  return status;
}

/**
 * React hook wrapper around probeFirstAvailable.
 * @param {string[]} paths
 * @returns {{ status: "pending"|"present"|"missing", src: string|null }}
 */
export function useFirstAvailableAsset(paths) {
  const [state, setState] = useState({ status: "pending", src: null });

  // Join into a stable primitive so the effect does not re-run on every render
  // just because a new array literal was passed in.
  const key = paths.join("|");

  useEffect(() => {
    let active = true;
    setState({ status: "pending", src: null });

    probeFirstAvailable(key.split("|")).then((src) => {
      if (!active) return;
      setState(src ? { status: "present", src } : { status: "missing", src: null });
    });

    return () => {
      active = false;
    };
  }, [key]);

  return state;
}
