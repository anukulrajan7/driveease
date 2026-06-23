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

// Fetch a remote content image and inline it as a data URI so the OG card can
// use the real page photo as its background. Returns null on any failure so the
// card gracefully falls back to the brand gradient — never breaks the build.
async function fetchImageDataUri(url?: string): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Shared brand OG card (1200×630). Pass `image` to use the page's real content
 * photo as a full-bleed background with a dark scrim for legibility; without it
 * the card uses the brand gradient. Logo + brand name sit top-left on both.
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image?: string;
}) {
  const photo = await fetchImageDataUri(image);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 68px",
          background: "linear-gradient(135deg, #0b2e1b 0%, #0f3d24 50%, #1c7a4a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Content photo background + dark scrim for text legibility */}
        {photo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              width={1200}
              height={630}
              alt=""
              style={{ position: "absolute", inset: 0, width: "1200px", height: "630px", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                background:
                  "linear-gradient(180deg, rgba(8,30,18,0.55) 0%, rgba(8,30,18,0.35) 42%, rgba(8,30,18,0.92) 100%)",
              }}
            />
          </>
        )}

        {/* glow accent only on the plain (no-photo) card */}
        {!photo && (
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
        )}

        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={84} height={84} alt="" style={{ borderRadius: "20px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px" }}>
              Siliguri Holidays
            </div>
            <div style={{ fontSize: "21px", color: "rgba(255,255,255,0.75)" }}>
              Your gateway to the East
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1010px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", width: "46px", height: "6px", borderRadius: "3px", background: "#f0b429" }} />
            <div
              style={{
                display: "flex",
                fontSize: "25px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#fcd34d",
              }}
            >
              {eyebrow}
            </div>
          </div>
          <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-2px" }}>
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: "29px",
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.88)",
                textShadow: photo ? "0 1px 8px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.92)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>siliguriholidays.com</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.45)" }}>•</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.78)" }}>
            Tours · Car rental · 24×7
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
