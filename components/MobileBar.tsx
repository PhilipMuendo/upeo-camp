"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { useScrollTo } from "@/lib/smooth-scroll";
import { whatsappLink, helloMessage } from "@/lib/contact";
import { WhatsAppIcon } from "./ui/Mark";

/** Phones only: WhatsApp + Plan, after the hero, hidden while the planner is on screen. */
export default function MobileBar() {
  const scrollTo = useScrollTo();
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [near, setNear] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setPast(v > window.innerHeight * 2.4));
  useEffect(() => {
    const el = document.getElementById("plan");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "0px 0px 20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <AnimatePresence>
      {past && !near && (
        <motion.div
          className="fixed inset-x-3 bottom-3 z-[80] flex gap-2 rounded-full bg-night/90 p-1.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur md:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <a href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[0.85rem] text-canvas">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href="#plan"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#plan");
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-shuka text-[0.85rem] text-canvas"
          >
            Plan a safari
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
