import { heroBackdrop } from "@/lib/data";

type SubHeroProps = {
  label: string;
};

export function SubHero({ label }: SubHeroProps) {
  return (
    <section
      className="flex min-h-[400px] items-center justify-center bg-cover bg-fixed bg-center px-6 pt-24 text-center"
      data-scroll-reveal="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.9)), url(${heroBackdrop})`
      }}
    >
      <h1 className="text-3xl font-light sm:text-4xl">
        <span className="font-serif text-[#dac5a7]">Home</span> | {label}
      </h1>
    </section>
  );
}
