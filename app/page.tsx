import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  BriefcaseBusiness,
  Clapperboard,
  Code2,
  ImageIcon,
  MonitorPlay,
  PanelsTopLeft
} from "lucide-react";
import { ContactPanel } from "@/components/contact-panel";
import { InfoCardGrid } from "@/components/info-card-grid";
import { ViewportVideo } from "@/components/viewport-video";
import {
  experienceEntries,
  graphicImages,
  heroBackdrop,
  homeHeroVideos,
  identityCards,
  projectEntries,
  videoHighlights,
  webProjects
} from "@/lib/data";

const resumePreview = [
  {
    label: "Experience",
    meta: `${experienceEntries[1].subtitle} | ${experienceEntries[1].period}`,
    title: experienceEntries[1].title,
    description:
      "Built responsive booking interfaces using Next.js, TypeScript, and Tailwind CSS."
  },
  {
    label: "Blockchain",
    meta: `${experienceEntries[0].subtitle} | ${experienceEntries[0].period}`,
    title: experienceEntries[0].title,
    description:
      "Worked on payment system concepts and smart contracts for trustless transactions."
  },
  {
    label: "Projects",
    meta: `${projectEntries[0].title} / ${projectEntries[1].title}`,
    title: "Web & Blockchain Builds",
    description:
      "Built project concepts for discounts, remittance, booking, and front-end client websites."
  }
];

const resumePreviewIcons = [BriefcaseBusiness, Blocks, PanelsTopLeft];

const cvHighlights = [
  { value: "2026", label: "Internship & thesis work" },
  { value: "5", label: "Selected project proofs" },
  { value: "3", label: "Core working areas" }
];

