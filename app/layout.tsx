import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MotionReveal } from "@/components/motion-reveal";
import { SceneMotion } from "@/components/scene-motion";
import {
  authorName,
  defaultOgImage,
  personJsonLd,
  seoKeywords,
  siteDescription,
  siteName,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";
import "./classic-hero.css";
import "./experience.css";
import "./section-surfaces.css";
import "./navigation.css";
import "@fontsource-variable/dm-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  icons: {
    icon: { url: "/pics/nav-logo.png", type: "image/png" },
    shortcut: "/pics/nav-logo.png",
  },
  title: {
    default: `${authorName} | Web Designer & Developer`,
    template: `%s | ${authorName}`,
  },
  description: siteDescription,
  keywords: seoKeywords,
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  publisher: authorName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${authorName} | Web Designer & Developer`,
    description: siteDescription,
    url: "/",
    siteName,
    images: [
      {
        url: defaultOgImage,
        alt: `${authorName} portfolio preview`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${authorName} | Web Designer & Developer`,
    description: siteDescription,
    images: [defaultOgImage],
    creator: "@jborlongan07",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = JSON.stringify([personJsonLd, websiteJsonLd]).replace(
  /</g,
  "\\u003c",
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" id="top">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <MotionReveal />
        <SceneMotion />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
