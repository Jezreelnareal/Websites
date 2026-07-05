"use client";

import {
  useEffect,
  useRef,
  type VideoHTMLAttributes
} from "react";

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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        rootMargin: visibilityRootMargin,
        threshold: 0.15
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
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
