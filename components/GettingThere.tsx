"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { site } from "@/config/site";
import { RevealLines } from "./ui/Reveal";

/*
 * GETTING THERE: Nairobi to the Mara as a single line. A light aircraft flies
 * the route as you scroll; the road route is drawn beneath it, dashed.
 */

const FLIGHT = "M470,120 C420,40 260,40 150,150";
const ROAD = "M470,120 C430,170 380,160 340,200 C300,240 230,230 180,190 C165,178 156,166 150,150";

export default function GettingThere() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [plane, setPlane] = useState({ x: 470, y: 120, a: -120 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const t = useTransform(scrollYProgress, [0.1, 0.9], [0, 1], { clamp: true });
  const drawn = useTransform(t, (v) => v);

  useMotionValueEvent(t, "change", (v) => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    const a = p.getPointAtLength(v * L);
    const b = p.getPointAtLength(Math.min(L, v * L + 1));
    setPlane({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
  });

  return (
    <section ref={ref} id="getting-there" data-nav="light" aria-labelledby="gt-title" className="bg-dust py-[14vh]">
      <div className="gutter grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <p className="label text-umber">(08) Getting here</p>
          <RevealLines as="h2" className="d-lg mt-6" lines={["Forty-five", <>minutes from <em key="n">Nairobi</em></>]} />
          <span id="gt-title" className="sr-only">
            Getting here
          </span>
          <dl className="mt-10 border-t border-night/20">
            {[
              ["By air", site.travel.flight],
              ["By road", site.travel.road],
              ["From the airstrip", site.contact.nearestAirstrip],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-night/15 py-4">
                <dt className="label pt-1 text-umber">{k}</dt>
                <dd className="text-[1rem] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="label mt-4 text-umber">Times are approximate. We book flights and road transfers for you.</p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <svg viewBox="0 0 600 300" className="h-auto w-full" role="img" aria-label="Route from Nairobi to the Maasai Mara, by air and by road">
            <path d={ROAD} fill="none" stroke="#15120D" strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 6" />
            <path ref={pathRef} d={FLIGHT} fill="none" stroke="none" />
            <motion.path d={FLIGHT} fill="none" stroke="#A8361F" strokeWidth="1.8" style={{ pathLength: drawn }} />
            {/* Rift Valley hint */}
            <path d="M330,60 C320,120 330,190 310,270" fill="none" stroke="#6B5235" strokeOpacity="0.35" strokeWidth="18" strokeLinecap="round" />
            <text x="300" y="290" className="font-mono text-[9px] uppercase tracking-[0.12em]" fill="#6B5235" opacity="0.7">Great Rift Valley</text>
            <g>
              <circle cx="470" cy="120" r="4" fill="#15120D" />
              <text x="482" y="124" className="font-serif text-[16px]" fill="#15120D">Nairobi</text>
              <text x="482" y="140" className="font-mono text-[9px] uppercase tracking-[0.12em]" fill="#15120D" opacity="0.6">Wilson Airport</text>
            </g>
            <g>
              <path d="M140,150 A10,10 0 0 1 160,150" fill="none" stroke="#A8361F" strokeWidth="1.6" />
              <path d="M134,150 H166" stroke="#A8361F" strokeWidth="1.6" />
              <text x="150" y="176" textAnchor="middle" className="font-serif text-[16px]" fill="#A8361F">Upeo · Mara</text>
            </g>
            {/* the aircraft */}
            <g transform={`translate(${plane.x} ${plane.y}) rotate(${plane.a})`}>
              <path d="M10,0 L-6,-3 L-10,-9 L-12,-9 L-9,-2 L-14,-1.5 L-16,-5 L-17.5,-5 L-16.5,0 L-17.5,5 L-16,5 L-14,1.5 L-9,2 L-12,9 L-10,9 L-6,3 Z" fill="#15120D" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