const cvSkillSets = [
  {
    label: "Frontend",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "React JS"]
  },
  {
    label: "Backend & Blockchain",
    items: ["Solidity", "PHP", "Python", "MySQL"]
  },
  {
    label: "Creative Tools",
    items: ["Figma", "Video Editing", "Graphics Editing"]
  }
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0e0f0f] px-6 text-center"
        data-scroll-reveal="hero"
      >
        <div className="absolute inset-0 grid grid-cols-2 opacity-25 md:grid-cols-4 md:opacity-35">
          {homeHeroVideos.map((video) => (
            <ViewportVideo
              key={video}
              src={video}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,15,15,.3)_0%,rgba(14,15,15,.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0e0f0f]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center py-40 sm:py-56">
          <h1 className="font-serif text-5xl font-light leading-none text-[#dac5a7] sm:text-6xl lg:text-[64px]">
            Web Designer
          </h1>
          <p className="mt-2 font-serif text-5xl font-light italic leading-none tracking-[0.03em] text-[#ededed] sm:text-6xl lg:text-[64px]">
            <span>&amp;</span> Developer
          </p>
          <p className="mt-7 max-w-[620px] text-sm leading-8 text-[#ededed]/70 sm:text-[15px]">
            Focused on front-end development, creating clean, responsive, and
            user-friendly websites using HTML, CSS, JavaScript, and modern web
            tools.
          </p>
          <Link
            href="/lets-talk"
            className="mt-10 border border-[#dac5a7]/40 bg-[#dac5a7]/[0.08] px-10 py-3.5 text-sm uppercase tracking-[0.18em] text-[#dac5a7] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#dac5a7]/70 hover:bg-[#dac5a7]/[0.15]"
            data-hover-load="button"
          >
            Let&apos;s Work Together
          </Link>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 xl:px-20"
        data-scroll-reveal="section"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/60">
          About Me
        </span>
        <Link
          href="/who-am-i"
          className="mt-4 inline-block transition"
          data-hover-load="text"
        >
          <h2 className="font-serif text-4xl font-light text-[#dac5a7]">
            Who am I?
          </h2>
        </Link>
        <div className="mt-12">
          <InfoCardGrid cards={identityCards} columns="four" />
        </div>
      </section>

      <section
        className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10 lg:px-16 xl:px-20"
        data-scroll-reveal="section"
      >
        <div className="relative overflow-hidden border-y border-[#dac5a7]/14 bg-[linear-gradient(135deg,rgba(218,197,167,.075),rgba(255,255,255,.018)_42%,rgba(14,15,15,.9))] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dac5a7]/35 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-[#dac5a7]/12 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/60">
                CV Snapshot
              </span>
              <h2 className="mt-4 max-w-lg font-serif text-4xl font-light leading-tight text-[#dac5a7] sm:text-[42px]">
                A faster read of my strongest work.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-[#ededed]/65">
                A compact view of the experience, projects, and tools that best
                represent my direction as a web and blockchain-focused
                developer.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {cvHighlights.map((highlight, highlightIndex) => (
                  <div
                    key={highlight.label}
                    className="border-t border-[#dac5a7]/18 pt-4"
                    data-scroll-reveal="item"
                    style={
                      {
                        "--reveal-delay": `${highlightIndex * 70}ms`
                      } as CSSProperties
                    }
                  >
                    <p className="font-serif text-3xl font-light text-[#dac5a7]">
                      {highlight.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[#ededed]/48">
                      {highlight.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/who-am-i"
                className="mt-9 inline-flex items-center gap-3 border border-[#dac5a7]/35 bg-[#dac5a7]/[0.07] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#dac5a7] transition hover:-translate-y-0.5 hover:border-[#dac5a7]/60 hover:bg-[#dac5a7]/[0.14]"
                data-hover-load="button"
              >
                <span>View Full Details</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-[#ededed]/40">
                    Proof Preview
                  </p>
                  <h3 className="mt-3 font-serif text-3xl font-light text-[#dac5a7]">
                    Experience tied to real builds.
                  </h3>
                </div>
                <p className="max-w-xs text-sm leading-7 text-[#ededed]/52 sm:text-right">
                  Each row highlights one part of my CV and the work direction
                  behind it.
                </p>
              </div>

              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                {resumePreview.map((item, itemIndex) => {
                  const PreviewIcon = resumePreviewIcons[itemIndex] ?? Code2;

                  return (
                    <article
                      key={item.title}
                      className="group grid gap-5 py-6 pl-3 transition hover:bg-white/[0.018] sm:pl-5 md:grid-cols-[240px_1fr]"
                      data-scroll-reveal="item"
                      data-hover-load="soft"
                      style={
                        {
                          "--reveal-delay": `${itemIndex * 80}ms`
                        } as CSSProperties
                      }
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 flex-none items-center justify-center border border-[#dac5a7]/20 bg-[#dac5a7]/[0.055] text-[#dac5a7] transition group-hover:border-[#dac5a7]/42 group-hover:bg-[#dac5a7]/[0.09]">
                          <PreviewIcon
                            aria-hidden="true"
                            className="h-5 w-5"
                            strokeWidth={1.8}
                          />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-[#dac5a7]/60">
                            {item.label}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-[#ededed]/42">
                            {item.meta}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-light text-[#dac5a7]">
                          {item.title}
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#ededed]/62">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#ededed]/40">
                    Working Tools
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                    {cvSkillSets.map((group, groupIndex) => (
                      <div
                        key={group.label}
                        data-scroll-reveal="item"
                        style={
                          {
                            "--reveal-delay": `${groupIndex * 70}ms`
                          } as CSSProperties
                        }
                      >
                        <p className="text-sm font-semibold text-[#dac5a7]/78">
                          {group.label}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="border border-[#dac5a7]/12 bg-[#ededed]/[0.045] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#ededed]/40">
                    Featured Projects
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {projectEntries.slice(0, 3).map((project) => (
                      <span
                        key={project.id}
                        className="border border-[#dac5a7]/14 bg-[#0e0f0f]/35 px-3 py-1.5 text-xs text-[#ededed]/72"
                      >
                        {project.title}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[#ededed]/52">
                    A quick path into the systems and interface work expanded
                    on the Who Am I page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative flex min-h-[440px] items-center justify-center overflow-hidden px-6 text-center"
        data-scroll-reveal="section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${heroBackdrop})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dac5a7]/[0.06] blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center gap-5 px-4">
          <span className="font-serif text-[120px] leading-[0.6] text-[#dac5a7]/25">
            &quot;
          </span>
          <p className="font-serif text-2xl font-light italic leading-[1.8] text-[#ededed]/90">
            <span className="text-[#dac5a7]">Engineering</span> is not just
            about building systems; it is about crafting solutions that shape
            the future of technology and humanity.
          </p>
          <div className="h-px w-10 bg-[#dac5a7]/50" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#dac5a7]/50">
            - Jezreel Borlongan -
          </span>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 xl:px-20"
        data-scroll-reveal="section"
      >
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/60">
              My Work
            </span>
            <Link
              href="/spotlights"
              className="mt-4 inline-block transition"
              data-hover-load="text"
            >
              <h2 className="font-serif text-4xl font-light text-[#dac5a7]">
                Spotlights
              </h2>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-8 text-[#ededed]/62">
              A curated preview of the creative and technical work expanded on
              the Spotlights page, from interface builds to short-form video
              edits and graphic design pieces.
            </p>

            <div className="mt-9 divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  title: "Web Development",
                  description: `${webProjects.length} project previews`,
                  icon: MonitorPlay,
                  href: "/spotlights#web-development"
                },
                {
                  title: "Video Editing",
                  description: `${videoHighlights.length} motion highlights`,
                  icon: Clapperboard,
                  href: "/spotlights#video-editing"
                },
                {
                  title: "Graphics Editing",
                  description: `${graphicImages.length} visual pieces`,
                  icon: ImageIcon,
                  href: "/spotlights#graphics-editing"
                }
              ].map((item, itemIndex) => {
                const SpotlightIcon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 py-5 transition hover:bg-white/[0.018]"
                    data-scroll-reveal="item"
                    data-hover-load="soft"
                    style={
                      {
                        "--reveal-delay": `${itemIndex * 75}ms`
                      } as CSSProperties
                    }
                  >
                    <span className="ml-3 flex h-11 w-11 flex-none items-center justify-center border border-[#dac5a7]/20 bg-[#dac5a7]/[0.055] text-[#dac5a7] transition group-hover:border-[#dac5a7]/42 group-hover:bg-[#dac5a7]/[0.09]">
                      <SpotlightIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-xl font-light text-[#dac5a7]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-[#ededed]/42">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/spotlights#web-development"
              className="mt-9 inline-flex items-center gap-3 border border-[#dac5a7]/35 bg-[#dac5a7]/[0.07] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#dac5a7] transition hover:-translate-y-0.5 hover:border-[#dac5a7]/60 hover:bg-[#dac5a7]/[0.14]"
              data-hover-load="button"
            >
              <span>Open Spotlights</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <Link
              href="/spotlights"
              className="group grid overflow-hidden border border-white/10 bg-[linear-gradient(135deg,rgba(218,197,167,.055),rgba(255,255,255,.018)_45%,rgba(14,15,15,.92))] shadow-[0_18px_45px_rgba(0,0,0,.2)] transition hover:border-[#dac5a7]/25 hover:shadow-[0_22px_65px_rgba(0,0,0,.28)] lg:grid-cols-[0.82fr_1.18fr]"
              data-scroll-reveal="item"
              data-hover-load="card"
            >
              <div className="flex flex-col justify-between gap-8 border-b border-[#dac5a7]/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.24em] text-[#dac5a7]/55">
                      Web Preview
                    </span>
                    <span className="border border-[#dac5a7]/12 bg-[#dac5a7]/[0.06] px-2.5 py-1 text-xs text-[#ededed]/58">
                      {webProjects[0].label}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl font-light leading-tight text-[#dac5a7] sm:text-4xl">
                    {webProjects[0].title}
                  </h3>
                  <p className="mt-5 text-sm leading-8 text-[#ededed]/62">
                    {webProjects[0].shortInfo}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {webProjects[0].stack.map((item) => (
                      <span
                        key={item}
                        className="border border-[#dac5a7]/12 bg-[#ededed]/[0.045] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#dac5a7]/75 transition group-hover:text-[#dac5a7]">
                  View full preview
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>

              <div className="relative min-h-[300px] overflow-hidden bg-black lg:min-h-[430px]">
                {webProjects[0].video ? (
                  <ViewportVideo
                    src={webProjects[0].video}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:brightness-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(218,197,167,.06),rgba(255,255,255,.018)_45%,rgba(0,0,0,.72))]">
                    <span className="border border-[#dac5a7]/15 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#ededed]/45">
                      Preview Pending
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/22" />
                <div className="absolute left-5 top-5 border border-white/10 bg-black/45 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#ededed]/72 backdrop-blur-md">
                  Interface Preview
                </div>
              </div>
            </Link>

            <div className="grid gap-6 xl:grid-cols-2">
              <Link
                href="/spotlights#video-editing"
                className="group overflow-hidden border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#dac5a7]/25 hover:bg-white/[0.035]"
                data-scroll-reveal="item"
                data-hover-load="card"
                style={{ "--reveal-delay": "90ms" } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#dac5a7]/55">
                      Video Editing
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-light text-[#dac5a7]">
                      Motion highlights with pacing and rhythm.
                    </h3>
                  </div>
                  <Clapperboard
                    aria-hidden="true"
                    className="h-5 w-5 text-[#dac5a7]/55"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {videoHighlights.slice(0, 3).map((video) => (
                    <div
                      key={video.src}
                      className="aspect-[9/13] overflow-hidden bg-black"
                    >
                      <ViewportVideo
                        src={video.src}
                        title={video.title}
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover transition duration-300 group-hover:brightness-110"
                      />
                    </div>
                  ))}
                </div>
              </Link>

              <Link
                href="/spotlights#graphics-editing"
                className="group overflow-hidden border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#dac5a7]/25 hover:bg-white/[0.035]"
                data-scroll-reveal="item"
                data-hover-load="card"
                style={{ "--reveal-delay": "160ms" } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#dac5a7]/55">
                      Graphics Editing
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-light text-[#dac5a7]">
                      Visual pieces for branding and presentation.
                    </h3>
                  </div>
                  <ImageIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-[#dac5a7]/55"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {graphicImages.slice(0, 4).map((image) => (
                    <div
                      key={image.src}
                      className="aspect-square overflow-hidden bg-[#141515] bg-cover bg-center transition duration-300 group-hover:brightness-110"
                      style={{ backgroundImage: `url(${image.src})` }}
                      role="img"
                      aria-label={image.alt}
                    />
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactPanel title="Let&apos;s Talk About Your Project">
        <p>
          Ready to bring your ideas to life? I would love to hear from you.
          Whether you are looking to develop a new website, enhance your brand
          with stunning graphics, or create engaging video content, we can talk
          through how to achieve your goals.
        </p>
        <p>
          Click the button below to schedule a convenient time for us to chat
          about your project. I am excited to explore how my skills and
          experience can contribute to your success.
        </p>
        <p>
          Feel free to reach out with any questions or ideas in the meantime.
          Looking forward to collaborating with you.
        </p>
      </ContactPanel>
    </>
  );
}
