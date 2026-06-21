/**
 * Siliguri Holidays — lead sink (siliguriholidays.com)
 *
 * On every website enquiry it:
 *   1. Appends a row to this Sheet (source of truth).
 *   2. Emails the lead to NOTIFY_EMAIL instantly (free, via MailApp — no SMTP).
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) and paste the
 * /exec URL into the site's NEXT_PUBLIC_SHEETS_URL.
 *
 * After ANY edit you must redeploy: Deploy → Manage deployments → ✏️ →
 * Version: New version → Deploy. Otherwise the live URL runs old code.
 */

// Where lead emails are sent. Add more, comma-separated: "a@x.com,b@y.com".
var NOTIFY_EMAIL = "ps8640321@gmail.com";

// WhatsApp ping to the business (free, via CallMeBot — see setup below).
// Phone = number that authorised CallMeBot, country code, no + or spaces.
var WHATSAPP_PHONE = "919144798785";
var CALLMEBOT_APIKEY = ""; // <-- paste the API key CallMeBot sends you. Empty = off.
//
// CallMeBot setup (one-time, ~2 min):
//   1. Save +34 644 73 88 99 to contacts (CallMeBot).
//   2. From the +91 91447 98785 WhatsApp, send it:  I allow callmebot to send me messages
//   3. It replies with your API key. Paste it into CALLMEBOT_APIKEY above.
//   4. Redeploy (Manage deployments → ✏️ → New version → Deploy).

// Column order in the sheet. Add fields here to capture them.
var HEADERS = [
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
  "status",   // you fill this: new / contacted / quoted / booked / lost
  "message",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise concurrent submits
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS); // write header row once
    }

    var row = HEADERS.map(function (key) {
      if (key === "status") return "new";
      return data[key] != null ? data[key] : "";
    });
    sheet.appendRow(row);

    sendLeadEmail(data);     // notify the business — never blocks the row write
    sendWhatsApp(data);      // ditto
    sendCustomerAck(data);   // instant "we got it" reply to the customer

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Email the lead. Failures here must not fail the request (row is already saved).
function sendLeadEmail(data) {
  try {
    var type = data.enquiryType || "Enquiry";
    var name = data.name || "Someone";
    var subject = "🔔 New " + type + " lead — " + name;

    var lines = [
      "New enquiry from the website:",
      "",
      "Type:    " + (data.enquiryType || "-"),
      "Name:    " + (data.name || "-"),
      "Phone:   " + (data.phone || "-"),
      "Email:   " + (data.email || "-"),
    ];
    if (data.vehicle) lines.push("Car:     " + data.vehicle);
    if (data.trip_type) lines.push("Trip:    " + data.trip_type);
    if (data.route) lines.push("Route:   " + data.route);
    if (data.pickup) lines.push("Pickup:  " + data.pickup);
    if (data.drop) lines.push("Drop:    " + data.drop);
    if (data.date) lines.push("Date:    " + data.date);
    if (data.reference) lines.push("Ref:     " + data.reference);
    lines.push("");
    lines.push("--- Details ---");
    lines.push(data.message || "(none)");
    lines.push("");
    if (data.utm_source) lines.push("Source:  " + data.utm_source);
    if (data.page) lines.push("Page:    " + data.page);
    lines.push("Time:    " + (data.submitted_at || ""));

    var options = {};
    // Reply goes straight to the customer if they left an email.
    if (data.email) options.replyTo = data.email;

    MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join("\n"), options);
  } catch (err) {
    // swallow — the lead is safely in the sheet regardless
  }
}

// Instant acknowledgement to the customer, so they don't go cold waiting.
// Only fires if they left an email. Free (MailApp), best-effort.
function sendCustomerAck(data) {
  if (!data.email) return;
  try {
    var ref = data.reference || data.lead_id || "";
    var name = (data.name || "there").split(" ")[0];
    var body =
      "Hi " + name + ",\n\n" +
      "Thanks for your " + (data.enquiryType || "enquiry") + " with Siliguri Holidays! " +
      "We've received your details" + (ref ? " (ref " + ref + ")" : "") + " and our team will " +
      "call you back shortly.\n\n" +
      "For anything urgent, WhatsApp or call us on +91 91447 98785.\n\n" +
      "— Siliguri Holidays";
    MailApp.sendEmail(data.email, "We got your enquiry — Siliguri Holidays", body, {
      name: "Siliguri Holidays",
      replyTo: NOTIFY_EMAIL,
    });
  } catch (err) {
    // swallow — the lead is safely in the sheet regardless
  }
}

// WhatsApp ping to the business number via CallMeBot. Free, best-effort.
function sendWhatsApp(data) {
  if (!CALLMEBOT_APIKEY) return; // not configured yet
  try {
    var text =
      "🔔 New " + (data.enquiryType || "Enquiry") + " lead\n" +
      "Name: " + (data.name || "-") + "\n" +
      "Phone: " + (data.phone || "-") +
      (data.email ? "\nEmail: " + data.email : "") +
      (data.vehicle ? "\nCar: " + data.vehicle : "") +
      (data.route ? "\nRoute: " + data.route : "") +
      (data.date ? "\nDate: " + data.date : "");

    var url =
      "https://api.callmebot.com/whatsapp.php" +
      "?phone=" + encodeURIComponent(WHATSAPP_PHONE) +
      "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY) +
      "&text=" + encodeURIComponent(text);

    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (err) {
    // swallow — the lead is safely in the sheet regardless
  }
}

// Health check — open the /exec URL in a browser to confirm it's live.
function doGet() {
  return json({ ok: true, service: "Siliguri Holidays lead sink" });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
