import type { ResumeEntry } from "@/lib/data";

type ResumeListProps = {
  entries: ResumeEntry[];
  compact?: boolean;
};

export function ResumeList({ entries, compact = false }: ResumeListProps) {
  return (
    <div className="grid gap-4">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className={`grid gap-5 border border-white/10 bg-white/[0.03] backdrop-blur-md transition hover:border-[#dac5a7]/30 hover:bg-white/[0.05] ${
            compact
              ? "p-5"
              : "p-6 md:grid-cols-[160px_1fr]"
          }`}
        >
          <div className="space-y-2">
            {entry.period ? (
              <p className="font-serif text-lg text-[#dac5a7]">{entry.period}</p>
            ) : null}
            {entry.location ? (
              <p className="text-sm leading-6 text-[#ededed]/55">{entry.location}</p>
            ) : null}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-light text-[#dac5a7]">
              {entry.title}
            </h3>
            {entry.subtitle ? (
              <p className="mt-2 text-sm text-[#ededed]/80">{entry.subtitle}</p>
            ) : null}
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#ededed]/65">
              {entry.description.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
