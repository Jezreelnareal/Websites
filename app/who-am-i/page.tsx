import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { InfoCardGrid } from "@/components/info-card-grid";
import { SubHero } from "@/components/sub-hero";
import {
  contactInfo,
  experienceEntries,
  personalDetails,
  portraitImage,
  projectEntries,
  services,
  skills
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Who Am I?"
};

const visibleDetails = personalDetails.filter(([label]) =>
  ["Birthday", "Phone", "Email", "From", "Freelance"].includes(label)
);

const stats = [
  { value: `${skills.length}`, label: "Core Skills" },
  { value: `${projectEntries.length}`, label: "Selected Projects" },
  {
    value: `${experienceEntries.filter(({ id }) =>
      ["trend-micro", "icpep-python"].includes(id)
    ).length}`,
    label: "Competitions"
  }
];

type ExperienceEntry = (typeof experienceEntries)[number];
type ProjectEntry = (typeof projectEntries)[number];

type RelatedProofRow = {
  experience: ExperienceEntry;
  project: ProjectEntry;
  label: string;
  techStack: string[];
};

const findExperience = (id: string) =>
  experienceEntries.find((experience) => experience.id === id);

const findProject = (id: string) =>
  projectEntries.find((project) => project.id === id);

const relatedProofRows = [
  {
    experience: findExperience("dvcode-intern"),
    project: findProject("booklify"),
    label: "Internship build",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "ConvexDB"]
  },
  {
    experience: findExperience("morph-hackathon"),
    project: findProject("remitsafe"),
    label: "Hackathon build",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Solidity", "Web3"]
  },
  {
    experience: findExperience("thesis-v-chain"),
    project: findProject("v-chain"),
    label: "Thesis build",
    techStack: ["Golang", "PostgreSQL", "Python", "HTML", "CSS", "Vercel"]
  },
  {
    experience: findExperience("school-dyh-website"),
    project: findProject("dyh-website"),
    label: "School project",
    techStack: ["HTML", "CSS", "PHP"]
  },
  {
    experience: findExperience("school-am-closet"),
    project: findProject("am-closet"),
    label: "School project",
    techStack: ["PHP", "HTML", "CSS"]
  }
].filter(
  (row): row is RelatedProofRow =>
    Boolean(row.experience) && Boolean(row.project)
);

const additionalExperience = [
  findExperience("trend-micro"),
  findExperience("icpep-python")
].filter((entry): entry is ExperienceEntry => Boolean(entry));

const additionalExperienceMeta: Record<
  string,
  { label: string; note: string }
> = {
  "trend-micro": {
    label: "Competition",
    note: "Cybersecurity"
  },
  "icpep-python": {
    label: "Competition",
    note: "Python"
  }
};

const workingStackGroups = [
  {
    title: "Frontend",
    description: "Responsive interfaces, portfolio pages, and application UI.",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML", "CSS"]
  },
  {
    title: "Backend & Data",
    description: "Server-side logic, data storage, and app foundations.",
    items: ["PHP", "Golang", "Python", "PostgreSQL", "ConvexDB"]
  },
  {
    title: "Blockchain",
    description: "Smart contract concepts and Web3 project workflows.",
    items: ["Solidity", "Web3", "Smart Contracts"]
  },
  {
    title: "Creative Tools",
    description: "Visual support for content, branding, and presentation.",
    items: ["Figma", "Video Editing", "Graphics Editing", "Microsoft Office"]
  },
  {
    title: "Professional Workflow",
    description: "Collaboration habits used across school, internship, and client work.",
    items: [
      "Teamwork",
      "Time Management",
      "Communication",
      "Critical Thinking",
      "Adaptability"
    ]
  }
];

