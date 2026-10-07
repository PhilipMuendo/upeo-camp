"use client";

import { motion } from "motion/react";
import { site, usd } from "@/config/site";
import { EASE_EXPO } from "@/lib/utils";
import { RevealLines } from "./ui/Reveal";

const COLOUR: Record<string, string> = { green: "#7E8A52", shoulder: "#C8A35A", high: "#A8361F" };

/** RATES: honest, readable, per person per night sharing, by season. */
export default function Rates() {
  const seasons = site.seasons;
  return (
    <section id="rates" data-nav="light" aria-labelledby="rates-title" className="canvas-tex py-[14vh]">
      <div className="gutter grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className="label text-ash">(07) Rates &amp; seasons</p>
          <RevealLines as="h2" className="d-lg mt-6" lines={["What it", <><em key="c">costs</em></>]} />
          <span id="rates-title" className="sr-only">
            Rates and seasons
          </span>
          <p className="mt-6 max-w-[34ch] text-[1rem] leading-relaxed text-night/75">
            Per person per night, sharing, all-inclusive. Children under 16 sharing with adults pay half. Single travellers pay no supplement in green season.
          </p>
          {site.ratesPlaceholder && <p className="label mt-6 text-ash">Rates and policies shown are placeholders.</p>}
        </div>

        <div className="md:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">Rates in US dollars per person per night by tent and season</caption>
              <thead>
                <tr className="border-b border-night/20">
                  <th scope="col" className="label py-4 pr-4 font-normal text-ash">
                    Tent
                  </th>
                  {seasons.map((s) => (
                    <th key={s.id} scope="col" className="py-4 pr-4 text-right align-bottom font-normal">
                      <span className="flex items-center justify-end gap-2">
                        <span className="inline-block h-2 w-2" style={{ background: COLOUR[s.id] }} />
                        <span className="font-serif text-[1.15rem]">{s.name}</span>
                      </span>
                      <span className="label mt-1 block text-ash">{s.months}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {site.tents.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    className="border-b border-night/12"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease: EASE_EXPO, delay: i * 0.06 }}
                  >
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <span className="font-serif text-[1.6rem] leading-none">{t.name}</span>
                      <span className="label ml-3 text-ash">sleeps {t.sleeps}</span>
                    </th>
                    {seasons.map((s) => (
                      <td key={s.id} className="py-5 pr-4 text-right font-mono text-[0.95rem] tabular-nums">
                        {usd(Math.round((t.rate * s.factor) / 10) * 10)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <p className="label text-ash">Included</p>
              <ul className="mt-4 space-y-2">
                {site.included.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.98rem]">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-shuka" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-ash">Not included</p>
              <ul className="mt-4 space-y-2 text-night/75">
                {site.extras.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.98rem]">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-night/30" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
