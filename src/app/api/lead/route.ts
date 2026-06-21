import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

/**
 * POST /api/lead — append a website enquiry to the Google Sheet.
 *
 * Runs on the server (Vercel), so it writes via a service account instead of a
 * public web app — no CORS, no "Anyone" sharing, no Workspace block. The browser
 * posts here same-origin; we authenticate to Google with the service account and
 * append a row.
 *
 * Env vars (set in Vercel → Settings → Environment Variables):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   the service account's client_email
 *   GOOGLE_PRIVATE_KEY             its private_key (paste with the \n escapes)
 *   GOOGLE_SHEET_ID                the id in the Sheet URL .../d/<ID>/edit
 */

// google-auth-library needs the Node runtime (not Edge).
export const runtime = "nodejs";

// Column order written to the sheet's header row on first use.
const HEADERS = [
  "submitted_at",
  "enquiryType",
  "name",
  "phone",
  "email",
  "reference",
  "lead_id",
  "vehicle",
  "trip_type",
  "route",
  "pickup",
  "drop",
  "date",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "page",
  "referrer",
  "status",
  "message",
];

const EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const KEY = process.env.GOOGLE_PRIVATE_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Make the private key tolerant of how it gets pasted into env vars:
 *  - strip accidental surrounding single/double quotes
 *  - turn literal "\n" into real newlines (the JSON value uses \n)
 *  - support a base64-encoded key (handy to dodge newline mangling entirely)
 */
function normalizePrivateKey(raw: string): string {
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  // If it's base64 (no PEM header), decode it.
  if (!k.includes("BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(k)) {
    try {
      k = Buffer.from(k, "base64").toString("utf8");
    } catch {
      /* not base64 — leave as-is */
    }
  }
  return k.replace(/\\n/g, "\n");
}

export async function POST(request: Request) {
  if (!EMAIL || !KEY || !SHEET_ID) {
    return Response.json(
      { ok: false, error: "Sheet not configured" },
      { status: 503 },
    );
  }

  let lead: Record<string, unknown>;
  try {
    lead = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const auth = new JWT({
      email: EMAIL,
      key: normalizePrivateKey(KEY),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Ensure a header row exists, then map the lead's keys to columns.
    try {
      await sheet.loadHeaderRow();
    } catch {
      await sheet.setHeaderRow(HEADERS);
    }

    const row: Record<string, string> = { status: "new" };
    for (const key of HEADERS) {
      const v = lead[key];
      if (v != null && v !== "") row[key] = String(v);
    }
    await sheet.addRow(row);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/lead] write failed:", err);
    return Response.json({ ok: false, error: "Write failed" }, { status: 500 });
  }
}

// Health check — visit /api/lead in a browser to confirm config status.
export async function GET() {
  return Response.json({
    ok: true,
    service: "Siliguri Holidays lead sink",
    configured: Boolean(EMAIL && KEY && SHEET_ID),
  });
}
