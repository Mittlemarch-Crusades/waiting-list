import Image from "next/image";

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
          className="panel gold-frame group relative min-h-[320px] overflow-hidden p-6"
        >
          <div className="absolute inset-0">
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.14),rgba(5,8,12,0.44)_38%,rgba(5,8,12,0.92)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,204,143,0.16),transparent_22%)]" />
          </div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.26em] text-stone-400">0{index + 1}</p>
            <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl uppercase text-stone-100 transition group-hover:text-amber-100">
              {feature.title}
            </h3>
            <p className="mt-4 font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/85">
              {feature.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
