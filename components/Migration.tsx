"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site, type Month } from "@/config/site";
import { usePlan } from "@/lib/plan";
import { useLenis, useScrollTo } from "@/lib/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/useMedia";
import { EASE_EXPO } from "@/lib/utils";

/*
 * THE GREAT MIGRATION: the year on one pinned page. Scroll and the months
 * turn; a herd of ~1,500 particles walks the Mara–Serengeti loop on a drawn
 * map, crossing the Mara River from July to October. Alongside: where the
 * herds are, what to come for, and which season (and rate) it falls in.
 * Approximate: the herds follow the rain, not the calendar.
 */

const MONTHS = site.migration;

// map coordinates (viewBox 0 0 600 520) for each region the herds pass through
const PLACES = [
  { name: "Ndutu · southern plains", x: 432, y: 448, spread: 52 },
  { name: "Central Serengeti", x: 330, y: 352, spread: 46 },
  { name: "Western corridor · Grumeti", x: 168, y: 330, spread: 40 },
  { name: "Northern Serengeti", x: 330, y: 246, spread: 34 },
  { name: "Maasai Mara", x: 352, y: 140, spread: 44 },
];
const CAMP = { x: 418, y: 108 };
const CROSSINGS = [
  { x: 316, y: 214 },
  { x: 338, y: 196 },
  { x: 296, y: 226 },
];
const SEASON_COLOUR: Record<Month["season"], string> = { green: "#7E8A52", shoulder: "#C8A35A", high: "#A8361F" };
const SEASON_NAME: Record<Month["season"], string> = { green: "Green season", shoulder: "Shoulder season", high: "High season" };

function Herd({ monthF }: { monthF: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const N = window.innerWidth < 768 ? 900 : 1500;
    // stable gaussian offsets per animal
    let seed = 99;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
    const ox = Float32Array.from({ length: N }, () => gauss());
    const oy = Float32Array.from({ length: N }, () => gauss() * 0.7);
    const speed = Float32Array.from({ length: N }, () => 0.025 + rnd() * 0.05);
    const px = new Float32Array(N), py = new Float32Array(N);

    const target = (f: number) => {
      const a = Math.floor(f) % 12, b = (a + 1) % 12, t = f - Math.floor(f);
      const A = PLACES[MONTHS[a].where], B = PLACES[MONTHS[b].where];
      const e = t * t * (3 - 2 * t);
      return { x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e, s: A.spread + (B.spread - A.spread) * e };
    };
    const init = target(monthF.get());
    for (let i = 0; i < N; i++) {
      px[i] = init.x + ox[i] * init.s;
      py[i] = init.y + oy[i] * init.s;
    }

    let W = 0, H = 0, scale = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      scale = W / 600;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) loop();
    });
    io.observe(canvas);

    let t = 0;
    const frame = () => {
      t += 1;
      const T = target(monthF.get());
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(21,18,13,0.78)";
      for (let i = 0; i < N; i++) {
        const tx = T.x + ox[i] * T.s + Math.sin(t * 0.01 + i) * 1.2;
        const ty = T.y + oy[i] * T.s + Math.cos(t * 0.013 + i * 1.7) * 1.2;
        px[i] += (tx - px[i]) * speed[i];
        py[i] += (ty - py[i]) * speed[i];
        ctx.fillRect(px[i] * scale, py[i] * scale, 1.6, 1.6);
      }
    };
    const loop = () => {
      cancelAnimationFrame(raf);
      const tick = () => {
        if (!visible) return;
        frame();
        raf = requestAnimationFrame(tick);
      };
      if (reduce) {
        // settle instantly, draw once per change
        for (let k = 0; k < 120; k++) frame();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    loop();
    const unsub = reduce ? monthF.on("change", () => loop()) : undefined;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsub?.();
    };
  }, [monthF, reduce]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function MapArt({ crossing }: { crossing: boolean }) {
  const ink = "#15120D";
  return (
    <svg viewBox="0 0 600 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Lake Victoria */}
      <path d="M0,150 C40,170 70,220 62,270 C56,320 80,370 40,420 L0,440 Z" fill="#9FA58F" opacity="0.35" />
      <text x="16" y="300" className="font-serif text-[15px] italic" fill={ink} opacity="0.5">Lake Victoria</text>
      {/* ecosystem outline */}
      <path d="M120,300 C150,250 230,215 300,205 C330,120 360,60 430,52 C500,60 520,130 500,200 C560,260 560,380 500,470 C430,510 300,500 230,450 C150,410 100,360 120,300 Z" fill="none" stroke={ink} strokeOpacity="0.25" strokeDasharray="2 5" />
      {/* national border */}
      <path d="M60,168 L580,330" stroke={ink} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="8 6" />
      <text x="520" y="292" textAnchor="end" className="font-mono text-[10px] uppercase tracking-[0.12em]" fill={ink} opacity="0.55" transform="rotate(17.3 520 292)">Kenya</text>
      <text x="530" y="330" textAnchor="end" className="font-mono text-[10px] uppercase tracking-[0.12em]" fill={ink} opacity="0.55" transform="rotate(17.3 530 330)">Tanzania</text>
      {/* rivers */}
      <path d="M480,30 C440,70 420,110 380,150 C350,180 330,200 316,214 C290,240 230,250 160,250 C110,250 80,252 62,262" fill="none" stroke="#4E6A72" strokeWidth="2" opacity="0.75" />
      <text x="430" y="76" className="font-serif text-[13px] italic" fill="#4E6A72">Mara River</text>
      <path d="M70,332 C140,326 220,332 300,326" fill="none" stroke="#4E6A72" strokeWidth="1.5" opacity="0.6" />
      <text x="200" y="320" className="font-serif text-[12px] italic" fill="#4E6A72">Grumeti</text>
      {/* places */}
      {PLACES.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="2.2" fill={ink} opacity="0.45" />
          <text x={p.x + 8} y={p.y + 4} className="font-mono text-[9px] uppercase tracking-[0.1em]" fill={ink} opacity="0.55">
            {p.name}
          </text>
        </g>
      ))}
      {/* crossing points, live from July to October */}
      {CROSSINGS.map((c, i) => (
        <g key={i} opacity={crossing ? 1 : 0} style={{ transition: "opacity 0.6s" }}>
          <circle cx={c.x} cy={c.y} r="9" fill="none" stroke="#A8361F" strokeWidth="1.2">
            <animate attributeName="r" values="4;14;4" dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={c.x} cy={c.y} r="2.5" fill="#A8361F" />
        </g>
      ))}
      {/* the camp */}
      <g>
        <path d={`M${CAMP.x - 7},${CAMP.y + 5} A7,7 0 0 1 ${CAMP.x + 7},${CAMP.y + 5}`} fill="none" stroke="#A8361F" strokeWidth="1.6" />
        <path d={`M${CAMP.x - 11},${CAMP.y + 5} H${CAMP.x + 11}`} stroke="#A8361F" strokeWidth="1.6" />
        <text x={CAMP.x + 16} y={CAMP.y + 6} className="font-serif text-[16px]" fill="#A8361F">
          Upeo
        </text>
      </g>
      <text x="590" y="510" textAnchor="end" className="font-mono text-[9px] uppercase tracking-[0.12em]" fill={ink} opacity="0.45">
        Approximate · the herds follow the rain
      </text>
    </svg>
  );
}

