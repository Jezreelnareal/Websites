"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/lib/data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let heroContent: HTMLElement | null = null;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      // Resolve the current DOM after route streaming, restored scroll positions,
      // and layout changes instead of retaining an earlier page's sections.
      const hero = document.querySelector<HTMLElement>(".classic-hero");
      heroContent =
        hero?.querySelector<HTMLElement>(".classic-hero-content") ?? null;
      const surfaces = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".certificate-highlights, .work-section, .creative-section, .home-journey, .work-category, .about-story, .resume-section, .certificates-page .certificate-chapter, .site-footer",
        ),
      );
      const sampleY = rect.bottom + 1;
      const overHero = Boolean(
        hero && hero.getBoundingClientRect().bottom > sampleY,
      );
      element.toggleAttribute("data-scrolled", window.scrollY > 0);
      element.toggleAttribute("data-over-hero", overHero);
      const surface = surfaces.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= sampleY && bounds.bottom > sampleY;
      });
      element.style.setProperty(
        "--nav-mask-bg",
        surface ? getComputedStyle(surface).backgroundColor : "var(--bg)",
      );
      if (heroContent) {
        const hiddenHeight = Math.max(
          0,
          rect.top - heroContent.getBoundingClientRect().top,
        );
        heroContent.style.clipPath = `inset(${hiddenHeight}px -100vmax 0)`;
      }
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
      heroContent?.style.removeProperty("clip-path");
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className="site-header"
      data-page={pathname}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <Link
        href="/"
        aria-label="Go to home"
        className="site-brand"
        onClick={() => setOpen(false)}
      >
        <Image
          src="/pics/nav-logo.png"
          alt="Jezreel Borlongan logo"
          width={42}
          height={49}
          priority
          className="h-9 w-auto object-contain"
        />
        <span className="nav-brand-name" aria-hidden="true">
          Jezreel <span>Borlongan</span>
        </span>
      </Link>
      <nav aria-label="Primary navigation" className="desktop-navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
            {link.href === "/lets-talk" && <ArrowUpRight size={13} />}
          </Link>
        ))}
      </nav>
      <button
        ref={menuButton}
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(!open)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-navigation"
        hidden={!open}
      >
        <p className="mobile-navigation-label">Explore the portfolio</p>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
    </header>
  );
}
