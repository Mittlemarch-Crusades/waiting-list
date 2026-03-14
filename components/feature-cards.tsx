import { siteContent } from "@/config/world";

export function FeatureCards() {
  return (
    <div
      id="features"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
    >
      {siteContent.features.map((feature, index) => (
        <article
          key={feature.title}
          className="panel gold-frame group relative overflow-hidden p-6"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
          <p className="text-xs uppercase tracking-[0.26em] text-stone-500">0{index + 1}</p>
          <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl uppercase text-stone-100 transition group-hover:text-amber-100">
            {feature.title}
          </h3>
          <p className="mt-4 font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/80">
            {feature.description}
          </p>
        </article>
      ))}
    </div>
  );
}
