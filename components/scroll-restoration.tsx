"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_PREFIX = "jezreel-scroll";

const getScrollKey = () =>
  `${STORAGE_PREFIX}:${window.location.pathname}${window.location.search}`;

const getNavigationType = () => {
  const [navigation] = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];

  return navigation?.type;
};

export function ScrollRestoration() {
  const pathname = usePathname();
  const hasCheckedInitialLoad = useRef(false);

  useEffect(() => {
    if (!("scrollRestoration" in history)) {
      return;
    }

    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const shouldRestore =
      !hasCheckedInitialLoad.current &&
      !window.location.hash &&
      ["reload", "back_forward"].includes(getNavigationType() ?? "");

    hasCheckedInitialLoad.current = true;

    const restoreScroll = () => {
      const savedScroll = Number(sessionStorage.getItem(getScrollKey()));

      if (!Number.isFinite(savedScroll) || savedScroll <= 0) {
        return;
      }

      window.scrollTo({ top: savedScroll, behavior: "auto" });
    };

    const saveScroll = () => {
      sessionStorage.setItem(getScrollKey(), String(window.scrollY));
    };

    const animationFrame = shouldRestore
      ? window.requestAnimationFrame(restoreScroll)
      : undefined;
    const restoreTimers = shouldRestore
      ? [
          window.setTimeout(restoreScroll, 120),
          window.setTimeout(restoreScroll, 420)
        ]
      : [];

    window.addEventListener("scroll", saveScroll, { passive: true });
    window.addEventListener("pagehide", saveScroll);

    return () => {
      history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("scroll", saveScroll);
      window.removeEventListener("pagehide", saveScroll);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      restoreTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname]);

  return null;
}