export default function Migration() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { setMonth } = usePlan();
  const scrollTo = useScrollTo();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // continuous month: holds on each month briefly, then walks to the next
  const monthF = useTransform(p, (v) => {
    const x = Math.min(11.999, Math.max(0, v * 12));
    const k = Math.floor(x), t = x - k;
    const walk = Math.max(0, (t - 0.45) / 0.55);
    return k + walk * walk * (3 - 2 * walk);
  });
  const [i, setI] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const k = Math.min(11, Math.max(0, Math.floor(v * 12)));
    if (k !== i) setI(k);
  });
  const m = MONTHS[i];
  const crossing = i >= 6 && i <= 9; // Jul–Oct
  // reduced motion: no scroll-scrubbing; months are chosen from the ruler instead
  const manual = useMotionValue(0);
  const lenis = useLenis();
  const pickMonth = (k: number) => {
    if (reduce) {
      setI(k);
      manual.set(k);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((k + 0.25) / 12) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y });
  };

  return (
    <section ref={ref} id="migration" data-nav="light" aria-labelledby="mig-title" className="relative bg-dust" style={{ height: reduce ? "auto" : "1250svh" }}>
      <div className={`${reduce ? "" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        <div className="gutter grid h-full grid-cols-1 content-start gap-4 pb-[calc(var(--gutter)+3.5rem)] pt-[5.5rem] md:grid-cols-12 md:content-stretch md:gap-6 md:pt-[6rem]">
          {/* map */}
          <div className="relative md:col-span-7 md:row-span-2">
            <p className="label text-umber">(03) The Great Migration</p>
            <div className="relative mx-auto mt-3 aspect-[600/520] max-h-[40svh] w-full md:mt-4 md:max-h-[74svh]">
              <MapArt crossing={crossing} />
              <Herd monthF={reduce ? manual : monthF} />
            </div>
          </div>

          {/* the month */}
          <div className="flex flex-col md:col-span-5 md:col-start-8 md:justify-center">
            <h2 id="mig-title" className="sr-only">
              The Great Migration, month by month
            </h2>
            <div className="relative h-[clamp(4.5rem,11vw,11rem)] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={m.m}
                  className="absolute inset-x-0 top-0 font-serif text-[clamp(4rem,10vw,10.5rem)] font-[300] italic leading-[1] tracking-[-0.04em]"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: EASE_EXPO }}
                >
                  {m.m}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={m.m} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: EASE_EXPO }}>
                <p className="d-md mt-2">{m.headline}</p>
                <p className="mt-4 max-w-[42ch] text-[0.98rem] leading-relaxed text-night/80">{m.body}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-night/20 pt-4">
                  <div>
                    <dt className="label text-umber">Come for</dt>
                    <dd className="mt-1 font-serif text-[1.25rem]">{m.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="label text-umber">Season</dt>
                    <dd className="mt-1 flex items-center gap-2 font-serif text-[1.25rem]">
                      <span className="inline-block h-2.5 w-2.5" style={{ background: SEASON_COLOUR[m.season] }} />
                      {SEASON_NAME[m.season]}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setMonth(i);
                    scrollTo("#plan");
                  }}
                  className="label mt-6 inline-flex items-center gap-2 border-b border-night/40 pb-1 hover:border-shuka hover:text-shuka"
                >
                  Plan a safari in {m.m} →
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* the year as a ruler */}
        <div className="gutter absolute inset-x-0 bottom-[var(--gutter)]">
          <ol className="grid grid-cols-12 gap-[2px]" aria-label="Months and seasons">
            {MONTHS.map((x, k) => (
              <li key={x.m}>
                <button type="button" onClick={() => pickMonth(k)} aria-current={k === i ? "true" : undefined} aria-label={`${x.m}, ${SEASON_NAME[x.season]}`} className="group flex w-full flex-col gap-1.5">
                  <span className="block h-1.5 w-full transition-opacity duration-500 group-hover:opacity-80" style={{ background: SEASON_COLOUR[x.season], opacity: k === i ? 1 : 0.35 }} />
                  <span className={`label text-center transition-colors duration-500 ${k === i ? "text-night" : "text-night/45"}`}>{x.short}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
