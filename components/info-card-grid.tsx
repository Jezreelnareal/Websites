import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Blocks,
  Clapperboard,
  Code2,
  Palette,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import type { InfoCard } from "@/lib/data";

type InfoCardGridProps = {
  cards: InfoCard[];
  columns?: "three" | "four";
  centered?: boolean;
};

const lucideIcons: Record<NonNullable<InfoCard["lucideIcon"]>, LucideIcon> = {
  "code-2": Code2,
  "shield-check": ShieldCheck,
  blocks: Blocks,
  clapperboard: Clapperboard,
  palette: Palette
};

export function InfoCardGrid({
  cards,
  columns = "three",
  centered = false
}: InfoCardGridProps) {
  const useBalancedRows = centered && columns === "three";
  const gridColumns =
    columns === "four"
      ? "lg:grid-cols-4"
      : "md:grid-cols-2 xl:grid-cols-3";
  const containerClass = useBalancedRows
    ? "flex flex-wrap justify-center gap-6"
    : `grid gap-6 ${gridColumns}`;
  const cardShellClass = useBalancedRows
    ? "h-full w-full md:w-[calc((100%_-_1.5rem)/2)] xl:w-[calc((100%_-_3rem)/3)]"
    : "h-full";

  return (
    <div className={containerClass}>
      {cards.map((card, cardIndex) => {
        const LucideCardIcon = card.lucideIcon
          ? lucideIcons[card.lucideIcon]
          : null;
        const revealDelay = `${Math.min(cardIndex, 5) * 70}ms`;

        const content = (
          <article className="group relative h-full min-h-[305px] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018))] p-8 backdrop-blur-md transition duration-300 hover:border-[#dac5a7]/35 hover:bg-white/[0.045] hover:shadow-[0_18px_60px_rgba(0,0,0,.34)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dac5a7]/45 to-transparent opacity-60 transition group-hover:opacity-100" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#dac5a7]/7 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />
            {LucideCardIcon ? (
              <div
                className={`mb-7 flex h-14 w-14 items-center justify-center border border-[#dac5a7]/20 bg-[#dac5a7]/[0.07] text-[#dac5a7] shadow-[inset_0_0_0_1px_rgba(255,255,255,.035)] transition duration-300 group-hover:border-[#dac5a7]/42 group-hover:bg-[#dac5a7]/[0.11] ${
                  centered ? "mx-auto" : ""
                }`}
              >
                <LucideCardIcon
                  aria-hidden="true"
                  className="h-6 w-6 transition duration-300 group-hover:scale-105"
                  strokeWidth={1.8}
                />
              </div>
            ) : card.icon ? (
              <img
                src={card.icon}
                alt=""
                className={`mb-7 h-10 w-10 opacity-80 ${centered ? "mx-auto" : ""}`}
              />
            ) : null}
            {card.number ? (
              <p className="mb-4 font-serif text-xs tracking-[0.24em] text-[#ededed]/45">
                {card.number}
              </p>
            ) : null}
            <h3
              className={`font-serif text-[22px] font-light text-[#dac5a7] ${
                centered ? "text-center" : "text-left"
              }`}
            >
              {card.title}
            </h3>
            <p
              className={`mt-4 text-sm leading-7 text-[#ededed]/65 ${
                centered ? "text-center" : "text-left"
              }`}
            >
              {card.description}
            </p>
            <div
              className={`mt-7 h-px w-10 bg-[#dac5a7]/20 transition duration-300 group-hover:w-16 group-hover:bg-[#dac5a7]/45 ${
                centered ? "mx-auto" : ""
              }`}
            />
          </article>
        );

        return card.href ? (
          <Link
            key={card.id}
            href={card.href}
            className={`block ${cardShellClass}`}
            data-scroll-reveal="item"
            data-hover-load="card"
            style={{ "--reveal-delay": revealDelay } as CSSProperties}
          >
            {content}
          </Link>
        ) : (
          <div
            key={card.id}
            className={cardShellClass}
            data-scroll-reveal="item"
            data-hover-load="card"
            style={{ "--reveal-delay": revealDelay } as CSSProperties}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
