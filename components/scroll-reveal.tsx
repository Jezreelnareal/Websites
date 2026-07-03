"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const READY_CLASS = "scroll-reveal-ready";
const VISIBLE_CLASS = "is-visible";
const REVEALED_CLASS = "has-revealed";
const REVEAL_SELECTOR = "[data-scroll-reveal]";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add(READY_CLASS);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        .forEach((element) => element.classList.add(VISIBLE_CLASS));
      return;
    }

    let observer: IntersectionObserver | undefined;
    const revealedTimers: number[] = [];

    const revealElement = (element: Element) => {
      element.classList.add(VISIBLE_CLASS);

      const timer = window.setTimeout(() => {
        element.classList.add(REVEALED_CLASS);
      }, 900);

      revealedTimers.push(timer);
    };

    const frame = window.requestAnimationFrame(() => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            revealElement(entry.target);
            observer?.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.12
        }
      );

      elements.forEach((element) => {
        element.classList.remove(VISIBLE_CLASS);
        element.classList.remove(REVEALED_CLASS);

        const rect = element.getBoundingClientRect();
        const isNearInitialViewport =
          rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

        if (isNearInitialViewport) {
          revealElement(element);
          return;
        }

        observer?.observe(element);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      revealedTimers.forEach((timer) => window.clearTimeout(timer));
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
