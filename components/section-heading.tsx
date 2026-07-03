type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  description,
  align = "center"
}: SectionHeadingProps) {
  return (
    <div
      className={`mx-auto max-w-3xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <h2 className="font-serif text-4xl font-light text-[#dac5a7]">{title}</h2>
      {description ? (
        <p className="mt-5 leading-7 text-[#ededed]/85">{description}</p>
      ) : null}
    </div>
  );
}
