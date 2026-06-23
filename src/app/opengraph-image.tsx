import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share card for every route that doesn't generate its own.
// Brand green (#0f3d24) matches the site theme color.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0f3d24 0%, #14532d 55%, #1d6b3a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.12)",
              fontSize: "40px",
            }}
          >
            🏔️
          </div>
          <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-1px" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {site.tagline}
          </div>
          <div
            style={{
              fontSize: "30px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "900px",
            }}
          >
            North East India tour packages & trusted Siliguri car rental — permits
            sorted, verified drivers, transparent pricing.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            fontSize: "26px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ display: "flex" }}>siliguriholidays.com</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.5)" }}>•</div>
          <div style={{ display: "flex" }}>Sikkim · Darjeeling · Dooars · Gangtok</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
