import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared brand OG card (1200×630). Used by the root and per-route
 * opengraph-image files so every share card looks consistent.
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
          padding: "72px",
          background: "linear-gradient(135deg, #0f3d24 0%, #14532d 55%, #1d6b3a 100%)",
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
            Siliguri Holidays
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#7ee0a8",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize: "70px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px" }}>
            {title}
          </div>
          <div
            style={{
              fontSize: "30px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "950px",
            }}
          >
            {subtitle}
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
    { ...OG_SIZE },
  );
}
