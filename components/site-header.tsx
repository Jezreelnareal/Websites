"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed left-1/2 top-5 z-50 flex h-[57px] w-[calc(100%-2rem)] max-w-[633px] -translate-x-1/2 items-center justify-between gap-4 border border-[#dac5a7]/30 bg-[#c5c5c5]/10 px-4 backdrop-blur-3xl">
      <Link
        href="/"
        aria-label="Go to home"
        className="group flex h-11 w-11 shrink-0 items-center justify-center transition duration-300"
        data-hover-load="soft"
      >
        <Image
          src="/pics/nav-logo.png"
          alt="Jezreel Borlongan logo"
          width={42}
          height={49}
          priority
          className="h-10 w-auto object-contain [filter:drop-shadow(0_0_10px_rgba(218,197,167,.12))] transition duration-300 group-hover:brightness-110"
        />
      </Link>
      <nav
        aria-label="Primary navigation"
        className="flex items-center gap-1 overflow-x-auto text-sm font-normal sm:text-base"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              data-hover-load="text"
              className={`group relative isolate whitespace-nowrap overflow-hidden px-2.5 py-2 transition-[color,text-shadow,filter] duration-300 ease-out hover:text-[#dac5a7] focus-visible:outline-none focus-visible:[text-shadow:0_0_18px_rgba(218,197,167,.22)] sm:px-3 ${
                isActive
                  ? "text-[#dac5a7] [text-shadow:0_0_18px_rgba(218,197,167,.18)]"
                  : "text-[#ededed]/78"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 bottom-1 h-[2px] origin-center bg-[linear-gradient(90deg,transparent,rgba(218,197,167,.35),#dac5a7,rgba(218,197,167,.35),transparent)] transition-[opacity,transform,filter] duration-500 ease-out ${
                  isActive
                    ? "scale-x-100 opacity-100 [filter:drop-shadow(0_0_8px_rgba(218,197,167,.45))]"
                    : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-75 group-hover:[filter:drop-shadow(0_0_6px_rgba(218,197,167,.28))]"
                  }`}
              />
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
