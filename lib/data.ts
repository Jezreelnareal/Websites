export type NavLink = {
  label: string;
  href: string;
};

export type InfoCard = {
  id: string;
  number?: string;
  title: string;
  description: string;
  icon?: string;
  lucideIcon?: "code-2" | "shield-check" | "blocks" | "clapperboard" | "palette";
  href?: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type VideoItem = {
  src: string;
  title: string;
};

export type WebProject = {
  title: string;
  description: string;
  longExplanation: string[];
  label: string;
  shortInfo: string;
  stack: string[];
  video?: string;
};

export type Skill = {
  name: string;
  level: number;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type ResumeEntry = {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  location?: string;
  description: string[];
};

export const contactInfo = {
  phone: "+63 969 199 8772",
  phoneHref: "tel:+639691998772",
  email: "jezreelborlongan7@gmail.com",
  location: "Panginay, Balagtas, Bulacan"
};

export const heroBackdrop = "/pics/71a916609bee65812de8af59bc872645.png";
export const homeHeroVideos = [
  "/videos/video_1785359545229126.mp4",
  "/videos/video_843989837082874.mp4",
  "/videos/8th(3).mp4",
  "/videos/skskskksks.mp4"
];
export const portraitImage = "/pics/Screenshot_20220610-140203.jpg";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Who Am I?", href: "/who-am-i" },
  { label: "Spotlights", href: "/spotlights" },
  { label: "Let's Talk", href: "/lets-talk" }
];

export const identityCards: InfoCard[] = [
  {
    id: "web-developer",
    number: "01",
    title: "Web Developer",
    description:
      "I build responsive, user-friendly websites using HTML, CSS, JavaScript, and modern tools with a focus on clean code and seamless experiences.",
    href: "/who-am-i"
  },
  {
    id: "backend-blockchain",
    number: "02",
    title: "Backend & Blockchain",
    description:
      "I work with business logic, security-minded systems, and blockchain concepts using Solidity and smart contract development.",
    href: "/who-am-i"
  },
  {
    id: "video-editor",
    number: "03",
    title: "Video Editor",
    description:
      "I create short-form advertising videos that combine pacing, story, and visual polish to help ideas land quickly.",
    href: "/who-am-i"
  },
  {
    id: "graphics-editor",
    number: "04",
    title: "Graphics Designer",
    description:
      "I design eye-catching visuals, branding materials, and social graphics that combine creativity, precision, and clear presentation.",
    href: "/who-am-i"
  }
];

export const spotlightCards: InfoCard[] = [
  {
    id: "video-editing-projects",
    title: "Video Editing Projects",
    description:
      "Explore short videos that highlight storytelling, pacing, and polished visual editing for promotional work.",
    icon: "https://img.icons8.com/?size=100&id=15003&format=png&color=ffffff",
    href: "/spotlights"
  },
  {
    id: "graphics-editing-highlights",
    title: "Graphics Editing Highlights",
    description:
      "View branding, logo, and visual design pieces that show practical creative direction and production skill.",
    icon: "https://img.icons8.com/?size=100&id=sXm12ie1GUjg&format=png&color=ffffff",
    href: "/spotlights"
  },
  {
    id: "web-development-highlights",
    title: "Web Development Highlights",
    description:
      "See responsive layouts and interface previews that combine technical structure with clean presentation.",
    icon: "https://img.icons8.com/?size=100&id=1106&format=png&color=ffffff",
    href: "/spotlights"
  }
];

export const services: InfoCard[] = [
  {
    id: "web-developing",
    title: "Web Developing",
    description:
      "Responsive websites built with clean structure, accessible interfaces, and a polished front-end experience.",
    lucideIcon: "code-2"
  },
  {
    id: "backend-security",
    title: "Backend & Security",
    description:
      "Business logic, safer workflows, and reliability improvements for systems that need stronger structure behind the interface.",
    lucideIcon: "shield-check"
  },
  {
    id: "blockchain-development",
    title: "Blockchain Development",
    description:
      "Smart contract and blockchain concepts for transparent, tamper-resistant workflows such as V-Chain and remittance systems.",
    lucideIcon: "blocks"
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description:
      "Short-form edits for campaigns, portfolios, and social content with strong pacing and visual rhythm.",
    lucideIcon: "clapperboard"
  },
  {
    id: "graphic-designing",
    title: "Graphic Designing",
    description:
      "Brand assets, visual posts, and marketing graphics shaped around clarity, consistency, and impact.",
    lucideIcon: "palette"
  }
];

export const skills: Skill[] = [
  { name: "Web Developing", level: 68 },
  { name: "Backend Development & Security", level: 52 },
  { name: "Blockchain Development", level: 48 },
  { name: "Video Editing", level: 60 },
  { name: "Graphic Designing", level: 72 }
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Technical Skills",
    items: [
      "HTML/CSS (Intermediate)",
      "JavaScript, Java, and C++ (Basic)",
      "React JS (Basic)",
      "Next.js (Basic)",
      "PHP (Basic)",
      "Python (Basic)",
      "Solidity",
      "WordPress (Basic)",
      "UI/UX Designing (Figma)"
    ]
  },
  {
    title: "Creative Tools",
    items: ["Video Editing", "Graphics Editing", "Microsoft Office"]
  },
  {
    title: "Professional Skills",
    items: [
      "Teamwork",
      "Time Management",
      "Leadership",
      "Effective Communication",
      "Critical Thinking",
      "Adaptability"
    ]
  }
];

