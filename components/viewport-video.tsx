"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

type ViewportVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  playWhenVisible?: boolean;
  visibilityRootMargin?: string;
};

export function ViewportVideo({
  playWhenVisible = true,
  visibilityRootMargin = "160px",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "metadata",
  src,
  ...props
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsPlayback = playWhenVisible && Boolean(autoPlay);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !controlsPlayback) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const playVideo = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    const syncPlayback = () => {
      if (visible && !motion.matches && !document.hidden) playVideo();
      else pauseVideo();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      {
        rootMargin: visibilityRootMargin,
        threshold: 0.15,
      },
    );

    observer.observe(video);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      pauseVideo();
    };
  }, [controlsPlayback, src, visibilityRootMargin]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={controlsPlayback ? false : autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      {...props}
    />
  );
}
