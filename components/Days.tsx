"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/config/site";
import { EASE_EXPO, pad } from "@/lib/utils";
import { RevealLines } from "./ui/Reveal";

/*
 * DAYS ON SAFARI: a light table. Each experience is a 35mm slide in a card
 * mount; point at one (or focus it) and it lifts off the glass while the
 * viewer beside the table shows it large.
 */
export default function Days() {
  const xs = site.experiences;
  const [active, setActive] = useState(0);
  const a = xs[active];

  return (
    <section id="days" data-nav="dark" aria-labelledby="days-title" className="bg-night py-[14vh] text-canvas">
      <div className="gutter flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-canvas/55">(05) Days on safari</p>
          <RevealLines as="h2" className="d-lg mt-6" lines={["Up before", <>the <em key="s">sun</em></>]} />
          <span id="days-title" className="sr-only">
            Days on safari
          </span>
        </div>
        <p className="max-w-[34ch] text-[1rem] leading-relaxed text-canvas/70 md:text-right">
          Every day is yours to shape with your guide. These are the moments guests ask for most.
        </p>
      </div>

      <div className="gutter mt-[8vh] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* the light table */}
        <div className="relative rounded-[4px] p-5 lg:col-span-6" style={{ background: "radial-gradient(120% 100% at 50% 40%, #FFF7E6 0%, #F2E3C4 60%, #DCC79F 100%)", boxShadow: "inset 0 0 60px rgba(255,240,210,0.7), 0 30px 80px -40px rgba(0,0,0,0.8)" }}>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {xs.map((x, i) => {
              const on = i === active;
              return (
                <li key={x.id}>
                  <motion.button
                    type="button"
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={`${x.name}, ${x.when}`}
                    className="relative block w-full rounded-[6px] bg-[#F6F1E6] p-[9%] text-left"
                    animate={{ y: on ? -8 : 0, rotate: on ? 0 : (i % 2 ? 1.2 : -1.2), boxShadow: on ? "0 26px 40px -22px rgba(21,18,13,0.6)" : "0 6px 12px -8px rgba(21,18,13,0.35)" }}
                    transition={{ duration: 0.5, ease: EASE_EXPO }}
                  >
                    <span className="relative block aspect-[3/2] overflow-hidden bg-night">
                      <Image src={x.image.src} alt="" fill sizes="(min-width:1024px) 15vw, 45vw" className="object-cover" />
                    </span>
                    <span className="mt-2 flex items-baseline justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-night/70">
                      <span>Upeo · {pad(i + 1)}</span>
                      <span>{x.when}</span>
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* the viewer */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-[14vh]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[2px] bg-black">
              <AnimatePresence initial={false}>
                <motion.div key={a.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE_EXPO }}>
                  <Image src={a.image.src} alt={a.image.alt} fill sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="label absolute left-3 top-3 text-canvas/80">{a.when}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE_EXPO }} className="mt-6" aria-live="polite">
                <h3 className="d-md">{a.name}</h3>
                <p className="mt-3 max-w-[48ch] text-[1rem] leading-relaxed text-canvas/75">{a.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
