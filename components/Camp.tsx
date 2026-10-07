"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { site } from "@/config/site";
import { EASE_EXPO } from "@/lib/utils";
import { RevealLines } from "./ui/Reveal";
import tentVeranda from "@/assets/images/tent-veranda.jpg";
import elephantsLight from "@/assets/images/elephants-light.jpg";

/*
 * THE CAMP: continues straight out of the horizon. A short manifesto, the
 * facts, and two photographs annotated in a guide's hand, the way a field
 * notebook would be.
 */

function Note({ children, className, delay = 0, arrow }: { children: ReactNode; className?: string; delay?: number; arrow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.8 });
  return (
    <div ref={ref} className={`pointer-events-none absolute ${className ?? ""}`} aria-hidden="true">
      <motion.p
        className="hand text-[1.55rem] leading-[1] text-shuka md:text-[1.8rem]"
        initial={{ opacity: 0, y: 6, rotate: -3 }}
        animate={on ? { opacity: 1, y: 0, rotate: -3 } : undefined}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      >
        {children}
      </motion.p>
      {arrow && (
        <svg viewBox="0 0 120 60" className="mt-1 h-12 w-24 text-shuka" fill="none">
          <motion.path
            d={arrow}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={on ? { pathLength: 1 } : undefined}
            transition={{ duration: 1, ease: EASE_EXPO, delay: delay + 0.3 }}
          />
        </svg>
      )}
    </div>
  );
}

export default function Camp() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  return (
    <section id="camp" data-nav="light" aria-labelledby="camp-title" className="canvas-tex relative pb-[16vh] pt-[10vh]">
      <div className="gutter">
        <div className="label flex justify-between text-ash">
          <span>(01) The camp</span>
          <span>Upeo · Swahili for horizon</span>
        </div>
        <RevealLines
          as="h2"
          className="d-lg mt-[7vh] max-w-[22ch]"
          lines={[
            <span key="a">We put eight tents</span>,
            <span key="b">where you can see the</span>,
            <span key="c">
              <em>whole</em> of it<span className="text-shuka">.</span>
            </span>,
          ]}
        />
        <span id="camp-title" className="sr-only">
          The camp
        </span>
      </div>

      <div className="gutter mt-[12vh] grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-6">
        <div className="flex flex-col justify-between gap-12 md:col-span-4">
          <p className="lead max-w-[36ch] text-night/80">
            No walls, no fences and no other camps in view. Just canvas, a veranda, the sound of the plains at night, and guides who grew up herding cattle on this very land.
          </p>
          <dl className="grid grid-cols-3 gap-4 border-t border-night/15 pt-6">
            {site.facts.map((f) => (
              <div key={f.label} className="flex flex-col">
                <dd className="font-serif text-[clamp(1.8rem,2.6vw,2.9rem)] font-[330] leading-none tracking-[-0.03em]">{f.value}</dd>
                <dt className="label mt-2 text-ash">
                  {f.label}
                  {"placeholder" in f && f.placeholder ? "*" : ""}
                </dt>
              </div>
            ))}
          </dl>
          <p className="label text-ash">* Placeholder figures</p>
        </div>

        <div ref={imgRef} className="relative md:col-span-7 md:col-start-6">
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div className="absolute inset-[-8%]" style={{ y: y1 }}>
              <Image src={elephantsLight} alt="Elephants crossing the plains under shafts of evening light" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" placeholder="blur" />
            </motion.div>
          </div>
          <motion.div className="absolute -bottom-16 -left-4 w-[42%] border-[10px] border-canvas bg-canvas shadow-[0_30px_60px_-30px_rgba(21,18,13,0.45)] md:-left-16" style={{ y: y2 }}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={tentVeranda} alt="A canvas tent veranda with a folding table and two chairs" fill sizes="25vw" className="object-cover" placeholder="blur" />
            </div>
          </motion.div>
          <Note className="right-4 top-4 text-right md:-right-2 md:-top-10" arrow="M100,8 C80,30 60,40 18,50">
            from your bed, 6.10am
          </Note>
          <Note className="-bottom-12 left-[44%] hidden md:block" delay={0.3} arrow="M10,10 C30,40 -10,30 4,52">
            your veranda
          </Note>
        </div>
      </div>
    </section>
  );
}