export default function WhoAmIPage() {
  return (
    <>
      <SubHero label="Who Am I?" />

      <section
        className="relative my-20 flex items-center justify-center px-6 py-16 sm:my-32"
        data-scroll-reveal="section"
      >
        <div className="absolute inset-y-0 left-1/2 hidden w-[72%] -translate-x-1/2 border border-[#dac5a7]/20 bg-white/[0.02] backdrop-blur-xl lg:block" />
        <div className="absolute inset-y-0 left-1/2 hidden w-[72%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_0%_100%,rgba(218,197,167,.05)_0%,transparent_60%)] lg:block" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(280px,560px)_1fr] lg:gap-16">
          <div className="overflow-hidden">
            <img
              src={portraitImage}
              alt="Jezreel Borlongan"
              className="h-[380px] w-full object-cover brightness-90 sm:h-[560px] lg:h-[760px]"
            />
          </div>

          <div className="max-w-2xl text-left">
            <h1 className="font-serif text-4xl font-light leading-tight text-[#dac5a7] sm:text-[42px]">
              Hi There, I&apos;m Jezreel!
            </h1>
            <h2 className="mt-3 font-serif text-2xl font-light text-[#dac5a7]">
              Web Designer and Developer
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-8 text-[#ededed]/65">
              Focused on web development, I create clean, responsive, and
              user-friendly interfaces with HTML, CSS, JavaScript, React, and
              Next.js. I also work on system-based projects, smart contract
              concepts, graphics, and short-form video content.
            </p>

            <div className="mt-8 max-w-xl border-y border-white/10 py-7">
              <dl className="grid gap-x-7 gap-y-4 text-sm sm:grid-cols-[130px_1fr]">
                {visibleDetails.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="font-semibold text-[#ededed]/90">
                      {label}:
                    </dt>
                    <dd className="text-[#ededed]/65">
                      {label === "Phone" ? (
                        <a
                          href={contactInfo.phoneHref}
                          className="text-[#dac5a7] transition"
                          data-hover-load="text"
                        >
                          {value}
                        </a>
                      ) : label === "Email" ? (
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-[#dac5a7] transition"
                          data-hover-load="text"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/spotlights"
                className="inline-flex border border-[#dac5a7]/35 bg-[#dac5a7]/[0.07] px-8 py-3.5 text-xs uppercase tracking-[0.16em] text-[#dac5a7] transition hover:-translate-y-0.5 hover:border-[#dac5a7]/60 hover:bg-[#dac5a7]/[0.14]"
                data-hover-load="button"
              >
                View Projects
              </Link>
              <Link
                href="/lets-talk"
                className="inline-flex border border-white/10 bg-white/[0.03] px-8 py-3.5 text-xs uppercase tracking-[0.16em] text-[#ededed]/75 transition hover:border-[#dac5a7]/35 hover:text-[#dac5a7]"
                data-hover-load="button"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1400px] px-6 py-16 text-center sm:px-10"
        data-scroll-reveal="section"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/60">
          What I Do
        </span>
        <h2 className="mt-4 font-serif text-4xl font-light text-[#dac5a7]">
          Services
        </h2>
        <div className="mt-12">
          <InfoCardGrid cards={services} centered />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10" data-scroll-reveal="section">
        <div className="expertise-reveal mx-auto flex max-w-6xl flex-col gap-10 border-y border-[#dac5a7]/12 py-12 sm:py-14 lg:flex-row lg:gap-0">
          <div className="flex-1 lg:pr-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/65">
              Expertise
            </span>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-[#dac5a7]">
              Skills &amp; Proficiency
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#ededed]/65">
              From front-end interfaces to backend logic, blockchain projects,
              and creative media, these are the skills I have built through
              projects, competitions, internship work, and continuous practice.
            </p>

            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((stat, statIndex) => (
                <div
                  key={stat.label}
                  className="motion-fade-up"
                  style={{ animationDelay: `${statIndex * 90 + 180}ms` }}
                >
                  <p className="font-serif text-3xl font-light text-[#dac5a7]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-[#ededed]/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#dac5a7]/20 lg:mx-14 lg:h-auto lg:w-px" />

          <div className="flex-1 space-y-7">
            {skills.map((skill, skillIndex) => (
              <div
                key={skill.name}
                className="motion-fade-up group"
                style={{ animationDelay: `${skillIndex * 95 + 420}ms` }}
              >
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <span className="text-sm text-[#ededed]/80 transition-colors duration-300 group-hover:text-[#ededed]">
                    {skill.name}
                  </span>
                  <span className="font-serif text-sm text-[#dac5a7] transition-colors duration-300 group-hover:text-[#f1dcc0]">
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label={`${skill.name} proficiency`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.level}
                >
                  <div
                    className="skill-fill h-full rounded-full bg-gradient-to-r from-[#8a7055] via-[#b89d7a] to-[#dac5a7] shadow-[0_0_10px_rgba(218,197,167,.25)] transition-[filter] duration-300 group-hover:brightness-125"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-scroll-reveal="section">
        <div className="relative overflow-hidden border-y border-[#dac5a7]/10 py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dac5a7]/25 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#dac5a7]/10 to-transparent" />

          <div className="relative mx-auto max-w-[1280px] px-6 sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,0.92fr)] lg:gap-0">
              <div className="lg:pr-6">
                <div className="flex items-start gap-4">
                  <span className="mt-4 font-serif text-sm text-[#dac5a7]/55">
                    01
                  </span>
                  <div>
                    <h2 className="mt-3 font-serif text-4xl font-light text-[#dac5a7]">
                      Experience
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#ededed]/65">
                      A focused view of the most relevant CV experience for
                      web, blockchain, and digital content work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block" />

              <div className="lg:pl-6">
                <div className="flex items-start gap-4">
                  <span className="mt-4 font-serif text-sm text-[#dac5a7]/55">
                    02
                  </span>
                  <div>
                    <h2 className="mt-3 font-serif text-4xl font-light text-[#dac5a7]">
                      Projects
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#ededed]/58">
                      The matching build that came directly from the experience
                      on the same row.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6">
              {relatedProofRows.map((row, rowIndex) => (
                <div
                  key={`${row.experience.id}-${row.project.id}`}
                  className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,0.92fr)] lg:items-stretch lg:gap-0"
                  data-scroll-reveal="item"
                  style={
                    {
                      "--reveal-delay": `${Math.min(rowIndex, 4) * 80}ms`
                    } as CSSProperties
                  }
                >
                  <article
                    className="h-full border border-[#dac5a7]/22 bg-[#dac5a7]/[0.04] p-6 backdrop-blur-md transition hover:border-[#dac5a7]/35"
                    data-hover-load="card"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      {row.experience.period ? (
                        <p className="font-serif text-lg text-[#dac5a7]">
                          {row.experience.period}
                        </p>
                      ) : null}
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[#ededed]/35">
                        Experience
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-light text-[#dac5a7]">
                      {row.experience.title}
                    </h3>
                    {row.experience.subtitle ? (
                      <p className="mt-2 text-sm text-[#ededed]/75">
                        {row.experience.subtitle}
                      </p>
                    ) : null}
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-[#ededed]/62">
                      {row.experience.description.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>

                  <div className="flex items-center gap-3 px-5 text-xs uppercase tracking-[0.18em] text-[#dac5a7]/55 lg:hidden">
                    <span className="h-px flex-1 bg-[#dac5a7]/25" />
                    <span>{row.label}</span>
                    <span className="h-px flex-1 bg-[#dac5a7]/25" />
                  </div>

                  <div className="relative hidden min-h-[220px] items-center justify-center lg:flex">
                    <div className="absolute inset-y-[-24px] w-px bg-gradient-to-b from-transparent via-[#dac5a7]/28 to-transparent" />
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-[#dac5a7]/8 via-[#dac5a7]/70 to-[#dac5a7]/8" />
                    <span className="relative z-10 h-3 w-3 border border-[#dac5a7]/55 bg-[#0f1010] shadow-[0_0_14px_rgba(218,197,167,.18)]" />
                  </div>

                  <article
                    className="h-full border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#dac5a7]/30 hover:bg-white/[0.04]"
                    data-hover-load="card"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[#dac5a7]/55">
                        {row.label}
                      </span>
                      <span className="font-serif text-sm text-[#dac5a7]/45">
                        Project
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-light text-[#dac5a7]">
                      {row.project.title}
                    </h3>
                    {row.project.subtitle ? (
                      <p className="mt-2 text-sm text-[#ededed]/65">
                        {row.project.subtitle}
                      </p>
                    ) : null}
                    <p className="mt-5 text-sm leading-7 text-[#ededed]/55">
                      {row.project.description[0]}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-[#dac5a7]/12 pt-4">
                      {row.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-[#dac5a7]/12 bg-[#ededed]/[0.04] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-[#dac5a7]/10 pt-10">
              <div className="flex flex-col gap-8">
                <div className="max-w-2xl">
                  <h3 className="mt-4 font-serif text-3xl font-light text-[#dac5a7]">
                    Awards &amp; Recognitions
                  </h3>
                  <p className="mt-4 max-w-m text-sm leading-7 text-[#ededed]/55">
                    Competitions that strengthened my problem-solving,
                    technical thinking, and ability to work under pressure.
                  </p>
                </div>

                <div className="divide-y divide-white/10 border-y border-white/10">
                  {additionalExperience.map((entry, entryIndex) => {
                    const meta = additionalExperienceMeta[entry.id];

                    return (
                      <article
                        key={entry.id}
                        className="grid gap-5 py-6 pl-3 transition hover:bg-white/[0.015] sm:pl-5 md:grid-cols-[0.82fr_1.18fr] md:gap-8"
                        data-scroll-reveal="item"
                        data-hover-load="soft"
                        style={
                          {
                            "--reveal-delay": `${entryIndex * 80}ms`
                          } as CSSProperties
                        }
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[11px] uppercase tracking-[0.16em] text-[#dac5a7]/65">
                              {meta?.label ?? "Experience"}
                            </span>
                            {meta?.note ? (
                              <span className="text-xs text-[#ededed]/42">
                                {meta.note}
                              </span>
                            ) : null}
                          </div>
                          <h4 className="mt-4 font-serif text-[22px] font-light leading-tight text-[#dac5a7]">
                            {entry.title}
                          </h4>
                          <p className="mt-2 text-sm text-[#ededed]/65">
                            {entry.subtitle}
                          </p>
                        </div>

                        <ul className="space-y-3 text-sm leading-6 text-[#ededed]/55">
                          {entry.description.slice(0, 2).map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 h-1 w-1 flex-none bg-[#dac5a7]/60" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1280px] px-6 pb-24 sm:px-10"
        data-scroll-reveal="section"
      >
        <div className="border-t border-[#dac5a7]/12 pt-14">
          <div className="grid gap-12 lg:grid-cols-[0.36fr_1fr]">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#dac5a7]/55">
                Working Stack
              </span>
              <h2 className="mt-4 font-serif text-4xl font-light text-[#dac5a7]">
                Tools &amp; Background
              </h2>
              <p className="mt-5 max-w-md text-sm leading-8 text-[#ededed]/62">
                The tools I reach for across web apps, school systems,
                blockchain experiments, and creative production.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {workingStackGroups.map((group, groupIndex) => (
                <article
                  key={group.title}
                  className="pt-5 transition"
                  data-scroll-reveal="item"
                  data-hover-load="card"
                  style={
                    {
                      "--reveal-delay": `${Math.min(groupIndex, 5) * 70}ms`
                    } as CSSProperties
                  }
                >
                  <div className="h-px w-12 bg-[#dac5a7]/45" />
                  <h3 className="mt-5 font-serif text-2xl font-light text-[#dac5a7]">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#ededed]/55">
                    {group.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="border border-[#dac5a7]/12 bg-[#ededed]/[0.055] px-2.5 py-1 text-xs leading-none text-[#ededed]/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
