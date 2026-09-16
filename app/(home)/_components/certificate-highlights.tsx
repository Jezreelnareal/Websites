import { CertificateChapter } from "@/components/certificates/certificate-chapter";
import { certificates } from "@/lib/data/certificates";

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
    </section>
  );
}
