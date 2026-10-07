import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono, Caveat } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { site } from "@/config/site";
import { SmoothScroll } from "@/lib/smooth-scroll";

const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-hand-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: site.name, title: site.seo.title, description: site.seo.description, locale: "en_KE" },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: site.brand.night, width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.seo.description,
  url: site.url,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: { "@type": "PostalAddress", addressRegion: "Narok County", addressCountry: "KE" },
  geo: { "@type": "GeoCoordinates", latitude: -1.4061, longitude: 35.1015 },
  priceRange: `US$${Math.min(...site.tents.map((t) => t.rate))}+ per person per night`,
  amenityFeature: ["Game drives", "Walking safaris", "Hot-air balloon flights", "All-inclusive", "Airstrip transfers"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const vars = {
    "--brand-canvas": site.brand.canvas,
    "--brand-night": site.brand.night,
    "--brand-dust": site.brand.dust,
    "--brand-straw": site.brand.straw,
    "--brand-accent": site.brand.accent,
  } as CSSProperties;
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`} style={vars}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>{children}</SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
