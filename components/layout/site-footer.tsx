"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { contactInfo, socialLinks } from "@/lib/data/portfolio";

export function SiteFooter() {
  const isContactPage = usePathname() === "/lets-talk";
  if (isContactPage) return null;
  return (
    <footer className="site-footer" data-motion-scene>
      <div className="page-width">
        <div className="footer-top">
          <span className="eyebrow">
            {isContactPage ? "Elsewhere" : "Have a project in mind?"}
          </span>
          <span className="eyebrow">
            {isContactPage ? "Find me online." : "Let’s talk."}
          </span>
        </div>
        {!isContactPage && (
          <Link href="/lets-talk" className="footer-cta" data-interactive-media>
            Let&apos;s work
            <br />
            <em>together.</em>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
        <div className="footer-links">
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          <nav aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Jezreel Borlongan</span>
          <span>Made in Bulacan, PH</span>
          <a href="#top">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
