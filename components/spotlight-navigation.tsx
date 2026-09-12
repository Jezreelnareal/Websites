"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SpotlightNavigation({ children }: { children: ReactNode }) {
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = navigation.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(element).top);
      element.toggleAttribute(
        "data-stuck",
        rect.top <= stickyTop + 1,
      );
      const sampleY = rect.bottom + 1;
      const surface = Array.from(
        document.querySelectorAll<HTMLElement>(".work-category, .site-footer"),
      ).find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= sampleY && bounds.bottom > sampleY;
      });
      element.style.setProperty(
        "--index-mask-bg",
        surface ? getComputedStyle(surface).backgroundColor : "var(--bg)",
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const main = document.getElementById("main-content");
    const contentObserver = new MutationObserver(schedule);
    const layoutObserver = new ResizeObserver(schedule);
    if (main) {
      contentObserver.observe(main, { childList: true, subtree: true });
      layoutObserver.observe(main);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      contentObserver.disconnect();
      layoutObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      ref={navigation}
      className="spotlight-index"
      aria-label="Work categories"
    >
      {children}
    </nav>
  );
}
