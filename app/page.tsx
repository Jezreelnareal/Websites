import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ClassicHero } from "@/components/classic-hero";
import { CertificateHighlights } from "@/components/certificate-highlights";
import { SpotlightProjects } from "@/components/spotlight-projects";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ViewportVideo } from "@/components/viewport-video";
import { experienceEntries, webProjects } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Web Developer & Creative",
  description:
    "Jezreel Borlongan's selected work in web development, blockchain, video, and graphic design. Based in Bulacan, Philippines.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <ClassicHero />
      <CertificateHighlights />
      <section id="selected-work" className="work-section page-width">
        <div className="section-topline">
          <span className="eyebrow">01 / Selected work</span>
          <Link href="/spotlights" className="text-link">
            View all work <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="chapter-heading-wrap" data-motion-scene>
          <h2 className="chapter-heading">
            <span>Ideas into</span>
            <em>working code.</em>
          </h2>
          <p className="chapter-introduction">
            The learning becomes real here.
            <br />
            Websites, interfaces, and systems I&apos;ve built.
          </p>
        </div>
        <SpotlightProjects
          projects={["REMITSAFE", "V-CHAIN"].map(
            (title) => webProjects.find((project) => project.stageTitle === title)!,
          )}
          compact
        />
      </section>
      <section className="creative-section" data-motion-scene>
        <div className="creative-backdrop" aria-hidden="true">
          IN MOTION
        </div>
        <div className="creative-inner page-width">
          <div className="creative-copy">
            <span className="eyebrow">02 / Beyond development</span>
            <h2 className="chapter-heading">
              <span>Made to</span>
              <em>move you.</em>
            </h2>
            <p>
              Product graphics, thrift shop campaigns, and short-form edits.
              Here&apos;s the visual side of my work.
            </p>
            <Link href="/spotlights#graphics-editing" className="text-link">
              Explore visual work <ArrowUpRight size={19} />
            </Link>
          </div>
          <Link
            href="/spotlights#graphics-editing"
            className="creative-art"
            data-interactive-media
            aria-label="View LNGR product graphics"
          >
            <Image
              src="/pics/1-min.jpg"
              alt="Yellow LNGR thrift shop jacket campaign"
              width={800}
              height={800}
              sizes="(max-width: 767px) 55vw, 32vw"
            />
            <span>LNGR / Product graphics</span>
          </Link>
          <Link
            href="/spotlights#video-editing"
            className="creative-film"
            data-interactive-media
            aria-label="Watch video editing work"
          >
            <ViewportVideo
              src="/videos/video_1785359545229126.mp4"
              poster="/posters/film-1.jpg"
              muted
              playsInline
              loop
              preload="none"
              aria-hidden="true"
            />
            <span>
              Short-form edits <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </section>
      <section className="home-journey page-width" data-motion-scene>
        <div className="home-journey-heading">
          <span className="eyebrow">03 / The journey</span>
          <h2 className="chapter-heading">
            <span>Still</span>
            <em>building.</em>
          </h2>
          <p>
            My work moves between development and visual storytelling. I&apos;ve
            built booking interfaces during an internship, explored smart
            contracts at a hackathon, and created content for LNGR Thrift Shop.
          </p>
          <Link href="/who-am-i" className="text-link">
            Follow my journey <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-journey-entries">
          <p className="eyebrow story-invitation">
            Open a moment in the journey
          </p>
          <ExperienceTimeline
            name="home-journey"
            entries={[
              "lngr-content-creator",
              "school-dyh-website",
              "thesis-v-chain",
            ].map((id) => experienceEntries.find((entry) => entry.id === id)!)}
          />
        </div>
      </section>
    </>
  );
}
