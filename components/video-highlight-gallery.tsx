"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ViewportVideo } from "@/components/viewport-video";
import { PreviewDialog } from "@/components/preview-dialog";
import type { VideoItem } from "@/lib/data";

export function VideoHighlightGallery({ videos }: { videos: VideoItem[] }) {
  const [selected, setSelected] = useState<VideoItem | null>(null);
  return (
    <>
      <div className="film-gallery">
        {videos.map((video, index) => (
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
            <span className="film-caption">
              <span>{video.title}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </span>
          </article>
        ))}
      </div>
      {selected && (
        <PreviewDialog title={selected.title} onClose={() => setSelected(null)}>
          <video
            src={selected.src}
            poster={selected.poster}
            controls
            autoPlay
            playsInline
            className="film-player"
          />
        </PreviewDialog>
      )}
    </>
  );
}
