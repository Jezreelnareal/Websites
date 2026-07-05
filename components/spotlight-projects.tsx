"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { ViewportVideo } from "@/components/viewport-video";
import type { WebProject } from "@/lib/data";

type SpotlightProjectsProps = {
  projects: WebProject[];
};

const DEFAULT_VIDEO_VOLUME = 0.5;

export function SpotlightProjects({ projects }: SpotlightProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<WebProject | null>(null);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        {projects.map((project, projectIndex) => {
          const hasVideo = Boolean(project.video);

          return (
            <article
              key={project.title}
              className="group grid overflow-hidden border border-white/10 bg-[linear-gradient(135deg,rgba(218,197,167,.05),rgba(255,255,255,.018)_45%,rgba(14,15,15,.92))] shadow-[0_18px_45px_rgba(0,0,0,.2)] transition hover:border-[#dac5a7]/25 hover:shadow-[0_22px_65px_rgba(0,0,0,.28)]"
              data-scroll-reveal="item"
              style={
                {
                  "--reveal-delay": `${Math.min(projectIndex, 4) * 90}ms`
                } as CSSProperties
              }
            >
              <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                <div className="flex flex-col justify-between gap-8 border-b border-[#dac5a7]/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.24em] text-[#dac5a7]/55">
                        Web Preview
                      </span>
                      <span className="border border-[#dac5a7]/12 bg-[#dac5a7]/[0.06] px-2.5 py-1 text-xs text-[#ededed]/58">
                        {project.label}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-3xl font-light leading-tight text-[#dac5a7] sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 text-sm leading-8 text-[#ededed]/62">
                      {project.shortInfo}
                    </p>
                  </div>

                  <div className="border-t border-[#dac5a7]/12 pt-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#ededed]/36">
                      Tech Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="border border-[#dac5a7]/12 bg-[#ededed]/[0.045] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="relative min-h-[280px] overflow-hidden bg-black text-left lg:min-h-[420px]"
                  data-hover-load="media"
                  aria-label={`Open ${project.title}`}
                >
                  {hasVideo ? (
                    <ViewportVideo
                      src={project.video}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:brightness-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(218,197,167,.06),rgba(255,255,255,.018)_45%,rgba(0,0,0,.72))]">
                      <span className="border border-[#dac5a7]/15 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#ededed]/45">
                        Preview Pending
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/22" />
                  <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center border border-[#dac5a7]/30 bg-black/45 text-[#dac5a7] backdrop-blur-md transition group-hover:border-[#dac5a7]/60 group-hover:bg-[#dac5a7]/[0.12]">
                    <Maximize2 aria-hidden="true" className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedProject && typeof document !== "undefined"
        ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505] px-4 py-6 sm:px-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div className="relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden border border-[#dac5a7]/18 bg-[#0d0e0e] shadow-[0_32px_90px_rgba(0,0,0,.55)]">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-white/[0.025] px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.24em] text-[#dac5a7]/55">
                  Project Preview
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-2 truncate font-serif text-xl font-light leading-tight text-[#dac5a7] sm:text-2xl"
                >
                  {selectedProject.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-black/45 text-[#ededed]/80 backdrop-blur-md transition hover:border-[#dac5a7]/45 hover:bg-[#dac5a7]/[0.08] hover:text-[#dac5a7]"
                aria-label="Close project modal"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-[1.45fr_0.55fr]">
                <div className="flex min-h-[260px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(218,197,167,.08),transparent_46%),#030303] p-3 sm:p-5 lg:min-h-[520px]">
                  {selectedProject.video ? (
                    <video
                      src={selectedProject.video}
                      controls
                      autoPlay
                      playsInline
                      onLoadedMetadata={(event) => {
                        event.currentTarget.volume = DEFAULT_VIDEO_VOLUME;
                      }}
                      className="max-h-[62vh] w-full bg-black object-contain shadow-[0_18px_50px_rgba(0,0,0,.35)]"
                    />
                  ) : (
                    <div className="flex min-h-[280px] w-full items-center justify-center border border-white/10 bg-black/35">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#dac5a7]/55">
                          Video Empty
                        </p>
                        <p className="mt-3 text-sm text-[#ededed]/48">
                          Preview video will be added later.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="border-t border-white/10 p-5 sm:p-6 lg:border-l lg:border-t-0">
                  <span className="inline-flex border border-[#dac5a7]/15 bg-[#dac5a7]/[0.07] px-3 py-1 text-xs text-[#ededed]/65">
                    {selectedProject.label}
                  </span>

                  <h3 className="mt-6 text-xs uppercase tracking-[0.22em] text-[#dac5a7]/55">
                    Overview
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-[#ededed]/76">
                    {selectedProject.description}
                  </p>

                  <h3 className="mt-8 text-xs uppercase tracking-[0.22em] text-[#dac5a7]/55">
                    Tech Stack
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={item}
                        className="border border-[#dac5a7]/12 bg-[#ededed]/[0.045] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </aside>
              </div>

              <section className="border-t border-white/10 p-5 sm:p-7">
                <div className="max-w-4xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#dac5a7]/55">
                    Detailed Explanation
                  </p>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-[#ededed]/72 sm:text-base">
                    {selectedProject.longExplanation.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>,
            document.body
          )
        : null}
    </>
  );
}
