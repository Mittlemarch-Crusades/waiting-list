"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HERO_ART = "/images/mittlemarch-cavalry.jpg";

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 56]);
  const fogFrontY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -34]);
  const fogBackY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -18]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 24]);

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[6%]"
        style={reduceMotion ? undefined : { y: imageY }}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1.06, 1.1, 1.06],
                x: [0, -10, 0]
              }
        }
        transition={{
          duration: 24,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      >
        <Image
          src={HERO_ART}
          alt="Mounted knights riding through the lands of Mittlemarch"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 42%" }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,12,0.28),rgba(4,7,12,0.48)_42%,rgba(4,7,12,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,201,125,0.28),transparent_22%),radial-gradient(circle_at_18%_28%,rgba(110,145,134,0.14),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(236,173,92,0.12),transparent_18%)]" />

      <motion.div
        className="absolute left-[-12%] right-[-8%] bottom-[8%] h-[28%] rounded-[100%] bg-white/10 blur-3xl"
        style={reduceMotion ? undefined : { y: fogBackY }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 36, 0],
                opacity: [0.1, 0.18, 0.1]
              }
        }
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute left-[-18%] right-[-10%] bottom-[-2%] h-[34%] rounded-[100%] bg-stone-100/12 blur-[84px]"
        style={reduceMotion ? undefined : { y: fogFrontY }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -48, 0],
                opacity: [0.18, 0.28, 0.18]
              }
        }
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute left-[8%] top-[14%] h-56 w-56 rounded-full bg-amber-200/12 blur-3xl"
        style={reduceMotion ? undefined : { y: glowY }}
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.24, 0.38, 0.24],
                scale: [1, 1.08, 1]
              }
        }
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
      />

      {!reduceMotion ? (
        <>
          <div className="absolute right-[10%] top-[16%] h-40 w-40 rounded-full bg-emerald-200/10 blur-3xl animate-drift" />
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-amber-100/60 animate-particle"
              style={{
                left: `${10 + (index % 6) * 12}%`,
                bottom: `${8 + Math.floor(index / 6) * 8}%`,
                animationDelay: `${index * 0.45}s`,
                animationDuration: `${8 + (index % 5)}s`
              }}
            />
          ))}
        </>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-night via-night/80 to-transparent" />
    </div>
  );
}
