"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  certificateLabel,
  certificates,
  type Certificate,
} from "@/lib/certificates";
import type { CertificateScene } from "@/lib/certificate-scene";

function StaticBadge({ certificate }: { certificate: Certificate }) {
  return (
    <div
      className={`chapter-static-badge ${certificate.theme === "aws-cloud-quest" ? "chapter-static-aws" : ""}`}
      data-theme={certificate.theme}
      aria-hidden="true"
    >
      {certificate.logoImage ? (
        <Image
          src={certificate.logoImage}
          alt=""
          width={certificate.theme === "python" ? 111 : 739}
          height={certificate.theme === "python" ? 135 : 415}
          className="chapter-static-logo"
        />
      ) : (
        <span>{certificate.monogram}</span>
      )}
      <small>
        {certificate.theme === "aws-cloud-quest"
          ? "CLOUD QUEST"
          : certificate.issuer}
      </small>
      <strong>{certificate.badgeLines.join(" ")}</strong>
      <small>{certificateLabel(certificate)}</small>
    </div>
  );
}

export function CertificateChapter({
  certificate,
  index,
  preview = false,
  summary,
}: {
  certificate: Certificate;
  index: number;
  preview?: boolean;
  summary?: string;
}) {
  const chapter = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<CertificateScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    const section = chapter.current;
    const frameElement = sticky.current;
    const element = host.current;
    if (!section || !frameElement || !element) return;
    let disposed = false;
    let requested = false;
    let inView = false;
    let animationFrame = 0;
    let currentProgress: number | null = null;
    let targetProgress = 0;
    let previousTime = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = (progress: number) => {
      section.style.setProperty(
        "--chapter-progress",
        String(preview ? 1 : progress),
      );
      scene.current?.setScrollProgress(progress);
    };
    const animate = (time: number) => {
      animationFrame = 0;
      if (!inView || disposed || document.hidden) return;
      const delta = Math.min(time - previousTime, 50);
      previousTime = time;
      const current = currentProgress ?? targetProgress;
      const next = motion.matches
        ? targetProgress
        : current + (targetProgress - current) * (1 - Math.exp(-delta / 95));
      const settled = Math.abs(targetProgress - next) < 0.0001;
      currentProgress = settled ? targetProgress : next;
      paint(currentProgress);
      if (!settled) animationFrame = requestAnimationFrame(animate);
    };
    const schedule = () => {
      if (!inView || disposed || document.hidden) return;
      const rect = section.getBoundingClientRect();
      const stickyStyle = getComputedStyle(frameElement);
      const top = parseFloat(stickyStyle.top) || 0;
      const travel = rect.height - frameElement.offsetHeight;
      const rawProgress =
        stickyStyle.position === "sticky"
          ? (top - rect.top) / Math.max(travel, 1)
          : (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);
      targetProgress =
        motion.matches || preview ? 0 : Math.max(0, Math.min(1, rawProgress));
      if (currentProgress === null || motion.matches) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        currentProgress = targetProgress;
        paint(currentProgress);
      } else if (!animationFrame && element.dataset.dragging !== "true") {
        previousTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
      }
    };
    // Direct manipulation takes over immediately; only scroll-driven motion eases.
    const interrupt = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      targetProgress = currentProgress ?? targetProgress;
    };
    const visibilityChange = () => {
      if (document.hidden) interrupt();
      else schedule();
    };
    const loadScene = async () => {
      if (requested) return;
      requested = true;
      try {
        const { createCertificateScene } =
          await import("@/lib/certificate-scene");
        if (disposed) return;
        scene.current = createCertificateScene(element, certificate);
        await scene.current.ready;
        if (disposed) return;
        paint(currentProgress ?? targetProgress);
        setStatus("ready");
        schedule();
      } catch {
        if (!disposed) setStatus("fallback");
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          void loadScene();
          schedule();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(section);
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    resize.observe(frameElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", visibilityChange);
    element.addEventListener("pointerdown", interrupt);
    element.addEventListener("keydown", interrupt);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", visibilityChange);
      element.removeEventListener("pointerdown", interrupt);
      element.removeEventListener("keydown", interrupt);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [certificate, preview]);

  return (
    <article
      ref={chapter}
      id={`certificate-${certificate.id}`}
      className={`certificate-chapter${preview ? " certificate-preview" : ""}`}
      data-theme={certificate.theme}
      style={{ "--chapter-accent": certificate.accent } as CSSProperties}
      aria-labelledby={`title-${certificate.id}`}
    >
      <div ref={sticky} className="certificate-chapter-sticky">
        {!preview && (
          <div className="chapter-topline page-width">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(certificates.length).padStart(2, "0")}
            </span>
            <h2 id={`title-${certificate.id}`}>
              {certificate.title} <span>/ {certificate.category}</span>
            </h2>
            <span>{certificate.year || certificateLabel(certificate)}</span>
          </div>
        )}
        <div className="chapter-stage">
          {!preview && (
            <div className="chapter-backdrop-title" aria-hidden="true">
              <span>{certificate.displayLines[0]}</span>
              <span>{certificate.displayLines[1]}</span>
            </div>
          )}
          <div className="chapter-light" aria-hidden="true" />
          <div className="chapter-shadow" aria-hidden="true" />
          {status === "fallback" && <StaticBadge certificate={certificate} />}
          <noscript>
            <StaticBadge certificate={certificate} />
          </noscript>
          <div
            ref={host}
            className="chapter-canvas"
            data-ready={status === "ready"}
            tabIndex={status === "ready" ? 0 : -1}
            role="group"
            aria-label={`${certificate.title} 3D badge. ${preview ? "Drag and release" : "Scroll to rotate, or drag and release"} to spin with momentum. Left and right arrow keys also rotate the badge.`}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                scene.current?.rotate(event.key === "ArrowLeft" ? -0.3 : 0.3);
              }
            }}
          />
          {!preview && (
            <span className="chapter-stage-note" aria-hidden="true">
              {certificate.issuer}
            </span>
          )}
        </div>
        {preview ? (
          <div className="certificate-preview-copy">
            <span className="eyebrow">
              {certificateLabel(certificate)} / {certificate.year}
            </span>
            <h3 id={`title-${certificate.id}`}>
              <Link href={`/certificates#certificate-${certificate.id}`}>
                {certificate.title}
                <ArrowUpRight size={20} />
              </Link>
            </h3>
            <p>{summary}</p>
          </div>
        ) : (
          <>
            <div className="chapter-description page-width">
              <div>
                <span className="eyebrow">What it is</span>
                <p>{certificate.description}</p>
              </div>
              <div>
                <span className="eyebrow">My contribution</span>
                <p>
                  {certificate.contribution ||
                    "My Cloud Quest contribution details will be added here."}
                </p>
              </div>
              <div className="chapter-record">
                <span className="chapter-record-label">
                  {certificateLabel(certificate)}
                </span>
                {certificate.documentUrl ? (
                  <a
                    href={certificate.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate <ArrowUpRight size={15} />
                  </a>
                ) : !certificate.verificationUrl ? (
                  <span>
                    {certificate.kind === "reference"
                      ? "Personal credential pending"
                      : "Certificate file pending"}
                  </span>
                ) : null}
                {certificate.verificationUrl && (
                  <a
                    href={certificate.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {certificate.kind === "badge"
                      ? "Verify badge"
                      : "Verify credential"}{" "}
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
            <div className="chapter-bottomline page-width">
              <span>{certificate.skills.join(" / ")}</span>
              <span className="chapter-scroll-cue">
                {index === certificates.length - 1
                  ? "Explore more below"
                  : "Keep scrolling"}
                <ArrowDown size={13} />
              </span>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export function CertificateShowcase() {
  return (
    <section
      id="certificates"
      className="certificate-journey"
      aria-labelledby="certificates-heading"
    >
      <header className="journey-header page-width">
        <div>
          <p className="eyebrow">The collection</p>
          <h1 id="certificates-heading">
            Certificates <em>&amp; milestones.</em>
          </h1>
        </div>
        <p>
          Scroll to turn the badges.
          <br />
          Explore the work behind each one.
        </p>
      </header>
      <nav
        className="journey-index page-width"
        aria-label="Jump to a certificate"
      >
        {certificates.map((certificate, index) => (
          <a key={certificate.id} href={`#certificate-${certificate.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {certificate.title}
            <ArrowUpRight size={14} />
          </a>
        ))}
      </nav>
      {certificates.map((certificate, index) => (
        <CertificateChapter
          key={certificate.id}
          certificate={certificate}
          index={index}
        />
      ))}
    </section>
  );
}
