"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { useLenis, useScrollTo } from "@/lib/smooth-scroll";
import { maraTime, whatsappLink, helloMessage } from "@/lib/contact";
import { EASE_EXPO, pad } from "@/lib/utils";
import Mark from "./ui/Mark";
import menuImage from "@/assets/images/giraffe-sun.jpg";

/** Header that adapts to the section beneath it (`data-nav`), with live Mara time and a full-screen menu. */
export default function Navigation() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [time, setTime] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 80));

  useEffect(() => {
    const tick = () => setTime(maraTime());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setTheme((e.target as HTMLElement).dataset.nav === "dark" ? "dark" : "light")),
      { rootMargin: "0px 0px -96% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const f = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a,button"));
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      trigger.current?.focus();
    };
  }, [open, lenis]);

  const go = (href: string) => {
    const was = open;
    setOpen(false);
    window.setTimeout(() => scrollTo(href), was ? 450 : 0);
  };
  const dark = theme === "dark" && !open;

  return (
    <>
      <a href="#camp" className="fixed left-4 top-4 z-[120] -translate-y-24 bg-night px-4 py-2 text-canvas focus:translate-y-0">
        Skip to content
      </a>
      <header className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-700 ${dark ? "text-canvas" : "text-night"}`}>
        <div
          className={`absolute inset-0 -z-10 transition-opacity duration-700 ${compact && !open ? "opacity-100" : "opacity-0"} ${
            dark ? "bg-gradient-to-b from-night/60 to-transparent" : "bg-gradient-to-b from-canvas/85 to-transparent"
          }`}
        />
        <div className="gutter flex h-[4.75rem] items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="flex items-center gap-3"
            aria-label={`${site.name}, back to top`}
          >
            <Mark className="h-4 w-auto" />
            <span className="font-serif text-[1.35rem] font-[420] tracking-[0.32em]">{site.wordmark}</span>
          </a>
          <p className="label hidden items-center gap-3 lg:flex">
            <span className="opacity-60">Maasai Mara</span>
            <span className="tabular-nums">{time ?? "--:--"}</span>
            <span className="opacity-60">EAT</span>
          </p>
          <div className="flex items-center gap-5 md:gap-7">
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex gap-6 text-[0.82rem]">
                {site.nav.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(n.href);
                      }}
                      className="group relative py-2"
                    >
                      {n.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button ref={trigger} type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-[0.82rem] md:hidden">
              {open ? "Close" : "Menu"}
              <span aria-hidden="true" className="relative block h-2 w-5">
                <motion.span className="absolute left-0 top-0 h-px w-full bg-current" animate={{ y: open ? 4 : 0, rotate: open ? 45 : 0 }} />
                <motion.span className="absolute bottom-0 left-0 h-px w-full bg-current" animate={{ y: open ? -3.5 : 0, rotate: open ? -45 : 0 }} />
              </span>
            </button>
            <a
              href="#plan"
              onClick={(e) => {
                e.preventDefault();
                go("#plan");
              }}
              className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-shuka px-5 text-[0.82rem] text-canvas"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-night transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
              <span className="relative">Plan a safari</span>
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="canvas-tex fixed inset-0 z-[95] flex flex-col text-night"
            initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(50% 0% 50% 0%)" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="h-[4.75rem]" />
            <div className="gutter flex flex-1 items-center gap-10">
              <nav aria-label="Menu" className="flex-1">
                <ul>
                  {[...site.nav, { label: "Plan your safari", href: "#plan" }].map((n, i) => (
                    <li key={n.href} className="overflow-hidden">
                      <motion.a
                        href={n.href}
                        onClick={(e) => {
                          e.preventDefault();
                          go(n.href);
                        }}
                        className="group flex items-baseline gap-4 py-1"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.25 + i * 0.05 }}
                      >
                        <span className="label w-6 text-ash">{pad(i + 1)}</span>
                        <span className="font-serif text-[clamp(2.6rem,min(9vw,10svh),7rem)] font-[330] leading-[1] tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2 group-hover:italic">
                          {n.label}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>
              <motion.div
                className="relative hidden aspect-[3/4] h-[62svh] overflow-hidden rounded-t-full md:block"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.3 }}
              >
                <Image src={menuImage} alt="A giraffe silhouetted against the setting sun" fill sizes="30vw" className="object-cover" />
              </motion.div>
            </div>
            <div className="gutter label flex flex-wrap justify-between gap-4 pb-[var(--gutter)] pt-6 text-ash">
              <a className="hover:text-night" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer">
                WhatsApp {site.contact.phone}
              </a>
              <a className="hover:text-night" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              <span>{site.contact.coordinates}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
