import { content } from "../data/Content.js";
import Logo from "./Logo.jsx";
import { InstagramIcon, WhatsAppIcon } from "./Icons.jsx";

/**
 * Footer.
 *
 * Shares the ink ground with the contact section above it and is separated
 * by a single gold hairline rather than a colour change — the two read as one
 * dark close to the page instead of two stacked dark blocks.
 *
 * The year is computed, not written down, so the copyright line does not go
 * stale in January.
 */
export default function Footer() {
  const { footer, nav, contact, brand } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-warm-white">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 border-t border-champagne/30 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-5">
            <Logo variant="full" size="md" color="light" className="items-start" />
            <p className="mt-7 max-w-sm text-[0.875rem] leading-relaxed text-warm-white/65">
              {footer.tagline}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <nav aria-label={footer.navLabel}>
              <ul className="space-y-3.5">
                {nav.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="text-[0.75rem] uppercase tracking-wide2 text-warm-white/70 transition-colors duration-200 hover:text-champagne"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <ul className="space-y-3.5">
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[0.8125rem] text-warm-white/70 transition-colors duration-200 hover:text-champagne"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span dir="ltr">{contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[0.8125rem] text-warm-white/70 transition-colors duration-200 hover:text-champagne"
                >
                  <InstagramIcon className="h-4 w-4 shrink-0" />
                  <span dir="ltr">{contact.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-warm-white/10 py-7 text-[0.75rem] text-warm-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {footer.credit}. {footer.rights}
          </p>
          <p className="uppercase tracking-wide2">{brand.discipline}</p>
        </div>
      </div>
    </footer>
  );
}
