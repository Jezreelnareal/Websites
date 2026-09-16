import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ExperienceTimeline } from "@/components/ui/experience-timeline";
import { TechnologyLabel } from "@/components/ui/technology-label";
import {
  experienceEntries,
  educationEntries,
  portraitImage,
  contactInfo,
  skillGroups,
} from "@/lib/data/portfolio";
import { createPageMetadata } from "@/lib/seo";
import "./about.css";

export const metadata: Metadata = createPageMetadata({
  title: "Who Am I?",
  description:
    "Get to know Jezreel Borlongan: web development, computer engineering, blockchain projects, and visual work in Bulacan, Philippines.",
  path: "/who-am-i",
});

export default function WhoAmIPage() {
  return (
    <div className="page-width about-page">
      <header className="page-intro about-intro">
        <div className="about-intro-heading">
          <span className="eyebrow">Who am I? / Jezreel Borlongan</span>
          <h1 className="chapter-heading">
            <span>Behind</span>
            <em>the work.</em>
          </h1>
          <p className="about-intro-description">
            Web development, visual storytelling, and the curiosity that
            connects them.
          </p>
          <nav className="about-index" aria-label="About sections">
            <a href="#my-journey">
              My journey <ArrowUpRight size={15} />
            </a>
            <a href="#my-toolkit">
              My toolkit <ArrowUpRight size={15} />
            </a>
            <a href="#my-background">
              Background <ArrowUpRight size={15} />
            </a>
          </nav>
        </div>
        <figure className="about-intro-portrait">
          <div className="about-portrait">
            <Image
              src={portraitImage}
              alt="Jezreel Borlongan"
              fill
              priority
              sizes="(max-width: 767px) 90vw, 38vw"
            />
          </div>
          <figcaption>
            <span>Jezreel Borlongan</span>
            <span>Bulacan, PH</span>
          </figcaption>
        </figure>
      </header>
      <section className="about-story" aria-labelledby="about-introduction">
        <div className="about-statement">
          <span className="eyebrow">Hi, I&apos;m Jezreel.</span>
          <h2 id="about-introduction">
            I like making things
            <br />I can <em>put to use.</em>
          </h2>
          <Link href="/spotlights" className="text-link">
            See what I&apos;ve been making <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-story-copy">
          <p>
            My background is in computer engineering, and my work spans web
            development, blockchain projects, video editing, and graphic design.
          </p>
          <p>
            <strong>Less waiting. More doing.</strong> I focus on spotting
            software bottlenecks early and designing around them, from slow
            data flows to unnecessary steps. My aim is to build responsive
            systems that feel effortless to use, even as demands grow.
          </p>
          <p>
            That has meant building a booking system at DvCode, working on a
            remittance concept at the Morph Hackathon, and developing V-Chain
            for my thesis. On the creative side, I&apos;ve designed product
            graphics and shot and edited videos for LNGR Thrift Shop.
          </p>
          <p>
            I work with Next.js, TypeScript, HTML, CSS, and PHP, and explore
            Solidity and backend tools through my projects.
          </p>
          <dl className="about-facts">
            <div>
              <dt>Based in</dt>
              <dd>Balagtas, Bulacan, Philippines</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section
        id="my-journey"
        className="resume-section"
        aria-labelledby="journey-title"
      >
        <div className="resume-heading">
          <span className="eyebrow">Along the way</span>
          <h2 id="journey-title">
            Experience
            <br />
            <em>&amp; projects.</em>
          </h2>
          <p className="about-section-note">
            From shop campaigns to software systems. Open a chapter to see the
            work behind it.
          </p>
        </div>
        <ExperienceTimeline
          name="experience"
          entries={experienceEntries.filter(
            (entry) => !["trend-micro", "icpep-python"].includes(entry.id),
          )}
        />
      </section>
      <section
        id="my-toolkit"
        className="resume-section"
        aria-labelledby="toolkit-title"
      >
        <div className="resume-heading">
          <span className="eyebrow">My toolkit</span>
          <h2 id="toolkit-title">
            What I<br />
            <em>work with.</em>
          </h2>
          <p className="about-section-note">
            The languages, tools, and working habits I bring to a project.
          </p>
        </div>
        <div className="toolkit-list">
          {skillGroups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              {group.title === "Technical Skills" ? (
                <ul className="toolkit-technologies">
                  {group.items.map((item) => (
                    <li key={item}>
                      <TechnologyLabel name={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="about-skill-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
      <section
        id="my-background"
        className="resume-section"
        aria-labelledby="background-title"
      >
        <div className="resume-heading">
          <span className="eyebrow">Background</span>
          <h2 id="background-title">
            Learning,
            <br />
            <em>in practice.</em>
          </h2>
        </div>
        <div>
          <div className="education-list">
            {educationEntries.map((entry) => (
              <article key={entry.id}>
                <span className="experience-date">{entry.period}</span>
                <h3>{entry.subtitle}</h3>
                <p>{entry.title}</p>
                <span className="education-location">{entry.location}</span>
              </article>
            ))}
          </div>
          <div className="recognition-note">
            <h3>Competitions &amp; certificates</h3>
            <p>
              AWS Cloud Quest, Trend Micro uCTF, and the competitions that have
              been part of my journey.
            </p>
            <Link href="/certificates" className="text-link">
              Explore the badge collection <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
