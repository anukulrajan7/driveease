import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Real brand logo embedded as a data URI (raster PNG renders reliably in
// next/og, unlike gradient SVGs). Read once at build time.
const LOGO_DATA_URI = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "icon-512.png"),
).toString("base64")}`;

/**
 * Shared brand OG card (1200×630). Logo + name top-left, gold eyebrow, large
 * high-contrast headline kept inside the center safe zone, footer strip.
 * Used by the root and per-route opengraph-image files for a consistent look.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b2e1b 0%, #0f3d24 50%, #1c7a4a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* soft glow accent, top-right */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-120px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(240,180,41,0.18)",
            display: "flex",
          }}
        />

        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={92} height={92} alt="" style={{ borderRadius: "22px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "38px", fontWeight: 700, letterSpacing: "-1px" }}>
              Siliguri Holidays
            </div>
            <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.7)" }}>
              Your gateway to the East
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "1000px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", width: "46px", height: "6px", borderRadius: "3px", background: "#f0b429" }} />
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#fcd34d",
              }}
            >
              {eyebrow}
            </div>
          </div>
          <div style={{ fontSize: "74px", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-2px" }}>
            {title}
          </div>
          <div style={{ fontSize: "30px", lineHeight: 1.35, color: "rgba(255,255,255,0.85)" }}>
            {subtitle}
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "25px",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>siliguriholidays.com</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.4)" }}>•</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.75)" }}>
            Tours · Car rental · Verified drivers · 24×7
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
