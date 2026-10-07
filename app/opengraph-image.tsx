import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card: a sun on the horizon over red-oat grass. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, fontFamily: "serif", color: site.brand.night, background: "linear-gradient(180deg, #8FA0B2 0%, #E9B98A 52%, #F6D49C 60%, #B8913F 61%, #6B4A22 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6 }}>
          <span>{site.wordmark}</span>
          <span style={{ letterSpacing: 2 }}>MAASAI MARA · KENYA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>The horizon</span>
          <span>is the only wall.</span>
        </div>
      </div>
    ),
    size,
  );
}
