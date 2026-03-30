/**
 * Paste into: Google Sheet → Extensions → Apps Script
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone
 * Copy the /exec URL → Vercel: GOOGLE_APPS_SCRIPT_WEBHOOK_URL
 * Set WEBHOOK_SECRET below → same value in Vercel: GOOGLE_APPS_SCRIPT_SECRET
 */

const WEBHOOK_SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";

function doPost(e) {
  if (e.parameter.key !== WEBHOOK_SECRET) {
    return json({ ok: false, error: "Unauthorized" });
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "Bad JSON" });
  }

  var email = String(data.email || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Bad email" });
  }

  var ts = data.timestamp ? new Date(data.timestamp) : new Date();
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([ts, email]);

  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
