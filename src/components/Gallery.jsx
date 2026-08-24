import { useState } from "react";
import { useContent } from "../utils/UseLanguage.js";
import GallerySlider from "./GallerySlider.jsx";
import Lightbox from "./Lightbox.jsx";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Gallery — seven slots on a full-bleed drag strip.
 *
 * The old CSS-column mosaic is gone. The images now live on a horizontal
 * strip you drag through (see GallerySlider.jsx), which does two things the
 * mosaic could not: it puts the film in the gaps between cards, and it makes
 * the gallery something you handle rather than scroll past.
 *
 * The mixed ratios are no looser a contract than uniform ones would be — each
 * slot's ratio is pinned in `assetSpecs`, printed in the upload README, and
 * enforced by the Asset box. Swapping any one file moves nothing.
 *
 * The heading sits on its own small glass plate: a full-width panel would
 * fight the full-bleed strip below it.
 */
export default function Gallery() {
  const { gallery, assets } = useContent();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <div className="glass inline-block rounded-3xl p-6 sm:p-8 lg:p-10">
          <SectionHeading
            id="gallery-heading"
            eyebrow={gallery.eyebrow}
            headline={gallery.headline}
            body={gallery.body}
          />
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <GallerySlider
          images={assets.gallery}
          onOpen={setOpenIndex}
          viewLabel={gallery.viewLabel}
          pagingLabels={{
            previous: gallery.lightbox.previous,
            next: gallery.lightbox.next,
          }}
        />
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
