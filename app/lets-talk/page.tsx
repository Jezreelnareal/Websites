import type { Metadata } from "next";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { ContactForm } from "./_components/contact-form";
import { contactInfo, socialLinks } from "@/lib/data/portfolio";
import { createPageMetadata } from "@/lib/seo";
import "./contact.css";

export const metadata: Metadata = createPageMetadata({
  title: "Let's Talk",
  description:
    "Start a conversation with Jezreel Borlongan about web development, visual work, or a collaboration. Send an inquiry or arrange a call.",
  path: "/lets-talk",
});

export default function LetsTalkPage() {
  return (
    <div className="page-width contact-page">
      <div className="contact-layout">
        <aside className="contact-aside">
          <header className="page-intro">
            <span className="eyebrow">
              Let&apos;s talk / Start a conversation
            </span>
            <h1 className="chapter-heading">
              <span>Your</span>
              <em>next idea.</em>
            </h1>
          </header>
          <p className="contact-invitation">
            A website, a video, or something still taking shape. Tell me a
            little about it, or let&apos;s find a time to talk it through.
          </p>
          <div className="contact-direct">
            <span className="eyebrow">Email me</span>
            <a href={`mailto:${contactInfo.email}`}>
              <Mail size={18} aria-hidden="true" />
              {contactInfo.email}
              <ArrowUpRight size={19} />
            </a>
          </div>
          <div className="contact-direct">
            <span className="eyebrow">Or give me a call</span>
            <a href={contactInfo.phoneHref}>
              <Phone size={18} aria-hidden="true" />
              {contactInfo.phone}
            </a>
          </div>
          <p className="contact-location">
            Balagtas, Bulacan
            <br />
            Philippines · UTC+8
          </p>
          <div className="contact-socials">
            {socialLinks
              .filter((link) =>
                ["GitHub", "Instagram", "Facebook"].includes(link.label),
              )
              .map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ArrowUpRight size={15} />
                </a>
              ))}
          </div>
        </aside>
        <section
          className="contact-form-wrap"
          aria-labelledby="contact-form-title"
        >
          <header className="contact-form-heading">
            <span className="eyebrow">Your project starts here</span>
            <h2 id="contact-form-title">
              Let&apos;s make a <em>connection.</em>
            </h2>
          </header>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
