"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// A single, on-demand loop for the scenes after the hero and badge collection.
export function SceneMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion-scene]"),
    );
    const active = new Set<HTMLElement>();
    const progress = new WeakMap<HTMLElement, number>();
    let frame = 0;
    let lastTime = 0;
    let hovered: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerDirty = false;
    const resetPointer = () => {
      if (hovered) {
        hovered.style.removeProperty("--tilt-x");
        hovered.style.removeProperty("--tilt-y");
      }
      hovered = null;
      pointerDirty = false;
    };
    const paint = (time: number) => {
      frame = 0;
      if (motion.matches || document.hidden) return;
      const damping = 1 - Math.exp(-Math.min(time - lastTime, 50) / 110);
      lastTime = time;
      let moving = false;
      active.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (element.matches("#selected-work .project-feature")) {
          // Use the entire entrance/exit, including the sticky reading period.
          const viewportProgress =
            (innerHeight - rect.top) / (innerHeight + rect.height);
          element.style.setProperty(
            "--project-view-progress",
            String(Math.max(0, Math.min(1, viewportProgress))),
          );
        }
        const pin = element.querySelector<HTMLElement>("[data-scene-pin]");
        const pinned = pin && getComputedStyle(pin).position === "sticky";
        const raw = pinned
          ? (parseFloat(getComputedStyle(pin).top) - rect.top) /
            Math.max(1, rect.height - pin.offsetHeight)
          : (innerHeight - rect.top) / (innerHeight + rect.height);
        const target = Math.max(0, Math.min(1, raw));
        const current = progress.get(element) ?? target;
        const next = current + (target - current) * damping;
        const settled = Math.abs(next - target) < 0.001;
        progress.set(element, settled ? target : next);
        element.style.setProperty(
          "--scene-progress",
          String(settled ? target : next),
        );
        moving ||= !settled;
      });
      if (hovered && pointerDirty) {
        const rect = hovered.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
        hovered.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        hovered.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
        pointerDirty = false;
      }
      if (moving) frame = requestAnimationFrame(paint);
    };
    const schedule = () => {
      if (frame || motion.matches || document.hidden) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(element);
          else active.delete(element);
        });
        schedule();
      },
      { rootMargin: "100px" },
    );
    const resize = new ResizeObserver(schedule);
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      observer.disconnect();
      resize.disconnect();
      active.clear();
      resetPointer();
      scenes.forEach((element) => {
        if (motion.matches) element.style.removeProperty("--scene-progress");
        else {
          observer.observe(element);
          resize.observe(element);
        }
      });
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType === "touch")
        return;
      const target = (event.target as Element).closest<HTMLElement>(
        "[data-interactive-media]",
      );
      if (target !== hovered) {
        resetPointer();
        hovered = target;
      }
      if (!hovered) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerDirty = true;
      schedule();
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) resetPointer();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        resetPointer();
      } else schedule();
    };
    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", resetPointer);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      resetPointer();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", resetPointer);
    };
  }, [pathname]);
  return null;
}