export const educationEntries: ResumeEntry[] = [
  {
    id: "dyci-computer-engineering",
    title: "Bachelor of Science in Computer Engineering",
    subtitle: "Dr. Yanga's Colleges Inc.",
    period: "2023 - 2026",
    location: "Bocaue, Bulacan",
    description: [
      "Continuing computer engineering studies with a focus on software, web development, and system-based academic projects."
    ]
  },
  {
    id: "sti-computer-engineering",
    title: "Bachelor of Science in Computer Engineering",
    subtitle: "STI Colleges Balagtas",
    period: "2021 - 2023",
    location: "Balagtas, Bulacan",
    description: [
      "Built foundational knowledge in programming, computer systems, and engineering coursework."
    ]
  },
  {
    id: "sna-stem",
    title: "Science, Engineering, Technology, and Mathematics",
    subtitle: "Sto. Nino Academy",
    period: "2019 - 2021",
    location: "Bocaue, Bulacan",
    description: [
      "Completed senior high school under the STEM track."
    ]
  }
];

export const experienceEntries: ResumeEntry[] = [
  {
    id: "morph-hackathon",
    title: "Smart Contract Developer",
    subtitle: "Morph Hackathon",
    period: "2026",
    description: [
      "Developed a secure blockchain-based payment system designed to streamline and lower the costs of cross-border remittances.",
      "Authored gas-efficient smart contracts for transparent, trustless, and near-instant transaction processing."
    ]
  },
  {
    id: "dvcode-intern",
    title: "Software Developer Intern",
    subtitle: "DvCode Technologies Inc.",
    period: "2026",
    description: [
      "Developed a versatile booking management system capable of supporting multiple booking types through a scalable architecture.",
      "Built a high-performance responsive interface using Next.js, TypeScript, and Tailwind CSS."
    ]
  },
  {
    id: "thesis-v-chain",
    title: "Thesis Project",
    subtitle: "4th Year Thesis",
    period: "2026",
    description: [
      "Developed V-Chain as a blockchain-based thesis project for senior citizen and PWD discount verification.",
      "Designed the system around secure record validation, transparent transactions, and reduced manual authentication work."
    ]
  },
  {
    id: "school-dyh-website",
    title: "School Project",
    subtitle: "DYH Website Development",
    period: "2024",
    description: [
      "Built responsive pages for a school website project using HTML, CSS, and PHP based on provided UI/UX designs.",
      "Focused on clear page structure, accessible navigation, and clean implementation."
    ]
  },
  {
    id: "school-am-closet",
    title: "School Project",
    subtitle: "A&M Closet Client Website",
    period: "2024",
    description: [
      "Built an e-commerce school project for A&M Closet using HTML, CSS, and PHP.",
      "Applied basic UI/UX principles to improve product browsing, navigation flow, and brand presentation."
    ]
  },
  {
    id: "lngr-content-creator",
    title: "Content Creator",
    subtitle: "LNGR Thrift Shop",
    period: "2023 - 2024",
    description: [
      "Designed graphics and planned content flow for social media posts.",
      "Handled video shooting and editing for product promotions.",
      "Helped manage daily shop activities and gained hands-on small business experience."
    ]
  },
  {
    id: "trend-micro",
    title: "Trend Micro uCTF 2025 Participant",
    subtitle: "Cybersecurity",
    period: "2025",
    description: [
      "Participated in a cybersecurity competition focused on threat analysis, system security, and risk awareness.",
      "Collaborated with team members to analyze scenarios and propose security-related solutions."
    ]
  },
  {
    id: "icpep-python",
    title: "Programming Competitor (Python)",
    subtitle: "ICPEP - Region 3",
    period: "2022",
    description: [
      "Solved Python programming problems in a timed competitive environment.",
      "Applied basic to intermediate Python concepts, logic building, and problem solving."
    ]
  }
];

