"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { siteContent } from "@/config/world";

import { SectionHeading } from "./section-heading";
import { SectionReveal } from "./section-reveal";

function GalleryCard({
  title,
  image,
  fallback
}: {
  title: string;
  image: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group panel gold-frame relative overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {!failed ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,160,80,0.16),transparent_28%),linear-gradient(180deg,rgba(14,25,36,0.9),rgba(6,8,12,1))]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/75">Concept Teaser</p>
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-2xl uppercase text-stone-50">
            {title}
          </h3>
          <p className="mt-3 font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/80">
            {fallback}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function Gallery() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-shell">
        <SectionReveal>
          <SectionHeading
            eyebrow="Concept Visions"
            title={siteContent.gallery.title}
            description={siteContent.gallery.description}
            align="center"
          />
        </SectionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {siteContent.gallery.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <GalleryCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
