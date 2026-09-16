import { Plus } from "lucide-react";
import type { ResumeEntry } from "@/lib/data/portfolio";

export function ExperienceTimeline({
  entries,
  name,
}: {
  entries: ResumeEntry[];
  name: string;
}) {
  return (
    <div className="journey-stories">
      {entries.map((entry, index) => (
        <details
          key={entry.id}
          name={name}
          open={index === 0}
          className="journey-story"
        >
          <summary>
            <span className="story-year">{entry.period}</span>
            <span className="story-title">
              <span>{entry.subtitle || entry.title}</span>
              <small>{entry.title}</small>
            </span>
            <Plus size={22} aria-hidden="true" />
          </summary>
          <div className="story-body">
            {entry.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
