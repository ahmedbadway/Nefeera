import { content } from "../data/Content.js";
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
  const { contact } = content;

  const hasEmail = Boolean(contact.email) && contact.email !== "EMAIL_PLACEHOLDER";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative bg-charcoal py-24 text-cream sm:py-32 lg:py-40"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-gold-soft">{contact.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="contact-heading"
                className="mt-5 text-[clamp(2.25rem,5.6vw,3.75rem)] text-cream"
              >
                {contact.headline}
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.8] text-cream/75">
                {contact.body}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable mt-10 inline-flex items-center gap-3 bg-gold px-8 py-[1.125rem] text-[0.8125rem] font-medium uppercase tracking-wide2 text-warm-white hover:bg-gold-soft hover:text-charcoal"
              >
                <WhatsAppIcon className="h-[1.125rem] w-[1.125rem]" />
                {contact.whatsappCta}
              </a>
            </Reveal>
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <h3 className="text-[0.6875rem] uppercase tracking-wide3 text-gold-soft">
                {contact.channelsLabel}
              </h3>

              <ul className="mt-7 border-t border-cream/15">
                <li>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-cream/15 py-5 transition-colors duration-200 hover:text-gold-soft"
                  >
                    <span className="flex items-center gap-3.5">
                      <WhatsAppIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold-soft" />
                      <span className="text-[0.9375rem]" dir="ltr">
                        {contact.whatsappDisplay}
                      </span>
                    </span>
                    <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100" />
                  </a>
                </li>

                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-cream/15 py-5 transition-colors duration-200 hover:text-gold-soft"
                  >
                    <span className="flex items-center gap-3.5">
                      <InstagramIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold-soft" />
                      <span className="text-[0.9375rem]" dir="ltr">
                        {contact.instagramHandle}
                      </span>
                    </span>
                    <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100" />
                  </a>
                </li>

                {hasEmail ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="group flex items-center justify-between gap-4 border-b border-cream/15 py-5 transition-colors duration-200 hover:text-gold-soft"
                    >
                      <span className="flex items-center gap-3.5">
                        <MailIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-gold-soft" />
                        <span className="break-all text-[0.9375rem]" dir="ltr">
                          {contact.email}
                        </span>
                      </span>
                      <ArrowIcon className="h-4 w-4 shrink-0 opacity-45 transition-all duration-300 ease-out-strong group-hover:translate-x-1 group-hover:opacity-100" />
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
