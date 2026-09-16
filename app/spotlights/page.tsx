import type { Metadata } from "next";
import { SpotlightProjects } from "@/components/projects/spotlight-projects";
import { VideoHighlightGallery } from "./_components/video-highlight-gallery";
import { GraphicGallery } from "./_components/graphic-gallery";
import { SpotlightNavigation } from "./_components/spotlight-navigation";
import { graphicImages, videoHighlights, webProjects } from "@/lib/data/portfolio";
import { createPageMetadata } from "@/lib/seo";
import "./spotlights.css";

export const metadata: Metadata = createPageMetadata({
  title: "Spotlights",
  description:
    "Websites, blockchain projects, product graphics, and short-form videos by Jezreel Borlongan.",
  path: "/spotlights",
});

export default function SpotlightsPage() {
  return (
    <div className="page-width work-page">
      <header className="page-intro spotlight-intro">
        <span className="eyebrow">Spotlights / Selected work</span>
        <h1 className="chapter-heading">
          <span>Code. Cut.</span>
          <em>Create.</em>
        </h1>
        <div className="spotlight-intro-note">
          <p>
            From working systems to visual stories. A closer look at the things
            I build, edit, and design.
          </p>
          <span className="eyebrow">Development / Motion / Design</span>
        </div>
      </header>
      <SpotlightNavigation>
        <a href="#web-development">
          Development
          <small>{String(webProjects.length).padStart(2, "0")}</small>
        </a>
        <a href="#video-editing">
          Motion
          <small>{String(videoHighlights.length).padStart(2, "0")}</small>
        </a>
        <a href="#graphics-editing">
          Graphics
          <small>{String(graphicImages.length).padStart(2, "0")}</small>
        </a>
      </SpotlightNavigation>
      <section
        id="web-development"
        className="work-category"
        aria-labelledby="development-title"
      >
        <div className="spotlight-section-heading">
          <div>
            <span className="eyebrow">01 / Development</span>
            <h2 id="development-title">
              Built to <em>work.</em>
            </h2>
          </div>
          <p>
            Websites, payment concepts, and systems. Open a video for a closer
            look at the project.
          </p>
        </div>
        <SpotlightProjects
          projects={[
            ...webProjects.filter((project) => project.title === "RemitSafe"),
            ...webProjects.filter((project) => project.title !== "RemitSafe"),
          ]}
        />
      </section>
      <section
        id="video-editing"
        className="work-category"
        aria-labelledby="motion-title"
      >
        <div className="spotlight-section-heading">
          <div>
            <span className="eyebrow">02 / Motion</span>
            <h2 id="motion-title">
              Made to <em>move.</em>
            </h2>
          </div>
          <p>
            Short-form edits, pacing, and visual storytelling. Select a film to
            watch it in full.
          </p>
        </div>
        <VideoHighlightGallery videos={videoHighlights} />
      </section>
      <section
        id="graphics-editing"
        className="work-category"
        aria-labelledby="graphics-title"
      >
        <div className="spotlight-section-heading">
          <div>
            <span className="eyebrow">03 / Graphics</span>
            <h2 id="graphics-title">
              An eye for <em>detail.</em>
            </h2>
          </div>
          <p>
            Product graphics for LNGR Thrift Shop and footwear campaigns. Select
            a piece to see the full design.
          </p>
        </div>
        <GraphicGallery images={graphicImages} />
      </section>
    </div>
  );
}
