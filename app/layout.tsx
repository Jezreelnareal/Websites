import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollRestoration } from "@/components/scroll-restoration";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  authorName,
  defaultOgImage,
  personJsonLd,
  seoKeywords,
  siteDescription,
  siteName,
  siteUrl,
  websiteJsonLd
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${authorName} | Web & Blockchain Developer`,
    template: `%s | ${authorName}`
  },
  description: siteDescription,
  keywords: seoKeywords,
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  publisher: authorName,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${authorName} | Web & Blockchain Developer`,
    description: siteDescription,
    url: "/",
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
    title: `${authorName} | Web & Blockchain Developer`,
    description: siteDescription,
    images: [defaultOgImage],
    creator: "@jborlongan07"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const structuredData = JSON.stringify([personJsonLd, websiteJsonLd]).replace(
  /</g,
  "\\u003c"
);

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-reveal-ready">
      <body className="min-h-screen bg-[#0e0f0f] text-[#ededed] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <ScrollRestoration />
        <ScrollReveal />
        <SiteHeader />
        <main className="mx-auto w-full max-w-[2040px]">{children}</main>
        <div className="h-px w-full bg-[#ededed]/70" />
        <SiteFooter />
      </body>
    </html>
  );
}
