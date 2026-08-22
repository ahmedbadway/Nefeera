/**
 * Turn a logical asset path from Content.js into a real URL for this deployment.
 *
 * WHY THIS EXISTS:
 * Content.js stores every path as a plain absolute string — "/assets/images/
 * gallery-01.jpg". That is deliberate: it matches the folder someone drops a
 * file into through the GitHub web UI, it is greppable, and it is readable by
 * the Node scripts that generate the placeholders and the upload README.
 *
 * But GitHub Pages serves a project repo from a SUBPATH (/Nefeera/), so a bare
 * "/assets/..." resolves to the domain root and 404s. Vite exposes the deployed
 * prefix as import.meta.env.BASE_URL, and this joins the two.
 *
 * The split matters: paths stay logical everywhere they are STORED, compared,
 * or used as a lookup key, and are resolved only at the moment they become a
 * real URL — an <img src> or a fetch. Resolving earlier would break the
 * assetSpecs lookups, which are keyed by the logical path.
 *
 * This also satisfies the standing project rule that images go through
 * import.meta.env.BASE_URL, without giving up the drop-in upload property.
 *
 * NOTE: this lives outside Content.js on purpose. Content.js is imported by
 * plain Node scripts (GeneratePlaceholders, GenerateAssetReadme, VerifyAssets),
 * where import.meta.env does not exist and would throw.
 *
 * @param {string} path A logical path such as "/assets/images/gallery-01.jpg".
 * @returns {string} A URL correct for wherever this build is deployed.
 */
export function resolveAssetPath(path) {
  if (!path) return path;

  // Already a full URL or protocol-relative — leave it alone.
  if (/^(https?:)?\/\//i.test(path)) return path;

  // Data and blob URLs are already final.
  if (/^(data|blob):/i.test(path)) return path;

  const base = (import.meta.env?.BASE_URL || "/").replace(/\/$/, "");
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

export default resolveAssetPath;
