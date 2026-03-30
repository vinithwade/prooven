/**
 * SIMPLE GOOGLE SHEETS + VERCEL (no service account JSON on Vercel)
 *
 * 1) Open your waitlist spreadsheet in Google Sheets.
 * 2) Extensions → Apps Script → delete any default code → paste everything below the line.
 * 3) Set WEBHOOK_SECRET to a long random string (same value you’ll put in Vercel).
 * 4) Save. Click Deploy → New deployment → Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5) Copy the Web app URL.
 * 6) In Vercel → Environment Variables:
 *      GOOGLE_APPS_SCRIPT_SECRET = same WEBHOOK_SECRET (required, 8+ chars)
 *      Optional: GOOGLE_APPS_SCRIPT_WEBHOOK_URL if you redeploy and the /exec URL changes
 *      (the repo defaults your current web app URL in api/waitlist.js).
 * 7) Redeploy.
 *
 * New signups append to the active sheet’s first tab (or whichever tab was open when you
 * created the script from this spreadsheet — it uses getActiveSpreadsheet()).
 * --------------------------------------------------------------------------- */

const WEBHOOK_SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";

function doPost(e) {
  if (e.parameter.key !== WEBHOOK_SECRET) {
    return jsonResponse({ ok: false, error: "Unauthorized" });
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: "Bad JSON" });
  }

  var email = String(data.email || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: "Bad email" });
  }

  var ts = data.timestamp ? new Date(data.timestamp) : new Date();
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([ts, email]);

  return jsonResponse({ ok: true });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
