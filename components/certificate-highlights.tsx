import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CertificateChapter } from "@/components/certificate-showcase";
import { certificates } from "@/lib/certificates";

const highlights = [
  {
    id: "aws-cloud-quest",
    summary:
      "Hands-on AWS training in compute, networking, databases, and security.",
  },
  {
    id: "trend-micro",
    summary:
      "Team-based cybersecurity challenges in the 2025 University CTF Preliminary Round.",
  },
];

export function CertificateHighlights() {
  return (
    <section
      id="certificates"
      className="certificate-highlights page-width"
      aria-labelledby="certificate-highlights-heading"
    >
      <header className="certificate-highlights-header">
        <div>
          <span className="eyebrow">Learning in practice</span>
          <h2 id="certificate-highlights-heading">
            Milestones along <em>the way.</em>
          </h2>
        </div>
        <p>
          Two highlights from my journey.
          <br />
          Drag a badge to give it a spin.
        </p>
      </header>
      <div className="certificate-highlights-grid">
        {highlights.map((highlight, index) => {
          const certificate = certificates.find(
            (entry) => entry.id === highlight.id,
          );
          return certificate ? (
            <CertificateChapter
              key={certificate.id}
              certificate={certificate}
              index={index}
              preview
              summary={highlight.summary}
            />
          ) : null;
        })}
      </div>
      <Link
        href="/certificates"
        className="text-link certificate-highlights-link"
      >
        Explore my certificates <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
