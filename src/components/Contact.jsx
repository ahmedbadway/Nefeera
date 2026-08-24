import { useContent } from "../utils/UseLanguage.js";
import Button from "./Button.jsx";
import Reveal from "./Reveal.jsx";
import { WhatsAppIcon, InstagramIcon, MailIcon, ArrowIcon } from "./Icons.jsx";

/**
 * Contact.
 *
 * WhatsApp first, deliberately: it is how people in Egypt actually start these
 * conversations, and it needs no form, no backend, and no API keys to go live.
 * The link carries a prefilled message — an opener already written measurably
 * raises the chance someone actually sends it.
 *
 * The phone number is stored twice in Content.js on purpose. wa.me requires raw
 * international digits with no plus, no leading zero, and no spaces
 * (201278765948), while humans need to read it as +20 127 876 5948. Deriving
 * one from the other at runtime is how that link quietly breaks.
 *
 * The email row renders only once a real address replaces EMAIL_PLACEHOLDER.
 * A mailto pointing at a placeholder is worse than no email row at all.
 */
export default function Contact() {
  const { contact } = useContent();

  const hasEmail = Boolean(contact.email) && contact.email !== "EMAIL_PLACEHOLDER";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        {/* The one dark panel on the page — a deep ink glass that still lets
            the film glow through at the edges. Warm-white text on the 0.82
            fill holds contrast over even white footage (see Global.css). */}
        <div className="glass-dark grid grid-cols-1 gap-14 rounded-3xl p-6 text-warm-white sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-champagne">{contact.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="contact-heading"
                className="mt-4 text-[clamp(1.75rem,3.8vw,2.75rem)] text-warm-white"
              >
                {contact.headline}
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-[0.9375rem] leading-[1.8] text-warm-white/75">
                {contact.body}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <Button
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                tone="dark"
                icon={<WhatsAppIcon className="h-[1.125rem] w-[1.125rem]" />}
                arrow
                className="mt-10"
              >
                {contact.whatsappCta}
              </Button>
            </Reveal>
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <h3 className="text-[0.6875rem] uppercase tracking-wide3 text-champagne">
                {contact.channelsLabel}
              </h3>

              <ul className="mt-7 border-t border-warm-white/15">
                <li>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-warm-white/15 py-5 transition-colors duration-200 hover:text-champagne"
                  >
                    <span className="flex items-center gap-3.5">
                      <WhatsAppIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-champagne" />
                      <span className="text-[0.875rem]" dir="ltr">
                        {contact.whatsappDisplay}
                      </span>
                    </span>
                    <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1" />
                  </a>
                </li>

                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-warm-white/15 py-5 transition-colors duration-200 hover:text-champagne"
                  >
                    <span className="flex items-center gap-3.5">
                      <InstagramIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-champagne" />
                      <span className="text-[0.875rem]" dir="ltr">
                        {contact.instagramHandle}
                      </span>
                    </span>
                    <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1" />
                  </a>
                </li>

                {hasEmail ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="group flex items-center justify-between gap-4 border-b border-warm-white/15 py-5 transition-colors duration-200 hover:text-champagne"
                    >
                      <span className="flex items-center gap-3.5">
                        <MailIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-champagne" />
                        <span className="break-all text-[0.875rem]" dir="ltr">
                          {contact.email}
                        </span>
                      </span>
                      <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1" />
                    </a>
                  </li>
                ) : null}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
