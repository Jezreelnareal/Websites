import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightProjects } from "@/components/spotlight-projects";
import { SubHero } from "@/components/sub-hero";
import { graphicImages, videoHighlights, webProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Spotlights"
};

export default function SpotlightsPage() {
  return (
    <>
      <SubHero label="Spotlights" />

      <section className="px-6 py-24" data-scroll-reveal="section">
        <SectionHeading
          title="Graphics Editing Highlights"
          description="Explore a collection of visual projects that demonstrate branding, layout, and graphics editing work."
        />
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {graphicImages.map((image, imageIndex) => (
            <article
              key={image.src}
              className="aspect-square overflow-hidden border border-white/10 bg-[#464646]/10"
              data-scroll-reveal="item"
              data-hover-load="media"
              style={
                {
                  "--reveal-delay": `${Math.min(imageIndex, 8) * 55}ms`
                } as CSSProperties
              }
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-24" data-scroll-reveal="section">
        <SectionHeading
          title="Video Editing Highlights"
          description="A selection of short videos that show pacing, visual storytelling, and promotional editing work."
        />
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {videoHighlights.map((video, videoIndex) => (
            <article
              key={video.src}
              className="aspect-[365/570] overflow-hidden border border-white/10 bg-black"
              data-scroll-reveal="item"
              data-hover-load="media"
              style={
                {
                  "--reveal-delay": `${Math.min(videoIndex, 5) * 70}ms`
                } as CSSProperties
              }
            >
              <video
                src={video.src}
                title={video.title}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-24" data-scroll-reveal="section">
        <SectionHeading
          title="Web Development Highlights"
          description="Interface previews paired with the purpose, stack, and development direction behind each build."
        />
        <div className="mt-16">
          <SpotlightProjects projects={webProjects} />
        </div>
      </section>
    </>
  );
}
