#!/usr/bin/env node
/**
 * IndexNow submitter — notifies Bing & Yandex of your URLs instantly.
 * (Google does NOT consume IndexNow; use Search Console "Request indexing" for Google.)
 *
 * Run AFTER a deploy:  node scripts/indexnow.mjs
 *
 * It reads the live sitemap, extracts every <loc>, and submits the batch.
 * The key below must match the file at /public/<KEY>.txt (already created).
 */

const KEY = process.env.INDEXNOW_KEY ?? "a094f343835ebc62db7fce293b089464";
const HOST = (process.env.SITE_HOST ?? "siliguriholidays.com").replace(/^https?:\/\//, "");
const SITEMAP = `https://${HOST}/sitemap.xml`;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const res = await fetch(SITEMAP, { headers: { "user-agent": "indexnow-submitter" } });
  if (!res.ok) throw new Error(`Could not fetch sitemap (${res.status}): ${SITEMAP}`);
  const xml = await res.text();

  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) throw new Error("No <loc> URLs found in sitemap.");

  console.log(`Submitting ${urlList.length} URLs to IndexNow for ${HOST}…`);

  const submit = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  // 200 or 202 = accepted. 422 = key/URL mismatch. 403 = key not found at keyLocation.
  console.log(`IndexNow responded: ${submit.status} ${submit.statusText}`);
  if (!submit.ok) {
    console.error("Body:", await submit.text());
    process.exit(1);
  }
  console.log("Done. Bing & Yandex have been notified.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
