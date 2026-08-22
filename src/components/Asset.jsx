import { useMemo, useState } from "react";
import { getAssetSpec, getAssetRequirementLabel, getAssetFilename } from "../data/Content.js";
import { buildPlaceholderSvg } from "../utils/PlaceholderSvg.js";

/**
 * A swappable image slot.
 *
 *   <Asset src={content.assets.gallery[0]} ratio="4/5" label="Gallery 01" />
 *
 * `ratio`, `label`, and `alt` are all OPTIONAL — they are looked up from
 * `assetSpecs` in Content.js using `src` as the key. Passing them explicitly
 * overrides the lookup.
 *
 * ZERO LAYOUT SHIFT:
 * The wrapper always carries `aspect-ratio` from the spec, before the image has
 * even begun loading. The box is therefore identical whether the real file is
 * present, still downloading, or missing entirely — dropping a file into
 * /public/assets/ never moves anything else on the page.
 *
 * MISSING FILES:
 * `onError` catches both failure modes: a real 404 in development, and the
 * `200 OK` + index.html that static hosts return for missing paths (the HTML
 * body fails image decoding, which fires onError just the same).
 *
 * @param {object} props
 * @param {string} props.src             Path from content.assets, e.g. "/assets/images/gallery-01.jpg".
 * @param {string} [props.ratio]         CSS aspect-ratio override, e.g. "4/5". Defaults to the spec.
 * @param {string} [props.label]         Placeholder label override. Defaults to a humanized filename.
 * @param {string} [props.alt]           Alt text override. Defaults to the spec's alt.
 * @param {string} [props.className]     Classes for the wrapper box.
 * @param {string} [props.imgClassName]  Classes for the <img> itself.
 * @param {string} [props.objectPosition] CSS object-position, e.g. "center 30%".
 * @param {"cover"|"contain"} [props.objectFit] How the image fills its box. "contain" for the lightbox.
 * @param {boolean} [props.priority]     Load eagerly at high priority (above-the-fold only).
 * @param {string} [props.sizes]         Responsive `sizes` attribute.
 */

/** "gallery-01.jpg" -> "Gallery 01" */
function humanizeFilename(src) {
  const filename = getAssetFilename(src).replace(/\.[^.]+$/, "");
  return filename
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Asset({
  src,
  ratio,
  label,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = "center",
  objectFit = "cover",
  priority = false,
  sizes,
}) {
  const [status, setStatus] = useState("loading");

  const spec = getAssetSpec(src);
  const resolvedRatio = ratio || spec.ratio || "4/5";
  const resolvedLabel = label || humanizeFilename(src);
  const resolvedAlt = alt ?? spec.alt ?? "";

  const hasSource = Boolean(src);
  const isMissing = !hasSource || status === "error";

  const placeholderMarkup = useMemo(
    () =>
      buildPlaceholderSvg({
        width: spec.w,
        height: spec.h,
        ratio: resolvedRatio,
        label: resolvedLabel,
        requirement: getAssetRequirementLabel(src),
        animated: false,
        idSeed: getAssetFilename(src) || "asset",
      }),
    [spec.w, spec.h, resolvedRatio, resolvedLabel, src]
  );

  return (
    <div
      className={`relative overflow-hidden bg-cream [&>div>svg]:block [&>div>svg]:h-full [&>div>svg]:w-full ${className}`}
      style={{ aspectRatio: resolvedRatio }}
    >
      {/* Placeholder layer. Sits underneath and is revealed only when there is
          nothing on top of it. Hidden from screen readers while the real image
          is still loading, so the slot is not announced twice. */}
      <div
        className="absolute inset-0"
        aria-hidden={isMissing ? undefined : "true"}
        dangerouslySetInnerHTML={{ __html: placeholderMarkup }}
      />

      {hasSource && status !== "error" ? (
        <img
          src={src}
          alt={resolvedAlt}
          sizes={sizes}
          width={spec.w || undefined}
          height={spec.h || undefined}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out-strong ${imgClassName}`}
          style={{
            // object-fit/position set inline rather than via utility classes so
            // a caller-supplied className can never win the specificity race and
            // silently change how an image is cropped.
            objectFit,
            objectPosition,
            opacity: status === "loaded" ? 1 : 0,
          }}
        />
      ) : null}
    </div>
  );
}
