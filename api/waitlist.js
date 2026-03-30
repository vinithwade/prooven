/**
 * POST /api/waitlist — forwards to Google Apps Script, which appends a row to your sheet.
 *
 * Vercel env (both required):
 *   GOOGLE_APPS_SCRIPT_WEBHOOK_URL  — Web app URL ending in /exec
 *   GOOGLE_APPS_SCRIPT_SECRET       — same value as WEBHOOK_SECRET in google-apps-script-waitlist.gs (8+ chars)
 *
 * Local preview: npm start uses server.local.js → waitlist.xlsx (this file runs only on Vercel).
 */

function trimEnv(name) {
  const v = process.env[name];
  return v == null ? "" : String(v).trim();
}

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function configured() {
  const url = trimEnv("GOOGLE_APPS_SCRIPT_WEBHOOK_URL");
  const secret = trimEnv("GOOGLE_APPS_SCRIPT_SECRET");
  return url.startsWith("http") && secret.length >= 8;
}

function readJsonBody(req) {
  const b = req.body;
  if (b != null && typeof b === "object" && !Buffer.isBuffer(b)) return b;
  if (typeof b === "string") {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(b)) {
    try {
      return JSON.parse(b.toString("utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

async function forwardToAppsScript(email) {
  const base = trimEnv("GOOGLE_APPS_SCRIPT_WEBHOOK_URL");
  const secret = trimEnv("GOOGLE_APPS_SCRIPT_SECRET");
  const u = new URL(base);
  u.searchParams.set("key", secret);

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 25000);
  let res;
  try {
    res = await fetch(u.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
      }),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    /* ignore */
  }

  if (!res.ok || data.ok === false || data.error) {
    const msg = typeof data.error === "string" ? data.error : text || "Request failed";
    throw new Error(msg);
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!configured()) {
    return res.status(503).json({
      error:
        "Waitlist is not configured. Set GOOGLE_APPS_SCRIPT_WEBHOOK_URL and GOOGLE_APPS_SCRIPT_SECRET on Vercel.",
    });
  }

  const body = readJsonBody(req);
  const email = (body && String(body.email || "").trim()) || "";
  if (!email || !validEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    await forwardToAppsScript(email);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[waitlist]", err.message || err);
    return res.status(500).json({
      error:
        err.message ||
        "Could not save your signup. Check the Apps Script deploy URL, secret, and sheet sharing.",
    });
  }
};
