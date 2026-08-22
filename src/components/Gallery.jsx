import { useState } from "react";
import { content, getAssetSpec } from "../data/Content.js";
import Asset from "./Asset.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import Lightbox from "./Lightbox.jsx";
import { ExpandIcon } from "./Icons.jsx";

/**
 * Gallery — nine slots in a mixed-ratio mosaic.
 *
 * CSS multi-column rather than a uniform grid. The nine slots are deliberately
 * three different shapes (4:5, 3:2, 1:1), which columns flow around naturally
 * while a grid would need every cell to match. A row of nine identical tiles is
 * the template look; an uneven mosaic reads as an edit.
 *
 * The mixed ratios are no looser a contract than uniform ones would be — each
 * slot's ratio is pinned in `assetSpecs`, printed in the upload README, and
 * enforced by the Asset box. Swapping any one file moves nothing.
 */
export default function Gallery() {
  const { gallery, assets } = content;
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative bg-warm-white py-24 sm:py-32 lg:py-40"
    >
      <div className="shell">
        <SectionHeading
          id="gallery-heading"
          eyebrow={gallery.eyebrow}
          headline={gallery.headline}
          body={gallery.body}
        />

        <div className="mt-16 gap-6 [column-count:1] sm:[column-count:2] lg:[column-count:3] lg:gap-8">
          {assets.gallery.map((src, index) => {
            const spec = getAssetSpec(src);
            const label = `Gallery ${String(index + 1).padStart(2, "0")}`;

            return (
              <Reveal
                key={src}
                delay={(index % 3) * 0.06}
                className="mb-6 break-inside-avoid lg:mb-8"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="group relative block w-full overflow-hidden"
                >
                  <span className="sr-only-focusable">
                    {`${gallery.viewLabel} — ${spec.alt || label}`}
                  </span>

                  <Asset
                    src={src}
                    ratio={spec.ratio}
                    label={label}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    imgClassName="transition-transform duration-[900ms] ease-out-strong group-hover:scale-[1.04]"
                    className="w-full"
                  />

                  {/* Hover affordance. Gated to real pointers by the
                      hoverOnlyWhenSupported flag in tailwind.config.js, so a tap
                      on a phone does not latch it on. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-500 ease-out-strong group-hover:bg-charcoal/25 group-hover:opacity-100 group-focus-visible:bg-charcoal/25 group-focus-visible:opacity-100"
                  >
                    <span className="flex h-12 w-12 items-center justify-center border border-cream/70 text-cream">
                      <ExpandIcon className="h-5 w-5" />
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={assets.gallery}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
