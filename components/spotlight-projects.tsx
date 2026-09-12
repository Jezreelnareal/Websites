"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { PreviewDialog } from "@/components/preview-dialog";
import { ViewportVideo } from "@/components/viewport-video";
import { TechnologyLabel } from "@/components/technology-label";
import type { WebProject } from "@/lib/data";

export function SpotlightProjects({
  projects,
  compact = false,
}: {
  projects: WebProject[];
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<WebProject | null>(null);
  return (
    <>
      <div
        className={`project-collection ${compact ? "project-collection-compact" : ""}`}
      >
        {projects.map((project, index) => (
          <article
            key={project.title}
            className={project.video ? "project-feature" : "project-text-entry"}
            data-project={project.stageTitle}
            data-motion-scene={compact && project.video ? "" : undefined}
          >
            <div
              className="project-presentation"
              data-scene-pin={compact && project.video ? "" : undefined}
            >
              {project.video && (
                <div className={`project-media project-media-${index % 2}`}>
                  <span className="project-backdrop" aria-hidden="true">
                    {project.stageTitle ||
                      project.displayTitle ||
                      project.title}
                  </span>
                  <button
                    type="button"
                    className="project-screen"
                    aria-label={`Open ${project.displayTitle || project.title}`}
                    onClick={() => setSelected(project)}
                  >
                    <ViewportVideo
                      src={project.video}
                      poster={project.poster}
                      preload="none"
                      muted
                      playsInline
                      loop
                      aria-hidden="true"
                    />
                  </button>
                  <span className="project-media-label">{project.label}</span>
                </div>
              )}
              <div className="project-caption">
                <div>
                  {project.video ? (
                    <h3 className="project-title">
                      {project.displayTitle || project.title}
                    </h3>
                  ) : (
                    <button
                      type="button"
                      className="project-title"
                      onClick={() => setSelected(project)}
                    >
                      {project.displayTitle || project.title}
                      <ArrowUpRight size={25} />
                    </button>
                  )}
                  <p>{project.shortInfo}</p>
                  <ul
                    className="project-stack technology-list"
                    aria-label="Project technologies"
                  >
                    {project.stack.slice(0, compact ? 3 : 5).map((tool) => (
                      <li key={tool}>
                        <TechnologyLabel name={tool} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <PreviewDialog
          title={selected.displayTitle || selected.title}
          className="project-dialog"
          eyebrow={selected.label}
          onClose={() => setSelected(null)}
        >
          {selected.video && (
            <video
              src={selected.video}
              poster={selected.poster}
              controls
              muted={selected.videoMuted ?? false}
              autoPlay
              playsInline
              aria-label={`${selected.displayTitle || selected.title} project video`}
              className="project-player"
            />
          )}
          {selected.poster && !selected.video && (
            <Image
              src={selected.poster}
              alt={selected.title}
              width={1440}
              height={900}
            />
          )}
          <div className="project-story">
            <div>
              <h3 className="eyebrow">The project</h3>
              <p className="project-overview">{selected.description}</p>
              <details className="project-details">
                <summary>
                  Behind the build <Plus size={17} aria-hidden="true" />
                </summary>
                {selected.longExplanation.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </details>
            </div>
            <aside className="project-tools" aria-label="Project tools">
              <h3 className="eyebrow">Built with</h3>
              <ul>
                {selected.stack.map((tool) => (
                  <li key={tool}>
                    <TechnologyLabel name={tool} />
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </PreviewDialog>
      )}
    </>
  );
}
