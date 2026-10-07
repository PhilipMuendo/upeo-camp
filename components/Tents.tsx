"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { site, usd, type Tent } from "@/config/site";
import { usePlan } from "@/lib/plan";
import { useScrollTo } from "@/lib/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/useMedia";
import { pad } from "@/lib/utils";
import { RevealLines } from "./ui/Reveal";

/*
 * THE TENTS: each tent's photograph waits behind two canvas flaps, stitched
 * and tied at the middle. Scroll and the ties loosen, the flaps draw back,
 * and you're looking inside.
 */

function Flap({ side, open }: { side: "left" | "right"; open: MotionValue<string> }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`canvas-tex absolute inset-y-0 z-10 w-1/2 ${side === "left" ? "left-0 origin-left" : "right-0 origin-right"}`}
      style={{ x: open, boxShadow: side === "left" ? "inset -18px 0 30px -18px rgba(21,18,13,0.25)" : "inset 18px 0 30px -18px rgba(21,18,13,0.25)" }}
    >
      {/* stitched hem along the opening edge */}
      <div className={`absolute inset-y-0 w-px ${side === "left" ? "right-3" : "left-3"}`} style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(107,82,53,0.6) 0 8px, transparent 8px 14px)" }} />
      {/* canvas folds */}
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 46px, rgba(107,82,53,0.06) 46px 48px, transparent 48px 96px)" }} />
      {/* leather tie */}
      <div className={`absolute top-1/2 h-10 w-3 -translate-y-1/2 rounded-full bg-umber ${side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`} />
    </motion.div>
  );
}

function TentStory({ tent, i }: { tent: Tent; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { setTentId } = usePlan();
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.5"] });
  const leftX = useTransform(scrollYProgress, [0.15, 1], ["0%", "-101%"]);
  const rightX = useTransform(scrollYProgress, [0.15, 1], ["0%", "101%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const flip = i % 2 === 1;

  return (
    <article ref={ref} aria-labelledby={`tent-${tent.id}`} className="gutter grid grid-cols-1 items-center gap-10 border-t border-night/15 py-[10vh] md:grid-cols-12 md:gap-6">
      <div className={`relative aspect-[4/3] overflow-hidden bg-dust md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
        <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : imgScale }}>
          <Image src={tent.image.src} alt={tent.image.alt} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" placeholder="blur" />
        </motion.div>
        {!reduce && (
          <>
            <Flap side="left" open={leftX} />
            <Flap side="right" open={rightX} />
          </>
        )}
      </div>

      <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
        <p className="label text-ash">
          Tent {pad(i + 1)} · {tent.facing}
        </p>
        <h3 id={`tent-${tent.id}`} className="d-xl mt-4">
          {tent.name}
        </h3>
        <p className="mt-2 font-serif text-[1.5rem] font-[330] italic text-umber">&ldquo;{tent.gloss}&rdquo;</p>
        <p className="mt-6 max-w-[38ch] text-[1.02rem] leading-relaxed text-night/80">{tent.line}</p>
        <dl className="mt-8 grid grid-cols-3 border-t border-night/15 pt-4">
          {[
            ["Sleeps", tent.sleeps],
            ["Size", tent.size],
            ["From", `${usd(tent.rate)}`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-ash">{k}</dt>
              <dd className="mt-1 text-[0.98rem]">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-6 space-y-1.5">
          {tent.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-[0.95rem]">
              <span aria-hidden="true" className="h-px w-4 bg-shuka" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setTentId(tent.id);
              scrollTo("#plan");
            }}
            className="inline-flex h-12 items-center rounded-full bg-night px-6 text-[0.85rem] text-canvas transition-colors hover:bg-shuka"
          >
            Enquire about {tent.name}
          </button>
          <div className="relative hidden h-16 w-24 overflow-hidden lg:block">
            <Image src={tent.detail.src} alt={tent.detail.alt} fill sizes="96px" className="object-cover" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Tents() {
  return (
    <section id="tents" data-nav="light" aria-labelledby="tents-title" className="canvas-tex relative pb-[10vh]">
      <div className="gutter flex flex-col gap-6 pb-[6vh] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-ash">(02) The tents</p>
          <RevealLines as="h2" className="d-lg mt-6" lines={["Canvas,", <>not <em key="c">concrete</em></>]} />
          <span id="tents-title" className="sr-only">
            The tents
          </span>
        </div>
        <p className="max-w-[34ch] text-[1rem] leading-relaxed text-night/75 md:text-right">
          Four kinds of tent, all raised on timber decks, all facing out. Rates per person per night sharing, all-inclusive{site.ratesPlaceholder ? " · indicative" : ""}.
        </p>
      </div>
      {site.tents.map((t, i) => (
        <TentStory key={t.id} tent={t} i={i} />
      ))}
    </section>
  );
}