export const projectEntries: ResumeEntry[] = [
  {
    id: "v-chain",
    title: "V-Chain",
    subtitle: "Senior Citizen and PWD Discount Blockchain System",
    description: [
      "Developed a blockchain-based ledger to automate eligibility validation for mandated public discounts.",
      "Reduced manual authentication overhead by digitizing sensitive records on an immutable and secure network."
    ]
  },
  {
    id: "remitsafe",
    title: "RemitSafe",
    subtitle: "Cross-Border Payment System",
    description: [
      "Built a decentralized remittance gateway focused on reducing traditional cross-border transaction bottlenecks.",
      "Wrote secure smart contracts for auditable, trustless, and cost-effective value transfers."
    ]
  },
  {
    id: "booklify",
    title: "Booklify",
    subtitle: "Booking System",
    description: [
      "Architected a flexible scheduling engine designed to support any booking category or service model.",
      "Developed the application using Next.js, Tailwind CSS, TypeScript, and ConvexDB."
    ]
  },
  {
    id: "dyh-website",
    title: "DYH Website Development",
    subtitle: "School Website Development",
    description: [
      "Developed responsive pages using HTML, CSS, and PHP based on UI/UX designs.",
      "Implemented clean semantic markup and adjusted layouts to improve user flow."
    ]
  },
  {
    id: "am-closet",
    title: "A&M Closet Client Website",
    subtitle: "Front-End and PHP Development",
    description: [
      "Built e-commerce website interfaces using HTML, CSS, and PHP.",
      "Applied foundational UI/UX principles to improve navigation and product presentation.",
      "Aligned visual design with brand identity through client coordination."
    ]
  }
];

export const graphicImages: GalleryImage[] = [
  {
    src: "/pics/415785227_789576659856604_3234976269121200310_n-min.jpg",
    alt: "Graphic editing project 1"
  },
  {
    src: "/pics/415811411_789575863190017_37838121775160657_n-min.jpg",
    alt: "Graphic editing project 2"
  },
  {
    src: "/pics/414953733_789575979856672_1930578698750647532_n-min.jpg",
    alt: "Graphic editing project 3"
  },
  {
    src: "/pics/414728443_787845000029770_261820562492075523_n-min.jpg",
    alt: "Graphic editing project 4"
  },
  { src: "/pics/a-min.png", alt: "Graphic editing project 5" },
  { src: "/pics/qweqw-min.png", alt: "Graphic editing project 6" },
  { src: "/pics/rrrr-min.png", alt: "Graphic editing project 7" },
  { src: "/pics/asd-min.png", alt: "Graphic editing project 8" },
  { src: "/pics/1-min.jpg", alt: "Graphic editing project 9" },
  { src: "/pics/2-min.jpg", alt: "Graphic editing project 10" },
  { src: "/pics/3-min.jpg", alt: "Graphic editing project 11" },
  { src: "/pics/4-min.jpg", alt: "Graphic editing project 12" }
];

export const videoHighlights: VideoItem[] = [
  { src: "/videos/8th(3).mp4", title: "Video editing highlight 1" },
  { src: "/videos/video_843989837082874.mp4", title: "Video editing highlight 2" },
  { src: "/videos/video_1785359545229126.mp4", title: "Video editing highlight 3" },
  { src: "/videos/skskskksks.mp4", title: "Video editing highlight 4" }
];

