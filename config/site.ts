/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  UPEO: site configuration. Every camp-specific value lives here.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  "Upeo" (Swahili: horizon) is an original concept brand for a tented safari
 *  camp in the Maasai Mara ecosystem. To adapt it for a real camp, change the
 *  values below and swap the photographs in /assets/images (same filename =
 *  no code change). See README.md.
 *
 *  ⚠ PLACEHOLDERS: anything flagged `placeholder` (rates, acreage, tent count,
 *  sightings, impact figures, contact details) is demo content and is labelled
 *  on screen until replaced.
 */

import type { StaticImageData } from "next/image";

import tentLuxe from "@/assets/images/tent-luxe.jpg";
import tentTwin from "@/assets/images/tent-twin.jpg";
import tentWindow from "@/assets/images/tent-window.jpg";
import tentVeranda from "@/assets/images/tent-veranda.jpg";
import tentBedLamp from "@/assets/images/tent-bed-lamp.jpg";
import tentClassic from "@/assets/images/tent-classic.jpg";
import tentBright from "@/assets/images/tent-bright.jpg";
import cheetahs from "@/assets/images/cheetahs.jpg";
import leopardBranch from "@/assets/images/leopard-branch.jpg";
import lionCubs from "@/assets/images/lion-cubs.jpg";
import elephantCalf from "@/assets/images/elephant-calf.jpg";
import crossing from "@/assets/images/crossing.jpg";
import giraffes from "@/assets/images/giraffes.jpg";
import jeepLion from "@/assets/images/jeep-lion.jpg";
import balloonZebras from "@/assets/images/balloon-zebras.jpg";
import walkingGuide from "@/assets/images/walking-guide.jpg";
import acaciaSunset from "@/assets/images/acacia-sunset.jpg";
import jeepSunset from "@/assets/images/jeep-sunset.jpg";
import firePit from "@/assets/images/fire-pit.jpg";
import stars from "@/assets/images/stars.jpg";
import leopardDark from "@/assets/images/leopard-dark.jpg";

export type Img = { src: StaticImageData; alt: string };

export type Tent = {
  id: string;
  name: string;
  gloss: string;
  line: string;
  sleeps: string;
  size: string;
  facing: string;
  /** USD per person per night, sharing, all-inclusive (high season) */
  rate: number;
  features: string[];
  image: Img;
  detail: Img;
};

export type Month = {
  m: string;
  short: string;
  season: "green" | "shoulder" | "high";
  /** where the herds are, roughly: index into MIGRATION_PLACES */
  where: number;
  headline: string;
  body: string;
  bestFor: string;
};

export type Experience = { id: string; name: string; when: string; body: string; image: Img };

export type Sighting = { day: string; time: string; note: string; where: string; image: Img };

