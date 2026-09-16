"use client";

import { ArrowUpRight } from "lucide-react";
import { CertificateChapter } from "@/components/certificates/certificate-chapter";
import { certificates } from "@/lib/data/certificates";

export function CertificateShowcase() {
  return (
    <section
      id="certificates"
      className="certificate-journey"
      aria-labelledby="certificates-heading"
    >
      <div className="certificate-collection-intro">
        <header className="journey-header page-width">
          <div>
            <p className="eyebrow">The collection</p>
            <h1 id="certificates-heading">
              Certificates <em>&amp; milestones.</em>
            </h1>
          </div>
          <p>
            Scroll to turn the badges.
            <br />
            Explore the work behind each one.
          </p>
        </header>
        <nav
          className="journey-index page-width"
          aria-label="Jump to a certificate"
        >
          {certificates.map((certificate, index) => (
            <a key={certificate.id} href={`#certificate-${certificate.id}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {certificate.title}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </nav>
      </div>
      {certificates.map((certificate, index) => (
        <CertificateChapter
          key={certificate.id}
          certificate={certificate}
          index={index}
        />
      ))}
    </section>
  );
}
