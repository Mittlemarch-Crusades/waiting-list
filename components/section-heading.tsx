type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div className={alignment}>
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl uppercase leading-tight text-stone-50 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/86">
          {description}
        </p>
      ) : null}
    </div>
  );
}
