"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { site, usd } from "@/config/site";
import { usePlan } from "@/lib/plan";
import { whatsappLink } from "@/lib/contact";
import { EASE_EXPO } from "@/lib/utils";
import { WhatsAppIcon } from "./ui/Mark";
import { RevealLines } from "./ui/Reveal";

/*
 * PLAN YOUR SAFARI: not a form, a sentence. Fill in the blanks of
 * "We'd love to come in … for … nights …" and the camp sees exactly what you
 * want, with an indicative price for your party. Send it on WhatsApp or by email.
 */

const INTERESTS = ["the migration", "big cats", "walking safaris", "a balloon flight", "photography", "a honeymoon"];
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function Blank({ children }: { children: ReactNode }) {
  return <span className="relative inline-flex items-baseline whitespace-nowrap border-b-2 border-shuka/70 px-1 text-shuka">{children}</span>;
}

function Count({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <Blank>
      <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="px-1 font-sans text-[0.6em] text-night/50 hover:text-shuka disabled:opacity-25">
        −
      </button>
      <span className="tabular-nums" aria-live="polite" aria-label={`${value} ${label}`}>
        {value}
      </span>
      <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="px-1 font-sans text-[0.6em] text-night/50 hover:text-shuka disabled:opacity-25">
        +
      </button>
    </Blank>
  );
}

function Pick({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; label: string }) {
  const id = useId();
  const shown = options.find((o) => o.v === value)?.l ?? "";
  // the visible word sizes the blank; a transparent native select sits on top of it,
  // so it stays fully accessible and uses the platform picker on phones
  return (
    <Blank>
      <span aria-hidden="true">{shown}</span>
      <span aria-hidden="true" className="ml-1 font-sans text-[0.38em] opacity-70">
        ▾
      </span>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0">
        {options.map((o) => (
          <option key={o.v} value={o.v} className="text-[1rem] text-night">
            {o.l}
          </option>
        ))}
      </select>
    </Blank>
  );
}

