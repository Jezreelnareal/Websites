"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import styles from "./video-spotlight.module.css";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

// Aceternity UI Spotlight New by Manu Arora. Original beam geometry and animation.
// https://ui.aceternity.com/components/spotlight-new
export const VideoSpotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(var(--video-spotlight-hue, 210), 100%, 85%, .16) 0, hsla(var(--video-spotlight-hue, 210), 100%, 55%, .04) 50%, hsla(var(--video-spotlight-hue, 210), 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(var(--video-spotlight-hue, 210), 100%, 85%, .12) 0, hsla(var(--video-spotlight-hue, 210), 100%, 55%, .04) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(var(--video-spotlight-hue, 210), 100%, 85%, .08) 0, hsla(var(--video-spotlight-hue, 210), 100%, 45%, .04) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    const screen =
      element?.parentElement?.querySelector<HTMLElement>(".project-screen");
    if (!element || !header || !screen) return;

    let frame = 0;
    let previousCutoff = -1;
    let previousWidth = -1;
    let previousVisibility = "";
    const update = () => {
      frame = 0;
      // Fade the light before it meets the nav's opaque content mask.
      // Coordinates are local to this layer, so the fade follows sticky scrolling.
      const navBottom = header.getBoundingClientRect().bottom;
      const cutoff = Math.max(
        0,
        navBottom - element.getBoundingClientRect().top,
      );
      // Measure the video, not the oversized light layer: its overlap can enter
      // the viewport long before its own project does. Use layout height so the
      // scroll zoom does not feed back into this visibility calculation.
      const screenRect = screen.getBoundingClientRect();
      const center = screenRect.top + screenRect.height / 2;
      const height = screen.offsetHeight;
      const visibleHeight = Math.max(
        0,
        Math.min(innerHeight, center + height / 2) -
          Math.max(navBottom, center - height / 2),
      );
      const coverage =
        visibleHeight / Math.max(1, Math.min(height, innerHeight - navBottom));
      // A small mobile video can be fully visible at the very bottom while the
      // previous section is still the focus. Wait until it moves into the scene.
      const centerProgress =
        (center - navBottom) / Math.max(1, innerHeight - navBottom);
      const entrance = Math.max(
        0,
        Math.min(
          1,
          (coverage - 0.25) / 0.55,
          (0.82 - centerProgress) / 0.22,
          (centerProgress - 0.12) / 0.18,
        ),
      );
      const visibility = (entrance * entrance * (3 - 2 * entrance)).toFixed(4);
      // Exclude the browser scrollbar when spanning the full section width.
      const viewportWidth = document.documentElement.clientWidth;
      if (viewportWidth !== previousWidth) {
        element.style.setProperty(
          "--spotlight-viewport-width",
          `${viewportWidth}px`,
        );
        previousWidth = viewportWidth;
      }
      if (cutoff !== previousCutoff) {
        element.style.setProperty("--nav-cutoff", `${cutoff}px`);
        previousCutoff = cutoff;
      }
      if (visibility !== previousVisibility) {
        element.style.setProperty("--spotlight-visibility", visibility);
        previousVisibility = visibility;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    observer.observe(header);
    observer.observe(screen);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <motion.div
      ref={layer}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      aria-hidden="true"
      className={styles.spotlight}
    >
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0`}
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0`}
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
      </motion.div>
    </motion.div>
  );
};
