import { NextResponse } from "next/server";
import { site } from "@/config/site";

/**
 * Safari enquiries. Validates server-side, then forwards to ENQUIRY_WEBHOOK_URL
 * (Zapier / Make / CRM / Slack). Without it, enquiries are only logged.
 */

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown, min: number, max: number) => Math.max(min, Math.min(max, Math.round(Number(v) || 0)));

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (str(b.website)) return NextResponse.json({ ok: true }); // honeypot

  const tent = site.tents.find((t) => t.id === str(b.tent, 40));
  const enquiry = {
    month: str(b.month, 20),
    nights: int(b.nights, 1, 30),
    adults: int(b.adults, 1, 20),
    children: int(b.children, 0, 20),
    tent: tent?.name ?? "",
    interests: Array.isArray(b.interests) ? b.interests.map((x) => str(x, 40)).filter(Boolean).slice(0, 10) : [],
    name: str(b.name, 120),
    email: str(b.email, 200),
    phone: str(b.phone, 40),
    note: str(b.note, 2000),
    receivedAt: new Date().toISOString(),
  };

  const errors: string[] = [];
  if (!tent) errors.push("tent");
  if (enquiry.name.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) errors.push("email");
  if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(enquiry) });
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
    } catch (e) {
      console.error("[enquiry] delivery failed", e);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } else {
    console.info("[enquiry] new enquiry (set ENQUIRY_WEBHOOK_URL to deliver):", enquiry);
  }
  return NextResponse.json({ ok: true });
}
