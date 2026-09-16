import Image from "next/image";
import { Blocks, PanelsTopLeft } from "lucide-react";

const logos: Record<string, string[]> = {
  HTML: ["html"],
  CSS: ["css"],
  PHP: ["php"],
  Golang: ["go"],
  PostgreSQL: ["postgresql"],
  Python: ["python"],
  "Next.js": ["nextjs"],
  TypeScript: ["typescript"],
  "Tailwind CSS": ["tailwindcss"],
  Solidity: ["solidity"],
  ConvexDB: ["convex"],
  "HTML/CSS (Intermediate)": ["html", "css"],
  "JavaScript, Java, and C++ (Basic)": ["javascript", "java", "cplusplus"],
  "React JS (Basic)": ["react"],
  "Next.js (Basic)": ["nextjs"],
  "PHP (Basic)": ["php"],
  "Python (Basic)": ["python"],
  "WordPress (Basic)": ["wordpress"],
  "UI/UX Designing (Figma)": ["figma"],
};

export function TechnologyLabel({ name }: { name: string }) {
  return (
    <span className="technology-label">
      {logos[name] && (
        <span className="technology-logos" aria-hidden="true">
          {logos[name].map((logo) => (
            <Image
              key={logo}
              src={`/technologies/${logo}.svg`}
              alt=""
              width={20}
              height={20}
              className={`technology-logo technology-logo-${logo}`}
            />
          ))}
        </span>
      )}
      {name === "Web3" && <Blocks size={20} aria-hidden="true" />}
      {name === "Responsive UI" && (
        <PanelsTopLeft size={20} aria-hidden="true" />
      )}
      <span>{name}</span>
    </span>
  );
}
