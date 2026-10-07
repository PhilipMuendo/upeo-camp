# Upeo: a tented camp on the edge of the Maasai Mara

A concept website for a luxury safari camp in Kenya. **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 ·
Motion · Lenis**, with a hand-written WebGL savannah.

> "Upeo" (Swahili: horizon) is an original concept brand. All camp values live in **`config/site.ts`**;
> all photos are replaceable stock (see `IMAGES.md`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## The idea: *the horizon is the only wall*

| # | Section | What happens |
|---|---|---|
| 00 | **Hero** | A live WebGL savannah at sunrise: ~42,000 grass blades swaying in the wind, back-lit by a low sun, acacias and the escarpment on the horizon. Scroll and the camera rises out of the grass; then the horizon itself splits open and the camp is behind it. |
| 01 | **The camp** | Manifesto, facts, and photographs annotated in a guide's handwriting. |
| 02 | **The tents** | Each tent's photo waits behind two stitched canvas flaps that draw back as you scroll. *Enquire* prefills the planner. |
| 03 | **The Great Migration** | The signature: a pinned year. Months turn as you scroll while ~1,500 particles walk the Mara–Serengeti loop on a drawn map; river-crossing points pulse July–October. Each month shows where the herds are, what to come for and the season. Click a month to jump; *Plan a safari in {month}* prefills the planner. |
| 04 | **Field journal** | A week of sightings as prints taped into a notebook, captioned by hand. Desktop: pick them up and move them. |
| 05 | **Days on safari** | A light table of 35mm slides; the one you point at lifts and appears large in the viewer. |
| 06 | **Conservation** | The conservancy model, said plainly, under the night sky. |
| 07 | **Rates** | Per person per night by tent and season, with inclusions. |
| 08 | **Getting here** | A light aircraft flies Nairobi → Mara as you scroll; the road route drawn beneath. |
| 09 | **Plan your safari** | Not a form, a sentence: "We'd love to come in *September* for *4* nights…" with an indicative price for your party → WhatsApp (prefilled) or email (`/api/enquiry`). |
| — | **Finale** | The same grass after dark: moonlit tips, a campfire glowing low, stars and the Milky Way. |

## Make it a real camp

| What | Where |
|---|---|
| Name, tagline, domain | `config/site.ts` → `name`, `tagline`, `url` |
| Phone, **WhatsApp**, email, location | `config/site.ts` → `contact` |
| Colours | `config/site.ts` → `brand` |
| Tents, rates (USD pppn), features | `config/site.ts` → `tents`, `seasons`, `included`, `extras` |
| Migration calendar copy | `config/site.ts` → `migration` (approximate by design) |
| Experiences, sightings, conservation figures | `config/site.ts` → `experiences`, `sightings`, `conservation` |
| Photography | `assets/images/` (same filename = no code change), then `python scripts/grade.py` |
| Enquiries | set `ENQUIRY_WEBHOOK_URL` (Zapier/Make/CRM/Slack). Without it, enquiries are only logged. |

**Placeholders are labelled on screen** (tent count, acreage, rates and policies, sightings, conservation figures,
contact details). Do not launch with them.

## Accessibility & performance

- Both WebGL scenes render only while visible, cap resolution, freeze for reduced motion, and fall back to a photograph.
- `prefers-reduced-motion`: Lenis off, transforms skipped, the migration year becomes click-to-choose instead of scroll-scrubbed, tent flaps start open.
- Semantic landmarks, one `h1`, skip link, focus-trapped menu (Esc closes), native selects behind the planner's blanks, `aria-pressed` toggles, live regions, labelled errors.
- Homepage statically prerendered; only `/api/enquiry` is dynamic.
