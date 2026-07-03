import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { contactInfo, navLinks, socialLinks } from "@/lib/data";

type SocialIconProps = {
  className?: string;
};

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M14.2 8.2V6.9c0-.6.4-.8 1-.8h1.6V3.4l-2.3-.1c-2.5 0-4.1 1.5-4.1 4.1v.8H8v3h2.4v9.5h3.1v-9.5h2.6l.4-3h-3.1Z" />
    </svg>
  );
}

function XIcon({ className }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M13.8 10.6 20.6 3h-1.7l-5.8 6.5L8.4 3H3l7.1 9.9L3 21h1.7l6.2-7 5 7H21Zm-2.2 2.5-.7-1L5.2 4.3h2.4l4.6 6.4.7 1 6 8.2h-2.4Z" />
    </svg>
  );
}

function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.7" cy="7.3" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GitHubIcon({ className }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.8 0c1.8-1.2 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  );
}

const socialIcons = {
  Facebook: FacebookIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  GitHub: GitHubIcon
};

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-[#dac5a7]/12 bg-[#0b0c0c] text-[#ededed]"
      data-scroll-reveal="section"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dac5a7]/35 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="Go to home"
              className="inline-flex items-center gap-4 transition"
              data-hover-load="soft"
            >
              <Image
                src="/pics/nav-logo.png"
                alt="Jezreel Borlongan logo"
                width={52}
                height={60}
                className="h-12 w-auto object-contain [filter:drop-shadow(0_0_12px_rgba(218,197,167,.14))]"
              />
              <span className="font-serif text-3xl font-light text-[#dac5a7]">
                Jezreel Borlongan
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-8 text-[#ededed]/60">
              Web designer and developer focused on clean interfaces,
              responsive builds, blockchain concepts, and visual content that
              feels clear to use.
            </p>
            <Link
              href="/lets-talk"
              className="mt-7 inline-flex items-center gap-3 border border-[#dac5a7]/30 bg-[#dac5a7]/[0.06] px-5 py-3 text-xs uppercase tracking-[0.16em] text-[#dac5a7] transition hover:border-[#dac5a7]/55 hover:bg-[#dac5a7]/[0.12]"
              data-hover-load="button"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs uppercase tracking-[0.28em] text-[#dac5a7]/55">
              Explore
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#ededed]/68">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex transition hover:text-[#dac5a7]"
                    data-hover-load="text"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#dac5a7]/55">
              Contact
            </p>
            <div className="mt-6 space-y-4 text-sm text-[#ededed]/68">
              <a
                href={contactInfo.phoneHref}
                className="group flex items-start gap-3 transition hover:text-[#dac5a7]"
                data-hover-load="text"
              >
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 flex-none text-[#dac5a7]/70"
                  strokeWidth={1.8}
                />
                <span>{contactInfo.phone}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-start gap-3 break-all transition hover:text-[#dac5a7]"
                data-hover-load="text"
              >
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 flex-none text-[#dac5a7]/70"
                  strokeWidth={1.8}
                />
                <span>{contactInfo.email}</span>
              </a>
              <p className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 flex-none text-[#dac5a7]/70"
                  strokeWidth={1.8}
                />
                <span>{contactInfo.location}</span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const SocialIcon =
                  socialIcons[social.label as keyof typeof socialIcons];

                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    data-hover-load="button"
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-[#ededed]/72 transition hover:border-[#dac5a7]/35 hover:text-[#dac5a7]"
                  >
                    {SocialIcon ? (
                      <SocialIcon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {social.label.slice(0, 2)}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#ededed]/42 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright (c) {currentYear} Jezreel Borlongan.</p>
          <p>Designed and developed with Next.js, Tailwind CSS, and TypeScript.</p>
        </div>
      </div>
    </footer>
  );
}
