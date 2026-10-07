"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import SavannahCanvas from "./SavannahCanvas";
import { WhatsAppIcon } from "./ui/Mark";
import { site } from "@/config/site";
import { useScrollTo } from "@/lib/smooth-scroll";
import { whatsappLink, helloMessage } from "@/lib/contact";
import { EASE_EXPO } from "@/lib/utils";
import acaciaSunset from "@/assets/images/acacia-sunset.jpg";

/*
 * HERO: you start low in the red-oat grass at sunrise. Scroll and the camera
 * rises out of it to reveal the plains; then the horizon itself splits open,
 * top and bottom drawing apart, and the camp is behind it.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rise = useTransform(p, [0, 0.5], [0, 1]);

  // the horizon opens
  const slitTop = useTransform(p, [0.5, 0.9], [58, 0]);
  const slitBottom = useTransform(p, [0.5, 0.9], [42, 0]);
  const slit = useTransform(() => `inset(${slitTop.get()}% 0% ${slitBottom.get()}% 0%)`);
  const upY = useTransform(p, [0.45, 0.9], ["0vh", "-40vh"]);
  const downY = useTransform(p, [0.45, 0.9], ["0vh", "40vh"]);
  const statement = useTransform(p, [0.7, 0.92], [0, 1]);
  const statementY = useTransform(p, [0.7, 0.92], [24, 0]);
  const ui = useTransform(p, (v) => 1 - Math.min(1, v / 0.12));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const word = (delay: number) => ({
    initial: { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1.5, ease: EASE_EXPO, delay },
  });

  return (
    <section ref={ref} id="top" data-nav="light" aria-labelledby="hero-title" className="relative h-[320svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-night">
        <SavannahCanvas rise={rise} fallback={acaciaSunset} priority className="absolute inset-0 h-full w-full" />

        <h1 id="hero-title" className="pointer-events-none">
          <span className="sr-only">{site.name}: the horizon is the only wall. {site.tagline}.</span>
          <motion.span aria-hidden="true" className="absolute left-[var(--gutter)] top-[15svh] block md:top-[13svh]" style={{ y: mounted ? upY : 0 }}>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span className="d-hero block" {...word(0.5)}>
                The <em className="font-[300]">horizon</em>
              </motion.span>
            </span>
          </motion.span>
          <motion.span aria-hidden="true" className="absolute left-[var(--gutter)] top-[calc(15svh+1.05em)] block text-[clamp(3.2rem,8.2vw,10.5rem)] md:bottom-[20svh] md:left-auto md:right-[var(--gutter)] md:top-auto md:text-right" style={{ y: mounted ? downY : 0 }}>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span className="d-hero block text-night [text-shadow:0_1px_30px_rgba(255,220,160,0.35)]" {...word(0.65)}>
                is the only wall<span className="text-shuka">.</span>
              </motion.span>
            </span>
          </motion.span>
        </h1>

        <motion.div className="gutter label pointer-events-none absolute inset-x-0 top-[5.75rem] hidden justify-between text-night/70 md:flex" style={{ opacity: mounted ? ui : 1 }}>
          <span>Maasai Mara · Kenya</span>
          <span>{site.contact.coordinates}</span>
        </motion.div>

        {/* soft light behind the intro copy so it reads over the grass */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_0%_100%,rgba(239,230,214,0.82),rgba(239,230,214,0)_100%)]" style={{ opacity: mounted ? ui : 1 }} />
        <motion.div className="gutter absolute inset-x-0 bottom-[var(--gutter)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between" style={{ opacity: mounted ? ui : 1 }}>
          <motion.div
            className="flex flex-col gap-4 md:max-w-[26rem]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_EXPO, delay: 1.3 }}
          >
            <p className="hidden text-[0.98rem] font-medium leading-snug text-night/90 md:block">
              Eight canvas tents on a private conservancy on the edge of the Maasai Mara. No walls, no crowds, no fences between you and the plains.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#plan"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#plan");
                }}
                className="group relative inline-flex h-12 items-center overflow-hidden rounded-full bg-canvas px-6 text-[0.85rem] text-night"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-shuka transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-canvas">Plan your safari</span>
              </a>
              <a
                href={whatsappLink(helloMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-night/40 bg-canvas/30 px-5 text-[0.85rem] text-night backdrop-blur-sm transition-colors hover:bg-canvas/60"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
          <p className="label hidden text-night/75 md:block">Scroll · rise above the grass</p>
        </motion.div>

        {/* the horizon opens onto the camp */}
        <motion.div className="canvas-tex absolute inset-0 z-10 flex items-center justify-center" style={{ clipPath: mounted ? slit : "inset(58% 0% 42% 0%)" }}>
          <motion.p className="gutter max-w-[22ch] text-center font-serif text-[clamp(2.4rem,5.6vw,6.5rem)] font-[330] leading-[1] tracking-[-0.025em]" style={{ opacity: statement, y: statementY }}>
            Eight tents. Thirty thousand acres. <em>One</em> horizon<span className="text-shuka">.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
