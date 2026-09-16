"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ViewportVideo } from "@/components/ui/viewport-video";
import { PreviewDialog } from "@/components/ui/preview-dialog";
import type { VideoItem } from "@/lib/data/portfolio";

export function VideoHighlightGallery({ videos }: { videos: VideoItem[] }) {
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const selectedIndex = videos.findIndex(
    (video) => video.src === selected?.src,
  );
  return (
    <>
      <div className="film-gallery">
        {videos.map((video) => (
          <article key={video.src}>
            <button
              className="film-frame"
              type="button"
              onClick={() => setSelected(video)}
              aria-label={`Play ${video.title}`}
            >
              <ViewportVideo
                src={video.src}
                poster={video.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />
              <span className="film-play">
                <Play size={18} fill="currentColor" />
              </span>
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <PreviewDialog
          title={selected.title}
          hideTitle
          eyebrow="Motion / Short-form"
          className="film-dialog"
          onClose={() => setSelected(null)}
          collection={{
            index: selectedIndex,
            total: videos.length,
            onPrevious: () =>
              setSelected(
                videos[(selectedIndex - 1 + videos.length) % videos.length],
              ),
            onNext: () =>
              setSelected(videos[(selectedIndex + 1) % videos.length]),
          }}
        >
          <video
            key={selected.src}
            src={selected.src}
            poster={selected.poster}
            controls
            autoPlay
            playsInline
            aria-label={selected.title}
            className="film-player"
          />
        </PreviewDialog>
      )}
    </>
  );
}
