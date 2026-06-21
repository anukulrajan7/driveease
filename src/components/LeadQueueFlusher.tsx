"use client";

import { useEffect } from "react";
import { flushLeadQueue } from "@/lib/leads";

/**
 * Invisible. On mount, retries any leads that failed to reach the Google Sheet
 * on a previous visit (parked in localStorage). This is what turns "the network
 * blipped during submit" from a lost customer into a delayed-by-one-pageview row.
 */
export default function LeadQueueFlusher() {
  useEffect(() => {
    void flushLeadQueue();
  }, []);
  return null;
}
