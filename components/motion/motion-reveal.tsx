"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Animate content once as it arrives, without hiding it before JavaScript loads.
const targets = [
  ".journey-header",
  ".chapter-description > div",
  ".work-section > .section-topline",
  ".creative-copy",
  ".about-note > div",
  ".resume-section",
  ".page-intro-bottom",
  ".home-journey-entries",
  ".about-story-copy",
  ".footer-links",
  ".contact-layout",
].join(",");

export function MotionReveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || motion.matches || seen.has(entry.target))
            continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          const stagger = entry.target.parentElement?.classList.contains(
            "chapter-description",
          )
            ? Array.from(entry.target.parentElement.children).indexOf(
                entry.target,
              ) * 60
            : 0;
          const animation = entry.target.animate(
            [
              { opacity: 0.35, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 620,
              delay: stagger,
              fill: "backwards",
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" },
    );
    const sync = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (!motion.matches)
        document.querySelectorAll(targets).forEach((element) => {
          if (!seen.has(element)) observer.observe(element);
        });
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      motion.removeEventListener("change", sync);
    };
  }, [pathname]);
  return null;
}
