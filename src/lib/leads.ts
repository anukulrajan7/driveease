/**
 * Lead capture — never lose an enquiry.
 *
 * Every form (tour, car, corporate, wedding, fare) calls storeLead(). The flow:
 *
 *   1. Enrich   — stamp timestamp, source page, referrer, first-touch UTMs, id.
 *   2. Sheet    — POST to a Google Apps Script web app that appends a row to your
 *                 Google Sheet. This is the SOURCE OF TRUTH you own.
 *   3. Notify   — POST to Web3Forms (if a key is set) for an instant email ping.
 *   4. Retry    — if the Sheet write fails (offline, script down), the lead is
 *                 parked in localStorage and retried on the next load / submit.
 *                 Nothing silently vanishes.
 *
 * The WhatsApp deep link is fired by the caller separately and is unaffected.
 *
 * Config (set in .env.local — both optional, the site degrades gracefully):
 *   NEXT_PUBLIC_SHEETS_URL       Apps Script /exec URL (source of truth)
 *   NEXT_PUBLIC_WEB3FORMS_KEY    Web3Forms access key (backup email notifier)
 */

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const QUEUE_KEY = "sh_lead_queue";
const ATTRIBUTION_KEY = "sh_attribution";
const MAX_ATTEMPTS = 8; // stop retrying a lead after this many failures

export interface LeadPayload {
  /** "Tour" | "Car rental" | "Corporate" | "Wedding" | "Fare enquiry" … */
  enquiryType: string;
  name?: string;
  phone?: string;
  email?: string;
  /** Pre-formatted human-readable summary (same text we send to WhatsApp). */
  message: string;
  /** Any extra structured fields land as columns in the Sheet. */
  [key: string]: string | undefined;
}

/** A lead after enrichment — what actually gets written to the Sheet. */
interface EnrichedLead extends LeadPayload {
  lead_id: string;
  submitted_at: string;
  page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface QueuedLead {
  lead: EnrichedLead;
  attempts: number;
}

/** True when the Google Sheet source of truth is configured. */
export const LEAD_STORAGE_ENABLED = Boolean(SHEETS_URL);

// ── attribution ────────────────────────────────────────────────────────────

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * First-touch attribution: the first time a visitor lands with UTM params we
 * persist them, so a lead filled out three pages later still credits the source
 * that brought them in. Re-reads on every call (cheap) and only writes once.
 */
function captureAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return JSON.parse(stored);

    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) found[key] = v;
    }
    if (Object.keys(found).length > 0) {
      window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
    }
    return found;
  } catch {
    return {};
  }
}

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `lead-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
}

function enrich(payload: LeadPayload): EnrichedLead {
  const attribution = captureAttribution();
  return {
    lead_id: randomId(),
    submitted_at: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    ...attribution,
    ...payload,
  };
}

// ── transport ────────────────────────────────────────────────────────────────

/**
 * POST to the Apps Script web app. Uses text/plain so it counts as a CORS
 * "simple request" (no preflight — Apps Script can't answer OPTIONS), and
 * keepalive so the request survives a route change on submit.
 */
async function postToSheet(lead: EnrichedLead): Promise<boolean> {
  if (!SHEETS_URL) return false;
  try {
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      keepalive: true,
      body: JSON.stringify(lead),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Best-effort email ping. Never blocks, never throws. */
function notifyWeb3Forms(lead: EnrichedLead): void {
  if (!WEB3FORMS_KEY) return;
  void fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    keepalive: true,
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `New ${lead.enquiryType} enquiry — Siliguri Holidays`,
      from_name: "Siliguri Holidays website",
      botcheck: "",
      ...lead,
    }),
  }).catch(() => {});
}

// ── retry queue ──────────────────────────────────────────────────────────────

function readQueue(): QueuedLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedLead[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedLead[]): void {
  if (typeof window === "undefined") return;
  try {
    if (queue.length === 0) window.localStorage.removeItem(QUEUE_KEY);
    else window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* storage full / disabled — nothing we can do */
  }
}

function enqueue(lead: EnrichedLead): void {
  const queue = readQueue();
  // de-dup by lead_id so a double-submit doesn't pile up
  if (queue.some((q) => q.lead.lead_id === lead.lead_id)) return;
  queue.push({ lead, attempts: 1 });
  writeQueue(queue);
}

/**
 * Retry every parked lead. Drops a lead once it succeeds, or after MAX_ATTEMPTS
 * so the queue can't grow forever. Safe to call on every page load.
 */
export async function flushLeadQueue(): Promise<void> {
  if (!SHEETS_URL) return;
  const queue = readQueue();
  if (queue.length === 0) return;

  const survivors: QueuedLead[] = [];
  for (const item of queue) {
    const ok = await postToSheet(item.lead);
    if (ok) continue; // delivered — drop it
    if (item.attempts + 1 >= MAX_ATTEMPTS) continue; // give up, drop it
    survivors.push({ lead: item.lead, attempts: item.attempts + 1 });
  }
  writeQueue(survivors);
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Store a lead. Returns true if it reached the Sheet, false if it was queued
 * for retry (or storage is unconfigured). Never throws — a storage hiccup must
 * not block the WhatsApp hand-off the caller fires right after.
 */
export async function storeLead(payload: LeadPayload): Promise<boolean> {
  const lead = enrich(payload);

  // Instant email ping in parallel — independent of the Sheet write.
  notifyWeb3Forms(lead);

  if (!SHEETS_URL) return false;

  const ok = await postToSheet(lead);
  if (!ok) enqueue(lead);

  // Opportunistically retry anything parked from earlier failures.
  void flushLeadQueue();

  return ok;
}
