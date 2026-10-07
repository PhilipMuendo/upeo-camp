"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import { site, type Sighting } from "@/config/site";
import { useFinePointer } from "@/lib/useMedia";
import { EASE_EXPO } from "@/lib/utils";
import { RevealLines } from "./ui/Reveal";

/*
 * FIELD JOURNAL: a week of sightings as prints taped into the guides'
 * notebook, captioned by hand. On desktop the prints are loose: pick them up
 * and move them around. On touch they line up in a strip.
 */

// resting positions on the page (percent) and tilt
const LAYOUT = [
  { x: 4, y: 6, r: -5 },
  { x: 34, y: 2, r: 3 },
  { x: 66, y: 8, r: -2 },
  { x: 12, y: 48, r: 4 },
  { x: 44, y: 46, r: -4 },
  { x: 72, y: 50, r: 2.5 },
];

function Print({ s, i, drag, constraints, onLift, z }: { s: Sighting; i: number; drag: boolean; constraints: RefObject<HTMLDivElement | null>; onLift: () => void; z: number }) {
  const L = LAYOUT[i % LAYOUT.length];
  return (
    <motion.figure
      className="absolute w-[27%] cursor-grab touch-none select-none bg-[#FBF7EF] p-3 pb-4 shadow-[0_18px_40px_-18px_rgba(21,18,13,0.45)] active:cursor-grabbing"
      style={{ left: `${L.x}%`, top: `${L.y}%`, rotate: L.r, zIndex: z }}
      drag={drag}
      dragConstraints={constraints}
      dragElastic={0.08}
      dragMomentum={false}
      onPointerDown={onLift}
      whileDrag={{ scale: 1.05, rotate: 0, boxShadow: "0 40px 70px -30px rgba(21,18,13,0.55)" }}
      initial={{ opacity: 0, y: 40, rotate: L.r * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: L.r }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE_EXPO, delay: i * 0.08 }}
    >
      {/* tape */}
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#E8DDC4]/85 shadow-sm" />
      <div className="pointer-events-none relative aspect-[4/3] overflow-hidden">
        <Image src={s.image.src} alt={s.image.alt} fill sizes="25vw" className="object-cover" draggable={false} />
      </div>
      <figcaption className="pointer-events-none mt-3">
        <p className="label text-ash">
          {s.day} · {s.time} · {s.where}
        </p>
        <p className="hand mt-1 text-[1.35rem] leading-[1.05] text-night">{s.note}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function Journal() {
  const fine = useFinePointer();
  const page = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(site.sightings.map((_, i) => i));
  const lift = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  return (
    <section id="journal" data-nav="light" aria-labelledby="journal-title" className="canvas-tex py-[14vh]">
      <div className="gutter flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-ash">(04) From the field journal</p>
          <RevealLines as="h2" className="d-lg mt-6" lines={["This week,", <>on the <em key="c">plains</em></>]} />
          <span id="journal-title" className="sr-only">
            Recent sightings from the field journal
          </span>
        </div>
        <p className="max-w-[34ch] text-[1rem] leading-relaxed text-night/75 md:text-right">
          The guides keep a notebook in the mess tent. Every sighting goes in it, every evening, by the fire.
          {fine && <span className="hand ml-1 text-[1.25rem] text-shuka"> Pick the prints up.</span>}
        </p>
      </div>

      {/* desktop: loose prints on a notebook page */}
      <div className="gutter mt-[8vh] hidden md:block">
        <div
          ref={page}
          className="relative h-[86svh] max-h-[52rem] overflow-hidden rounded-[3px] bg-[#F4ECDD]"
          style={{
            backgroundImage: "repeating-linear-gradient(180deg, transparent 0 31px, rgba(78,106,114,0.18) 31px 32px), linear-gradient(90deg, transparent 0 7%, rgba(168,54,31,0.35) 7% calc(7% + 1px), transparent calc(7% + 1px))",
          }}
        >
          <p className="hand absolute bottom-6 right-8 text-[1.6rem] text-night/50" aria-hidden="true">
            sightings log · week 32
          </p>
          {site.sightings.map((s, i) => (
            <Print key={i} s={s} i={i} drag={fine} constraints={page} onLift={() => lift(i)} z={order.indexOf(i) + 1} />
          ))}
        </div>
      </div>

      {/* touch: a strip */}
      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 pt-4 md:hidden">
        {site.sightings.map((s, i) => (
          <li key={i} className="w-[76vw] shrink-0 snap-center bg-[#FBF7EF] p-3 pb-4 shadow-[0_18px_40px_-18px_rgba(21,18,13,0.45)]" style={{ rotate: `${LAYOUT[i].r * 0.5}deg` }}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="76vw" className="object-cover" />
            </div>
            <p className="label mt-3 text-ash">
              {s.day} · {s.time} · {s.where}
            </p>
            <p className="hand mt-1 text-[1.35rem] leading-[1.05]">{s.note}</p>
          </li>
        ))}
      </ul>
      {site.sightingsPlaceholder && <p className="gutter label mt-6 text-ash">Sample entries for illustration. Replace with the camp&apos;s real sightings.</p>}
    </section>
  );
}
