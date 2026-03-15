"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HERO_ART = "/images/mittlemarch-cavalry.jpg";
const EMBERS = [
  { left: "8%", bottom: "9%", width: 4, height: 4, delay: "0s", duration: "7.8s", driftX: "18px", rise: "-120px", rotate: "18deg", opacity: 0.9 },
  { left: "16%", bottom: "11%", width: 6, height: 3, delay: "0.7s", duration: "9.4s", driftX: "42px", rise: "-168px", rotate: "38deg", opacity: 0.8 },
  { left: "21%", bottom: "7%", width: 3, height: 3, delay: "1.4s", duration: "6.8s", driftX: "-16px", rise: "-132px", rotate: "-14deg", opacity: 0.78 },
  { left: "29%", bottom: "12%", width: 5, height: 3, delay: "2.1s", duration: "8.7s", driftX: "26px", rise: "-152px", rotate: "24deg", opacity: 0.88 },
  { left: "37%", bottom: "8%", width: 4, height: 4, delay: "0.9s", duration: "7.1s", driftX: "-24px", rise: "-116px", rotate: "-22deg", opacity: 0.72 },
  { left: "43%", bottom: "13%", width: 6, height: 4, delay: "3.1s", duration: "10.2s", driftX: "56px", rise: "-188px", rotate: "41deg", opacity: 0.84 },
  { left: "51%", bottom: "9%", width: 3, height: 3, delay: "1.8s", duration: "6.6s", driftX: "14px", rise: "-110px", rotate: "16deg", opacity: 0.76 },
  { left: "58%", bottom: "12%", width: 5, height: 3, delay: "2.6s", duration: "8.9s", driftX: "-36px", rise: "-164px", rotate: "-35deg", opacity: 0.82 },
  { left: "64%", bottom: "7%", width: 4, height: 4, delay: "0.5s", duration: "7.5s", driftX: "22px", rise: "-124px", rotate: "19deg", opacity: 0.7 },
  { left: "71%", bottom: "10%", width: 6, height: 3, delay: "3.5s", duration: "9.8s", driftX: "-48px", rise: "-176px", rotate: "-44deg", opacity: 0.86 },
  { left: "77%", bottom: "8%", width: 3, height: 3, delay: "1.1s", duration: "6.9s", driftX: "17px", rise: "-118px", rotate: "14deg", opacity: 0.74 },
  { left: "84%", bottom: "11%", width: 5, height: 4, delay: "2.9s", duration: "8.4s", driftX: "-28px", rise: "-146px", rotate: "-28deg", opacity: 0.8 }
] as const;

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
          {EMBERS.map((ember, index) => (
            <span
              key={`${ember.left}-${index}`}
              className="ember absolute rounded-full bg-gradient-to-b from-amber-100 via-amber-400 to-orange-600"
              style={{
                left: ember.left,
                bottom: ember.bottom,
                width: `${ember.width}px`,
                height: `${ember.height}px`,
                opacity: ember.opacity,
                ["--ember-delay" as string]: ember.delay,
                ["--ember-duration" as string]: ember.duration,
                ["--ember-drift-x" as string]: ember.driftX,
                ["--ember-rise" as string]: ember.rise,
                ["--ember-rotate" as string]: ember.rotate
              }}
            />
          ))}
        </>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-night via-night/80 to-transparent" />
    </div>
  );
}