export default function Planner() {
  const plan = usePlan();
  const [month, setMonth] = useState<string>("7");
  const [nights, setNights] = useState(4);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tent, setTent] = useState<string>(site.tents[0].id);
  const [likes, setLikes] = useState<string[]>(["the migration"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // prefill from "Enquire about this tent" / "Plan a safari in <month>"
  useEffect(() => {
    if (plan.tentId) setTent(plan.tentId);
  }, [plan.tentId]);
  useEffect(() => {
    if (plan.month !== null) setMonth(String(plan.month));
  }, [plan.month]);

  const t = site.tents.find((x) => x.id === tent) ?? site.tents[0];
  const m = month === "any" ? null : site.migration[Number(month)];
  const factor = m ? site.seasons.find((s) => s.id === m.season)?.factor ?? 1 : 1;
  const nightly = Math.round((t.rate * factor) / 10) * 10;
  const total = nightly * nights * (adults + children * 0.5);

  const sentence = useMemo(() => {
    const parts = [
      `Hello ${site.name}! We'd love to come ${m ? `in ${m.m}` : "when the time is right"} for ${nights} nights, ${adults} adult${adults === 1 ? "" : "s"}${children ? ` and ${children} child${children === 1 ? "" : "ren"}` : ""}, staying in ${t.name}.`,
    ];
    if (likes.length) parts.push(`We're most excited about ${likes.join(", ")}.`);
    if (note.trim()) parts.push(note.trim());
    if (name.trim()) parts.push(`— ${name.trim()}`);
    return parts.join(" ");
  }, [m, nights, adults, children, t, likes, note, name]);

  const toggle = (x: string) => setLikes((l) => (l.includes(x) ? l.filter((y) => y !== x) : [...l, x]));

  const send = async () => {
    setTouched(true);
    if (name.trim().length < 2 || !emailOk(email)) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: m?.m ?? "Flexible", nights, adults, children, tent: t.id, interests: likes, name, email, phone, note, website }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="plan" data-nav="light" aria-labelledby="plan-title" className="canvas-tex py-[16vh]">
      <div className="gutter">
        <p className="label text-ash">(09) Plan your safari</p>
        <RevealLines as="h2" className="d-lg mt-6" lines={["Tell us about", <>your <em key="t">trip</em></>]} />
        <span id="plan-title" className="sr-only">
          Plan your safari
        </span>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          noValidate
          className="mt-[8vh]"
        >
          <p className="max-w-[30ch] font-serif text-[clamp(1.9rem,3.6vw,3.6rem)] font-[330] leading-[1.35] tracking-[-0.02em] md:max-w-[34ch]">
            We&apos;d love to come in{" "}
            <Pick
              label="Month"
              value={month}
              onChange={setMonth}
              options={[...site.migration.map((x, k) => ({ v: String(k), l: x.m })), { v: "any", l: "any month" }]}
            />{" "}
            for <Count label="nights" value={nights} min={2} max={14} onChange={setNights} /> nights, <Count label="adults" value={adults} min={1} max={8} onChange={setAdults} /> adults
            and <Count label="children" value={children} min={0} max={6} onChange={setChildren} /> children, staying in{" "}
            <Pick label="Tent" value={tent} onChange={setTent} options={site.tents.map((x) => ({ v: x.id, l: x.name }))} />. We&apos;re most excited about{" "}
            <span role="group" aria-label="Interests">
              {INTERESTS.map((x, k) => {
                const on = likes.includes(x);
                return (
                  <span key={x}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(x)}
                      className={`border-b-2 px-0.5 transition-colors duration-300 ${on ? "border-shuka/70 text-shuka" : "border-transparent text-night/30 hover:text-night/60"}`}
                    >
                      {x}
                    </button>
                    {k < INTERESTS.length - 2 ? ", " : k === INTERESTS.length - 2 ? " and " : "."}
                  </span>
                );
              })}
            </span>
          </p>

          <div className="mt-10 flex flex-col gap-2 border-t border-night/15 pt-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label text-ash">Indicative for your party{site.ratesPlaceholder ? " · placeholder rates" : ""}</p>
              <p className="mt-2 font-serif text-[clamp(2.4rem,4vw,3.8rem)] font-[330] leading-none tabular-nums">{usd(Math.round(total))}</p>
            </div>
            <p className="label text-ash md:text-right">
              {usd(nightly)} pp / night · {m ? `${m.m}, ${site.seasons.find((s) => s.id === m.season)?.name.toLowerCase()}` : "season to be confirmed"} · {t.name}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 bg-dust/60 p-6" role="status">
                <p className="font-serif text-[2rem] font-[330]">Asante sana{name ? `, ${name.split(" ")[0]}` : ""}.</p>
                <p className="mt-2 text-night/75">Your note is with the camp. A real person will write back with availability, flights and a full quote.</p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }} className="mt-10">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  {[
                    { id: "pl-name", label: "Your name", value: name, set: setName, type: "text", auto: "name", err: touched && name.trim().length < 2 ? "Please add your name" : "" },
                    { id: "pl-email", label: "Email", value: email, set: setEmail, type: "email", auto: "email", err: touched && !emailOk(email) ? "Enter a valid email" : "" },
                    { id: "pl-phone", label: "Phone or WhatsApp (optional)", value: phone, set: setPhone, type: "tel", auto: "tel", err: "" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="label text-ash">
                        {f.label}
                      </label>
                      <input
                        id={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        aria-invalid={!!f.err}
                        aria-describedby={f.err ? `${f.id}-err` : undefined}
                        className={`mt-1.5 block w-full rounded-none border-0 border-b bg-transparent py-2 text-[1.05rem] outline-none focus:border-night ${f.err ? "border-shuka" : "border-night/25"}`}
                      />
                      {f.err && (
                        <p id={`${f.id}-err`} className="label mt-1.5 text-shuka" role="alert">
                          {f.err}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-3">
                    <label htmlFor="pl-note" className="label text-ash">
                      Anything else? (optional)
                    </label>
                    <textarea id="pl-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 block w-full resize-none rounded-none border-0 border-b border-night/25 bg-transparent py-2 text-[1.05rem] outline-none focus:border-night" />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="submit" disabled={status === "sending"} className="inline-flex items-center justify-center rounded-full border border-night/30 px-6 py-3.5 text-[0.9rem] transition-colors hover:border-night disabled:opacity-50">
                    {status === "sending" ? "Sending…" : "Email the camp"}
                  </button>
                  <a
                    href={whatsappLink(sentence)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-night px-6 py-3.5 text-[0.9rem] text-canvas transition-colors hover:bg-shuka"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
                  </a>
                </div>
                {status === "error" && (
                  <p className="label mt-3 text-right text-shuka" role="alert">
                    Something went wrong. Please use WhatsApp or email {site.contact.email}.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
