"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { site } from "@/config/site";
import { useScrollTo } from "@/lib/smooth-scroll";
import { whatsappLink, helloMessage } from "@/lib/contact";
import { EASE_EXPO } from "@/lib/utils";
import Mark from "./ui/Mark";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  const scrollTo = useScrollTo();

  return (
    <footer data-nav="dark" className="bg-night pt-[10vh] text-canvas" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        {site.name}: contact
      </h2>
      {/* the horizon, one more time */}
      <div ref={ref} aria-hidden="true" className="gutter">
        <div className="relative flex items-end justify-between">
          {site.wordmark.split("").map((ch, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block font-serif text-[clamp(5rem,24vw,26rem)] font-[300] leading-[0.78] tracking-[-0.02em]"
                initial={{ y: "100%" }}
                animate={on ? { y: "0%" } : undefined}
                transition={{ duration: 1.3, ease: EASE_EXPO, delay: i * 0.08 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </div>
        <motion.div className="h-px origin-left bg-canvas/40" initial={{ scaleX: 0 }} animate={on ? { scaleX: 1 } : undefined} transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.4 }} />
      </div>

      <div className="gutter mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <Mark className="h-5 w-auto text-shuka" />
          <p className="mt-5 max-w-[30ch] text-[0.98rem] leading-relaxed text-canvas/70">{site.contact.location}.</p>
        </div>
        <div className="label space-y-2 text-canvas/70 md:col-span-2 md:col-start-6">
          <p className="text-canvas/40">Talk</p>
          <a className="block hover:text-canvas" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="block hover:text-canvas" href={site.contact.phoneHref}>
            {site.contact.phone}
          </a>
          <a className="block break-all hover:text-canvas" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>
        <nav aria-label="Footer" className="label space-y-2 text-canvas/70 md:col-span-2">
          <p className="text-canvas/40">Explore</p>
          {[...site.nav, { label: "Plan", href: "#plan" }].map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(n.href);
              }}
              className="block hover:text-canvas"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="label space-y-2 text-canvas/70 md:col-span-2">
          <p className="text-canvas/40">Follow</p>
          {site.social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="block hover:text-canvas">
              {s.label}
            </a>
          ))}
        </div>
        <div className="label space-y-2 text-canvas/70 md:col-span-2">
          <p className="text-canvas/40">Find us</p>
          <p>{site.contact.coordinates}</p>
          <p>Narok County, Kenya</p>
        </div>
      </div>
      <div className="gutter label mt-14 flex flex-col gap-2 border-t border-canvas/10 py-5 text-canvas/40 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Maasai Mara tented camp · Great Migration safaris · Kenya</p>
        <a href="#" className="hover:text-canvas">
          Privacy
        </a>
      </div>
    </footer>
  );
}
