import { siteContent } from "@/config/world";

import { FeatureCards } from "./feature-cards";
import { SectionHeading } from "./section-heading";
import { SectionReveal } from "./section-reveal";

export function WorldSection() {
  return (
    <section id="world" className="relative py-24 sm:py-28">
      <div className="container-shell">
        <SectionReveal>
          <SectionHeading
            eyebrow="Forgotten Realms"
            title="A Land Buried Beneath Legend"
            description={siteContent.world.intro}
          />
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-8 max-w-4xl">
          <p className="font-[family-name:var(--font-serif)] text-2xl leading-relaxed text-stone-300/82">
            {siteContent.world.body}
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-14">
          <FeatureCards />
        </SectionReveal>
      </div>
    </section>
  );
}
