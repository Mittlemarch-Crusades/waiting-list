"use client";

import { motion, useReducedMotion } from "framer-motion";

import { siteContent } from "@/config/world";

import { AnimatedBackground } from "./animated-background";
import { AudioPlayer } from "./music-player";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden border-b border-white/10">
      <AnimatedBackground />

      <div className="container-shell relative z-10 flex min-h-screen flex-col justify-center pt-28 pb-20">
        <div className="max-w-4xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-kicker"
          >
            {siteContent.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-6 max-w-5xl font-[family-name:var(--font-heading)] text-5xl uppercase leading-[0.95] text-stone-50 sm:text-6xl lg:text-8xl"
          >
            {siteContent.hero.title}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-6 max-w-2xl font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-200/85 sm:text-2xl"
          >
            {siteContent.hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#waitlist" className="button-primary">
              {siteContent.hero.primaryCta}
            </a>
            <a href="#world" className="button-secondary">
              {siteContent.hero.secondaryCta}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 flex flex-col gap-5 lg:mt-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="panel gold-frame max-w-xl p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-amber-200/80">World Teaser</p>
            <p className="mt-3 font-[family-name:var(--font-serif)] text-lg leading-relaxed text-stone-200/80">
              Beneath black pines and ruined bastions, the old banners of Mittlemarch begin to stir.
              Every oath, expedition, and warband will shape the age that follows.
            </p>
          </div>

          <AudioPlayer />
        </motion.div>
      </div>
    </section>
  );
}
