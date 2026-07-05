"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { ViewportVideo } from "@/components/viewport-video";
import type { VideoItem } from "@/lib/data";

type VideoHighlightGalleryProps = {
  videos: VideoItem[];
};

const DEFAULT_VIDEO_VOLUME = 0.5;

export function VideoHighlightGallery({ videos }: VideoHighlightGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedVideo = selectedIndex === null ? null : videos[selectedIndex];

  useEffect(() => {
    if (!selectedVideo) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  return (
    <>
      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {videos.map((video, videoIndex) => (
          <button
            key={video.src}
            type="button"
            onClick={() => setSelectedIndex(videoIndex)}
            className="group relative aspect-[365/570] overflow-hidden border border-white/10 bg-black text-left transition hover:border-[#dac5a7]/25 hover:shadow-[0_18px_50px_rgba(0,0,0,.35)]"
            data-scroll-reveal="item"
            data-hover-load="media"
            style={
              {
                "--reveal-delay": `${Math.min(videoIndex, 5) * 70}ms`
              } as CSSProperties
            }
            aria-label={`Open ${video.title} with audio controls`}
          >
            <ViewportVideo
              src={video.src}
              title={video.title}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition duration-300 group-hover:brightness-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 opacity-85" />
            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center border border-[#dac5a7]/30 bg-black/45 text-[#dac5a7] backdrop-blur-md transition group-hover:border-[#dac5a7]/60 group-hover:bg-[#dac5a7]/[0.12]">
              <Maximize2 aria-hidden="true" className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {selectedVideo && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-xl sm:px-6"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedIndex(null);
                }
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/10 bg-black/55 text-[#ededed]/80 backdrop-blur-md transition hover:border-[#dac5a7]/45 hover:bg-[#dac5a7]/[0.08] hover:text-[#dac5a7] sm:right-6 sm:top-6"
                aria-label="Close video modal"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>

              <video
                key={selectedVideo.src}
                src={selectedVideo.src}
                controls
                autoPlay
                playsInline
                onLoadedMetadata={(event) => {
                  event.currentTarget.volume = DEFAULT_VIDEO_VOLUME;
                }}
                className="max-h-[90vh] max-w-full bg-black object-contain shadow-[0_18px_50px_rgba(0,0,0,.35)]"
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
