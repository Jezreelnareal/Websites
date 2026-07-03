import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollRestoration } from "@/components/scroll-restoration";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jezreel Borlongan | Portfolio",
    template: "%s | Jezreel Borlongan"
  },
  description:
    "Portfolio of Jezreel Borlongan, a web designer, developer, video editor, and graphics editor."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-reveal-ready">
      <body className="min-h-screen bg-[#0e0f0f] text-[#ededed] antialiased">
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
