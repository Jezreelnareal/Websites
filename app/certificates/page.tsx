import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CertificateShowcase } from "@/components/certificate-showcase";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Certificates",
  description:
    "Explore Jezreel Borlongan's AWS training badge, Trend Micro certificate, and programming and hackathon experiences, with contributions and credential links.",
  path: "/certificates",
});

export default function CertificatesPage() {
  return (
    <div className="certificates-page">
      <CertificateShowcase />
      <div className="certificate-collection-end page-width">
        <p>See where the learning goes next.</p>
        <Link href="/spotlights" className="text-link">
          Explore my projects <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
