"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { WORLD_NAME, siteContent } from "@/config/world";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled ? "border-b border-white/10 bg-night/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-shell flex items-center justify-between py-4">
        <a href="#top" className="group inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/20 bg-white/5 text-lg text-amber-200 shadow-glow">
            M
          </span>
          <span className="flex flex-col">
            <span className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[0.28em] text-stone-100">
              {WORLD_NAME}
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 transition group-hover:text-stone-200">
              MMORPG Teaser
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {siteContent.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.28em] text-stone-300 transition hover:text-amber-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#waitlist" className="button-secondary hidden md:inline-flex">
          Enter the Waitlist
        </a>
      </div>
    </motion.header>
  );
}
