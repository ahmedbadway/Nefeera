import { useEffect, useState } from "react";
import { resolveAssetPath } from "./ResolveAssetPath.js";

/**
 * Does a file actually exist at this path?
 *
 * WHY A PROBE AND NOT JUST onError:
 * For <img> we can render the element and let onError tell us it failed — that
 * is cheaper and needs no extra request. But two cases cannot work that way:
 *
 *   - VideoAsset must decide whether to render a <video> element AT ALL. A
 *     <video> with missing sources shows browser chrome / a broken player for a
 *     beat before any error fires, and <source> error events are unreliable.
 *   - Logo must choose between logo.svg, logo.png, and the drawn fallback.
 *
 * THE HTML TRAP:
 * Static hosts (Vercel, Netlify, GitHub Pages with SPA rewrites) answer a
 * request for a missing file with `200 OK` and the contents of index.html
 * rather than a 404. Checking `res.ok` alone would report every missing asset
 * as present. So we also require the Content-Type to match what the extension
 * implies — an HTML body under a .mp4 request is a miss, not a hit.
 */

/** path -> Promise<boolean>. One probe per path per page load, shared by all callers. */
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
 * @param {string} path Absolute path such as "/assets/video/hero.webm".
 * @returns {Promise<boolean>} true only if a real file of the right type is there.
 */
export function probeAsset(path) {
  if (!path) return Promise.resolve(false);
  if (probeCache.has(path)) return probeCache.get(path);

  const request = (async () => {
    if (typeof fetch !== "function") return false;

    try {
      // Cache keys and returned values stay logical; only the request itself is
      // resolved against the deployment base. See ResolveAssetPath.js.
      const response = await fetch(resolveAssetPath(path), {
        method: "HEAD",
        cache: "force-cache",
      });

      if (!response.ok) return false;

      const expected = expectedTypePrefix(path);
      if (!expected) return true;

      const contentType = (response.headers.get("content-type") || "").toLowerCase();

      // No Content-Type at all: trust the 200. Some static hosts omit it on HEAD.
      if (!contentType) return true;

      return contentType.startsWith(expected);
    } catch {
      // Network error, blocked request, or an offline browser. Treat as missing
      // so the page falls back to a placeholder rather than a broken element.
      return false;
    }
  })();

  probeCache.set(path, request);
  return request;
}

/**
 * Probe several paths in order and resolve with the first one that exists.
 * Used by Logo to prefer logo.svg, then logo.png, then the drawn mark.
 *
 * @param {string[]} paths
 * @returns {Promise<string|null>}
 */
export async function probeFirstAvailable(paths) {
  for (const path of paths) {
    // Sequential on purpose: the common case is that none of them exist, and
    // this keeps us from firing several requests when the first would answer it.
    if (await probeAsset(path)) return path;
  }
  return null;
}

/**
 * React hook wrapper around probeAsset.
 * @param {string} path
 * @returns {"pending"|"present"|"missing"}
 */
export function useAssetExists(path) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let active = true;
    setStatus("pending");

    probeAsset(path).then((exists) => {
      if (active) setStatus(exists ? "present" : "missing");
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
