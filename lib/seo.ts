import type { Metadata } from "next";
import { contactInfo, portraitImage, socialLinks } from "@/lib/data";

export const siteUrl = "https://jezreel-portfolio.vercel.app";
export const siteName = "Jezreel Borlongan Portfolio";
export const authorName = "Jezreel Borlongan";
export const defaultOgImage = portraitImage;

export const siteDescription =
  "Portfolio of Jezreel Borlongan, a web and blockchain developer focused on clean interfaces, responsive builds, smart contract concepts, and creative media work.";

export const seoKeywords = [
  "Jezreel Borlongan",
  "Jezreel portfolio",
  "web developer portfolio",
  "Next.js developer",
  "TypeScript developer",
  "Tailwind CSS developer",
  "blockchain developer",
  "Solidity developer",
  "frontend developer",
  "video editor",
  "graphics editor",
  "Bulacan developer",
  "Philippines web developer"
];

export const sameAsLinks = socialLinks.map((link) => link.href);

type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path
}: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: `${title} | ${authorName}`,
      description,
      url: path,
      siteName,
      images: [
        {
          url: defaultOgImage,
          alt: `${authorName} portfolio preview`
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${authorName}`,
      description,
      images: [defaultOgImage]
    }
  };
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: authorName,
  url: siteUrl,
  image: `${siteUrl}${portraitImage}`,
  email: contactInfo.email,
  telephone: contactInfo.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Balagtas",
    addressRegion: "Bulacan",
    addressCountry: "PH"
  },
  jobTitle: "Web and Blockchain Developer",
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "React",
    "Solidity",
    "Web3",
    "PHP",
    "Golang",
    "PostgreSQL",
    "Video Editing",
    "Graphics Editing"
  ],
  sameAs: sameAsLinks
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  author: {
    "@type": "Person",
    name: authorName
  }
};