export const site = {
  name: "Upeo",
  wordmark: "UPEO",
  tagline: "A tented camp on the edge of the Maasai Mara",
  url: "https://upeo-camp.vercel.app",

  brand: {
    canvas: "#EFE6D6", // tent canvas
    night: "#15120D", // the Mara after dark
    dust: "#D9C7A6",
    straw: "#B8913F", // red-oat grass at golden hour
    accent: "#A8361F", // shuka red
  },

  contact: {
    phone: "+254 700 000 000", // placeholder
    phoneHref: "tel:+254700000000",
    whatsapp: "254700000000", // placeholder, digits only
    email: "safari@example.com", // placeholder
    location: "A private conservancy bordering the Maasai Mara National Reserve, Narok County, Kenya",
    coordinates: "1.4061° S · 35.1015° E",
    nearestAirstrip: "Mara airstrip, ~25 min drive", // placeholder
  },

  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Safari Bookings", href: "https://www.safaribookings.com/" },
  ],

  nav: [
    { label: "The camp", href: "#camp" },
    { label: "Migration", href: "#migration" },
    { label: "Days", href: "#days" },
    { label: "Rates", href: "#rates" },
  ],

  seo: {
    title: "Upeo | Luxury Tented Safari Camp, Maasai Mara, Kenya",
    description:
      "Eight canvas tents on a private conservancy on the edge of the Maasai Mara. Big cats year-round, the Great Migration July to October, walking safaris and balloon flights. Plan your Kenya safari direct.",
    keywords: [
      "Maasai Mara camp",
      "luxury tented camp Kenya",
      "Masai Mara safari",
      "Great Migration safari",
      "Mara conservancy camp",
      "Kenya safari lodge",
      "Mara river crossing",
      "safari Kenya 2027",
    ],
  },

  facts: [
    { value: "8", label: "Canvas tents", placeholder: true },
    { value: "30,000", label: "Acres of conservancy", placeholder: true },
    { value: "1", label: "Horizon" },
  ],

  // ── Tents ────────────────────────────────────────────────────────────────────
  tents: [
    {
      id: "nyota",
      name: "Nyota",
      gloss: "star",
      line: "A canvas tent with a roll-up roof panel above the bed, so you fall asleep under the southern sky.",
      sleeps: "2",
      size: "62 m²",
      facing: "Open plains",
      rate: 980,
      features: ["Star-gazing roof panel", "Copper bath on the deck", "Outdoor shower", "Private veranda"],
      image: { src: tentLuxe, alt: "A canvas safari tent interior with a king bed and woven textiles" },
      detail: { src: tentWindow, alt: "The view from bed through a tent window to the hills" },
    },
    {
      id: "mto",
      name: "Mto",
      gloss: "river",
      line: "On the bank of a seasonal lugga where elephants come to drink at dusk. Hippos keep the night shift.",
      sleeps: "2 or twin",
      size: "58 m²",
      facing: "Riverine forest",
      rate: 920,
      features: ["Twin or king", "Riverside deck", "Writing desk", "Bush-view bathroom"],
      image: { src: tentTwin, alt: "A twin-bedded safari tent with canvas walls and a wooden chest" },
      detail: { src: tentVeranda, alt: "A tent veranda with a folding table and chairs" },
    },
    {
      id: "familia",
      name: "Familia",
      gloss: "family",
      line: "Two canvas pavilions joined by a shared lounge and deck. Children have their own tent and their own guide.",
      sleeps: "4–5",
      size: "110 m²",
      facing: "Acacia woodland",
      rate: 840,
      features: ["Two en-suite tents", "Shared lounge & deck", "Private vehicle", "Junior ranger kit"],
      image: { src: tentBright, alt: "A long, light-filled tent pavilion with wooden floors" },
      detail: { src: tentClassic, alt: "A classic canvas safari tent among trees" },
    },
    {
      id: "upeo",
      name: "Upeo Suite",
      gloss: "horizon",
      line: "The tent at the edge of the escarpment. A plunge pool, a private chef and nothing in front of you but Africa.",
      sleeps: "2",
      size: "140 m²",
      facing: "The whole horizon",
      rate: 1650,
      features: ["Plunge pool", "Private vehicle & guide", "In-tent dining", "Butler"],
      image: { src: tentBedLamp, alt: "A lamplit bed under a canvas roof" },
      detail: { src: acaciaSunset, alt: "Acacia trees in silhouette at sunset" },
    },
  ] satisfies Tent[] as Tent[],
  ratesPlaceholder: true,

  // ── Migration calendar (approximate; the herds follow the rain) ─────────────
  migration: [
    { m: "January", short: "Jan", season: "shoulder", where: 0, headline: "Calving on the short-grass plains", body: "The herds are far south, around Ndutu, where half a million calves are born in a few weeks. In the Mara: resident lions, leopards and cheetahs, and almost no other vehicles.", bestFor: "Big cats in solitude" },
    { m: "February", short: "Feb", season: "shoulder", where: 0, headline: "Peak calving season", body: "Predators follow the calves in the south. On the conservancy, the grass is short and the cats are easy to follow.", bestFor: "Cheetah & lion" },
    { m: "March", short: "Mar", season: "shoulder", where: 1, headline: "The herds begin to stir", body: "The short rains end and the columns start to drift north and west through the central Serengeti.", bestFor: "Quiet, green plains" },
    { m: "April", short: "Apr", season: "green", where: 1, headline: "The long rains", body: "Dramatic skies, emerald grass and our lowest rates. Some roads close; the camp stays open for those who love a storm.", bestFor: "Photographers & value" },
    { m: "May", short: "May", season: "green", where: 2, headline: "Moving through the western corridor", body: "The rut begins. The herds push west toward the Grumeti river.", bestFor: "Green season light" },
    { m: "June", short: "Jun", season: "shoulder", where: 2, headline: "Grumeti crossings", body: "The first river crossings happen on the Grumeti. Up north, the Mara grass is long and gold.", bestFor: "Early-season calm" },
    { m: "July", short: "Jul", season: "high", where: 3, headline: "The herds reach the Mara", body: "The front of the migration crosses into Kenya. The first Mara River crossings are often in mid to late July.", bestFor: "First crossings" },
    { m: "August", short: "Aug", season: "high", where: 4, headline: "River crossings at their peak", body: "Hundreds of thousands of wildebeest and zebra on the plains, crocodiles in the river, and crossings most days somewhere along the Mara.", bestFor: "The Great Migration" },
    { m: "September", short: "Sep", season: "high", where: 4, headline: "The Mara at its fullest", body: "Herds in every direction, and the predators at their most active.", bestFor: "Crossings & predators" },
    { m: "October", short: "Oct", season: "high", where: 3, headline: "The long walk south begins", body: "Late crossings as the herds start back toward Tanzania with the first short rains.", bestFor: "Last crossings" },
    { m: "November", short: "Nov", season: "shoulder", where: 1, headline: "Heading south", body: "The plains empty of wildebeest and fill with resident game. The short rains turn the Mara green again.", bestFor: "Resident wildlife" },
    { m: "December", short: "Dec", season: "high", where: 0, headline: "Home to the south", body: "The herds return to the southern plains to calve. Festive season at camp: book early.", bestFor: "Holidays in the bush" },
  ] satisfies Month[] as Month[],

  // ── Days on safari ───────────────────────────────────────────────────────────
  experiences: [
    { id: "drive", name: "Dawn game drive", when: "06:15", body: "Out before the sun with your own guide and spotter, back when you choose. No radio chases, no crowds.", image: { src: jeepLion, alt: "A safari vehicle stopped beside a lion at golden hour" } },
    { id: "balloon", name: "Balloon over the plains", when: "05:30", body: "Lift off at first light and drift over the herds, then land to a champagne breakfast in the grass.", image: { src: balloonZebras, alt: "A red and yellow hot-air balloon above zebras on the plains" } },
    { id: "walk", name: "Walking with Maasai guides", when: "07:00", body: "Read the bush on foot with guides who grew up on this land: tracks, plants, birds and the small things a vehicle misses.", image: { src: walkingGuide, alt: "A Maasai guide in a red shuka standing in the bush" } },
    { id: "sundowner", name: "Sundowners on the ridge", when: "18:15", body: "A cold drink on the escarpment while the whole Mara turns gold, then purple.", image: { src: jeepSunset, alt: "A safari vehicle silhouetted against the sunset" } },
    { id: "fire", name: "Fireside & stars", when: "20:30", body: "Dinner by the fire, then the guides name the stars: the Southern Cross, the Scorpion, the Milky Way overhead.", image: { src: firePit, alt: "A fire burning in a fire pit at night" } },
    { id: "night", name: "Night drive", when: "21:30", body: "Permitted on the conservancy: a red spotlight, hyena, aardvark, genet, and if you are lucky, a leopard on the hunt.", image: { src: leopardDark, alt: "A leopard emerging from darkness" } },
  ] satisfies Experience[] as Experience[],

  // ── From the field journal (sample entries) ─────────────────────────────────
  sightings: [
    { day: "Mon", time: "06:42", note: "Five cheetah brothers on the open plains, hunting in a line.", where: "East plains", image: { src: cheetahs, alt: "Five cheetahs sitting together in the grass" } },
    { day: "Tue", time: "16:10", note: "Leopard up a desert date tree with a fresh kill. She stayed till dark.", where: "Lugga below camp", image: { src: leopardBranch, alt: "A leopard standing on an acacia branch" } },
    { day: "Wed", time: "07:25", note: "Lioness moving four cubs to a new den. Three weeks old, at a guess.", where: "Rock outcrop", image: { src: lionCubs, alt: "A lioness lying with her cubs" } },
    { day: "Thu", time: "11:30", note: "Breeding herd of 40 elephants crossing the airstrip road. Very new calf.", where: "Airstrip road", image: { src: elephantCalf, alt: "An elephant with a young calf" } },
    { day: "Fri", time: "10:05", note: "Crossing at Lookout! Two thousand wildebeest in twenty minutes.", where: "Mara River", image: { src: crossing, alt: "Wildebeest crossing a muddy river" } },
    { day: "Sat", time: "17:50", note: "Tower of 11 giraffe at sundowners. Nobody finished their drink.", where: "The ridge", image: { src: giraffes, alt: "A group of giraffes on the plains" } },
  ] satisfies Sighting[] as Sighting[],
  sightingsPlaceholder: true,

  // ── Conservation ─────────────────────────────────────────────────────────────
  conservation: {
    statement: "We don't own the land. We lease it from the Maasai families who do.",
    body: "Every night you stay pays a conservancy fee that goes straight to the landowners, keeps the land open for wildlife and caps the number of vehicles on it. Fewer beds, fewer cars, more Mara.",
    figures: [
      { value: "1:350", label: "Beds to acres", placeholder: true },
      { value: "100%", label: "Kenyan team", placeholder: true },
      { value: "$116", label: "Conservancy fee / guest / night", placeholder: true },
    ],
    image: { src: stars, alt: "The night sky over the savannah" },
  },

  // ── Rates ────────────────────────────────────────────────────────────────────
  seasons: [
    { id: "green", name: "Green season", months: "Apr – May", factor: 0.62 },
    { id: "shoulder", name: "Shoulder", months: "Jan – Mar · Jun · Nov", factor: 0.8 },
    { id: "high", name: "High season", months: "Jul – Oct · Dec", factor: 1 },
  ],
  included: [
    "All meals & house drinks",
    "Shared game drives with your own guide",
    "Walking safaris & sundowners",
    "Conservancy fees",
    "Laundry & Wi-Fi in the mess tent",
    "Mara airstrip transfers",
  ],
  extras: ["Balloon flight", "Private vehicle (standard in Upeo Suite)", "Flights from Nairobi (Wilson)", "Mara Reserve park fees for days in the Reserve"],

  travel: {
    flight: "~45 min scheduled flight from Nairobi Wilson Airport to the Mara", // approximate
    road: "~5–6 hrs by road from Nairobi, via the Great Rift Valley", // approximate
  },
} as const;

export const usd = (n: number) => `US$${n.toLocaleString("en-US")}`;
