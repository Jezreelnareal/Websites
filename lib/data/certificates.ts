export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  monogram: string;
  badgeLines: string[];
  description: string;
  contribution?: string;
  displayLines: [string, string];
  skills: string[];
  accent: string;
  // Add your original certificate and optional badge artwork in public/certificates.
  // Use certificate for an original document, or badge for an issuer's public badge record.
  kind: "preview" | "reference" | "certificate" | "badge";
  theme?: "aws-cloud-quest" | "trend-micro" | "python";
  logoImage?: string;
  documentUrl?: string;
  badgeImage?: string;
  verificationUrl?: string;
};

export const certificateLabel = (entry: Certificate) =>
  entry.kind === "reference"
    ? "Reference preview"
    : entry.kind === "preview"
      ? "Experience preview"
      : entry.kind === "badge"
        ? "Training badge"
        : "Certificate";

// Previews are based on the supplied video or existing experience, not verified credentials.
export const certificates: Certificate[] = [
  {
    id: "aws-cloud-quest",
    title: "AWS Cloud Quest",
    displayLines: ["AWS CLOUD", "QUEST"],
    issuer: "Amazon Web Services Training and Certification",
    year: "2026",
    category: "Cloud Practitioner",
    monogram: "aws",
    badgeLines: ["Cloud", "Practitioner"],
    description:
      "AWS Cloud Quest: Cloud Practitioner training badge, issued September 10, 2026, for foundational AWS solution-building skills.",
    contribution:
      "I completed the Cloud Practitioner solution-building assignments in AWS Cloud Quest, gaining hands-on practice with compute, networking, database, and security services.",
    skills: ["AWS", "Cloud Quest", "Cloud Practitioner"],
    accent: "#538c7a",
    kind: "badge",
    verificationUrl:
      "https://www.credly.com/badges/68d87284-dce1-4c2a-b374-3769da790911",
    theme: "aws-cloud-quest",
  },
  {
    id: "trend-micro",
    title: "Trend Micro uCTF",
    displayLines: ["TREND MICRO", "uCTF"],
    issuer: "Trend Micro",
    year: "2025",
    category: "Cybersecurity",
    monogram: "CTF",
    badgeLines: ["University CTF", "Preliminary Round"],
    description:
      "Certificate of participation in the University Capture the Flag Preliminary Round, sponsored by Trend Micro and held on August 22, 2025.",
    contribution:
      "I collaborated with my team to analyze cybersecurity scenarios and propose security-related solutions during the 2025 competition.",
    skills: ["Threat analysis", "System security", "Teamwork"],
    accent: "#ef1b23",
    theme: "trend-micro",
    logoImage: "/certificates/trend-micro-logo.jpg",
    documentUrl: "/certificates/trend-micro-uctf-2025.pdf",
    kind: "certificate",
  },
  {
    id: "icpep-python",
    title: "Python Programming",
    displayLines: ["PYTHON", "PROGRAMMING"],
    issuer: "ICPEP · Region 3",
    year: "2022",
    category: "Programming",
    monogram: "PY",
    badgeLines: ["Python", "Programming"],
    description:
      "Competitive programming experience built around Python, clear logic, and solving problems against the clock.",
    contribution:
      "I solved timed programming problems at the ICPEP Region 3 competition, applying Python concepts, logical thinking, and problem-solving skills.",
    skills: ["Python", "Problem-solving", "Algorithms"],
    accent: "#3776ab",
    theme: "python",
    logoImage: "/certificates/python-logo.svg",
    kind: "preview",
  },
  {
    id: "morph-hackathon",
    title: "Morph Hackathon",
    displayLines: ["MORPH", "HACKATHON"],
    issuer: "Morph Hackathon",
    year: "2026",
    category: "Blockchain",
    monogram: "WEB3",
    badgeLines: ["Smart Contract", "Development"],
    description:
      "Building smart contract concepts for secure, transparent payments and cross-border remittances.",
    contribution:
      "I worked on RemitSafe as a smart contract developer, writing Solidity contracts for a cross-border payment system during the Morph Hackathon.",
    skills: ["Solidity", "Web3", "Smart contracts"],
    accent: "#a4a0c1",
    kind: "preview",
  },
];
