import Link from "next/link";
import { portraitImage } from "@/lib/data";

type ContactPanelProps = {
  title: string;
  children: React.ReactNode;
  action?: "button" | "form";
};

export function ContactPanel({ title, children, action = "button" }: ContactPanelProps) {
  return (
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
            className="h-[380px] w-full object-cover brightness-90 sm:h-[520px] lg:h-[760px]"
          />
        </div>
        <div className="max-w-2xl text-left">
          <h2 className="font-serif text-4xl font-light leading-tight text-[#dac5a7] sm:text-[42px]">
            {title}
          </h2>
          <div className="mt-7 max-w-xl space-y-4 text-sm leading-8 text-[#ededed]/65">
            {children}
          </div>
          {action === "button" ? (
            <Link
              href="/lets-talk"
              className="mt-8 inline-flex h-12 items-center justify-center border border-[#dac5a7]/35 bg-[#dac5a7]/[0.07] px-9 text-center text-sm uppercase tracking-[0.12em] text-[#dac5a7] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#dac5a7]/60 hover:bg-[#dac5a7]/[0.14]"
              data-hover-load="button"
            >
              Book an Appointment
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
