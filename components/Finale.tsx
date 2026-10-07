"use client";

import { motion } from "motion/react";
import SavannahCanvas from "./SavannahCanvas";
import { useScrollTo } from "@/lib/smooth-scroll";
import { RevealLines } from "./ui/Reveal";
import stars from "@/assets/images/stars-camp.jpg";

/** FINALE: the same grass, after dark: moonlit tips, a fire glowing low, the whole sky. */
export default function Finale() {
  const scrollTo = useScrollTo();
  return (
    <section id="night" data-nav="dark" aria-labelledby="final-title" className="relative h-[100svh] overflow-hidden bg-night text-canvas">
      <SavannahCanvas night fallback={stars} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-transparent" />
      <div className="gutter relative flex h-full flex-col items-center justify-start pt-[20svh] text-center">
        <RevealLines
          as="h2"
          className="font-serif font-[300]"
          lineClassName="text-[clamp(3.4rem,9vw,10rem)] leading-[0.95] tracking-[-0.035em]"
          lines={["Meet us", <em key="h">at the horizon.</em>]}
        />
        <span id="final-title" className="sr-only">
          Meet us at the horizon
        </span>
        <p className="label mt-6 text-canvas/75">The fire&apos;s lit. Your tent is ready.</p>
        <motion.a
          href="#plan"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#plan");
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="group relative mt-10 inline-flex h-14 items-center overflow-hidden rounded-full bg-canvas px-8 text-[0.95rem] text-night"
        >
          <span className="absolute inset-0 translate-y-full rounded-full bg-shuka transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
          <span className="relative transition-colors duration-500 group-hover:text-canvas">Plan your safari</span>
        </motion.a>
      </div>
    </section>
  );
}