export const webProjects: WebProject[] = [
  {
    title: "Dr. Yanga's Hospital Website",
    label: "Hospital Website",
    shortInfo:
      "A responsive hospital website concept focused on clearer service discovery, patient navigation, and appointment access.",
    stack: ["HTML", "CSS", "PHP", "Responsive UI"],
    description:
      "A hospital website concept for DYH designed to modernize patient access, simplify navigation to health services, and make appointment information easier to find.",
    longExplanation: [
      "This project focused on creating a clearer web experience for a hospital website. The goal was to organize the content in a way that helps visitors quickly understand available services, find important information, and move through the site without confusion.",
      "The implementation used HTML, CSS, and PHP to build responsive pages with practical navigation and structured content. The design direction keeps the interface simple, readable, and focused on patient-facing information rather than decorative complexity."
    ],
    video: "/videos/dyci.mp4"
  },
  {
    title: "V-Chain: A Blockchain Solution for Senior Citizen and PWD Discounts",
    label: "Blockchain Thesis",
    shortInfo:
      "A verification platform concept for senior citizen and PWD discounts, built around transparent records and smoother validation.",
    stack: ["Golang", "PostgreSQL", "Python", "HTML", "CSS"],
    description:
      "A blockchain-based platform concept that streamlines discount verification for senior citizens and PWDs with transparent, tamper-resistant transactions.",
    longExplanation: [
      "V-Chain was developed as a thesis project centered on improving the validation process for senior citizen and PWD discounts. The concept addresses manual verification problems by introducing a digital workflow that can make records easier to check and harder to tamper with.",
      "The system direction combines backend logic, database storage, supporting scripts, and a web interface to present a more reliable verification flow. The project highlights practical system design, data handling, and blockchain-inspired transparency for a public-service use case."
    ],
    video: "/videos/final.mp4"
  },
  {
    title: "RemitSafe",
    label: "Cross-Border Payment System",
    shortInfo:
      "A decentralized remittance concept focused on reducing cross-border payment bottlenecks through smart contracts and Web3 workflows.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Solidity", "Web3"],
    description:
      "A blockchain payment system concept created during the Morph Hackathon, designed to support faster, more transparent, and lower-cost cross-border remittance flows.",
    longExplanation: [
      "RemitSafe was developed as a hackathon project focused on improving the experience of sending money across borders. The concept explores how smart contracts and Web3 tools can reduce friction in remittance workflows while keeping transactions more transparent and auditable.",
      "The project combines a Next.js and Tailwind CSS interface with TypeScript, Solidity, and Web3 integration concepts. The work highlights blockchain system thinking, payment flow design, and secure smart contract direction for trustless transactions."
    ]
  },
  {
    title: "Booklify",
    label: "Booking System",
    shortInfo:
      "A flexible booking management system built to support different appointment types through a clean and scalable interface.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "ConvexDB"],
    description:
      "A booking system created during internship work, focused on responsive scheduling flows, reusable interface patterns, and a more organized way to manage appointment-based services.",
    longExplanation: [
      "Booklify was built around the idea that a booking platform should be flexible enough to support different service types without making the interface complicated. The system direction focused on reusable booking flows, clean page structure, and a responsive experience for users managing appointments.",
      "The project used Next.js, TypeScript, Tailwind CSS, and ConvexDB. My work emphasized front-end implementation, layout consistency, and practical user experience decisions that make booking actions easier to understand and complete."
    ]
  }
];

export const personalDetails = [
  ["Birthday", "June 7, 2002"],
  ["Phone", contactInfo.phone],
  ["Email", contactInfo.email],
  ["From", contactInfo.location],
  ["Language", "English, Tagalog, Mandarin, French"],
  ["Freelance", "Available"]
] as const;

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/JJBorlongan",
    icon: "https://img.icons8.com/?size=100&id=62225&format=png&color=ededed"
  },
  {
    label: "X",
    href: "https://x.com/jborlongan07",
    icon: "https://img.icons8.com/?size=100&id=437&format=png&color=ededed"
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jez_borl/",
    icon: "https://img.icons8.com/?size=100&id=32292&format=png&color=ededed"
  },
  {
    label: "GitHub",
    href: "https://github.com/Jezreelnareal",
    icon: "https://img.icons8.com/?size=100&id=12599&format=png&color=ededed"
  }
];
