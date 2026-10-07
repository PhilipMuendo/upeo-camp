"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/config/site";
import { RevealLines } from "./ui/Reveal";

/** CONSERVATION: the conservancy model, said plainly, under the night sky. */
export default function Conservation() {
  const ref = useRef<HTMLElement>(null);
  const c = site.conservation;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} id="conservation" data-nav="dark" aria-labelledby="cons-title" className="relative overflow-hidden bg-night py-[18vh] text-canvas">
      <motion.div className="absolute inset-[-14%_0]" style={{ y }}>
        <Image src={c.image.src} alt="" fill sizes="100vw" className="object-cover opacity-55" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/30 to-night" />
      <div className="gutter relative">
        <p className="label text-canvas/60">(06) Conservation</p>
        <RevealLines
          as="h2"
          className="d-xl mt-8 max-w-[18ch]"
          lines={[
            <span key="a">We don&apos;t own the land.</span>,
            <span key="b">
              We <em>lease</em> it from the
            </span>,
            <span key="c">families who do.</span>,
          ]}
        />
        <span id="cons-title" className="sr-only">
          {c.statement}
        </span>
        <div className="mt-[10vh] grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <p className="lead max-w-[40ch] text-canvas/80 md:col-span-5">{c.body}</p>
          <dl className="grid grid-cols-3 gap-6 md:col-span-6 md:col-start-7">
            {c.figures.map((f) => (
              <div key={f.label} className="flex flex-col border-t border-canvas/25 pt-4">
                <dd className="font-serif text-[clamp(2rem,3.6vw,3.6rem)] font-[300] leading-none tracking-[-0.03em]">{f.value}</dd>
                <dt className="label mt-3 text-canvas/60">
                  {f.label}
                  {f.placeholder ? "*" : ""}
                </dt>
              </div>
            ))}
          </dl>
        </div>
        <p className="label mt-8 text-canvas/40">* Placeholder figures, to be replaced with the conservancy&apos;s published numbers.</p>
      </div>
    </section>
  );
}
