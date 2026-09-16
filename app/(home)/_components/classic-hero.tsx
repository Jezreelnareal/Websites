import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ViewportVideo } from "@/components/ui/viewport-video";
import { homeHeroVideos, videoHighlights } from "@/lib/data/portfolio";

export function ClassicHero() {
  return (
    <section className="classic-hero" aria-labelledby="home-title">
      <div className="classic-hero-videos" aria-hidden="true">
        {homeHeroVideos.map((video) => (
          <ViewportVideo
            key={video}
            src={video}
            poster={videoHighlights.find((item) => item.src === video)?.poster}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ))}
      </div>
      <div className="classic-hero-shade" aria-hidden="true" />
      <div className="classic-hero-content">
        <p className="classic-hero-introduction">
          Jezreel Borlongan / Portfolio
        </p>
        <h1 id="home-title">
          <span>Web Designer</span>
          <em className="classic-hero-role">&amp; Developer</em>
        </h1>
        <p className="classic-hero-description">
          I build thoughtful web experiences and bring ideas to life through
          code, design, and motion.
        </p>
        <div className="classic-hero-actions">
          <Link href="/spotlights" className="classic-hero-cta">
            Explore my work <ArrowUpRight size={18} />
          </Link>
          <Link href="/lets-talk" className="classic-hero-contact">
            Let&apos;s work together <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="classic-hero-bottom page-width">
        <span>Based in Bulacan, Philippines</span>
        <a href="#certificates" className="classic-hero-scroll">
          Discover the journey <ArrowDown size={14} aria-hidden="true" />
        </a>
        <span>Development / Design / Motion</span>
      </div>
    </section>
  );
}
