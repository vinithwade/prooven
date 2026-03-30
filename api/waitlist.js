/**
 * POST /api/waitlist → appends [timestamp, email] to Google Sheets.
 *
 * Credentials (pick one):
 * - Vercel: set GOOGLE_SERVICE_ACCOUNT_JSON to the full JSON string (one line is fine), OR
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY
 * - Local: same env vars, or place prooven-f4e4cafabfea.json in project root (gitignored)
 *
 * Sheet: defaults to Prooven waitlist sheet; override with GOOGLE_SHEET_ID.
 * Share the sheet with the service account client_email as Editor.
 */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { google } = require("googleapis");

const XLSX_PATH = path.join("/tmp", "waitlist.xlsx");

/** Public ID from your spreadsheet URL (not secret). */
const DEFAULT_GOOGLE_SHEET_ID = "1oqgsrpxKjlDc490JsQHZgN1Y0XM6QQ-xKpj22EYwSsA";

const LOCAL_CREDENTIALS_FILE = path.join(__dirname, "..", "prooven-f4e4cafabfea.json");

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function trimEnv(name) {
  const v = process.env[name];
  return v == null ? "" : String(v).trim();
}

function normalizePrivateKey(k) {
  if (!k) return "";
  let s = String(k).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.replace(/\\n/g, "\n");
}

function credentialsFromParsedJson(j) {
  if (!j || typeof j !== "object") return null;
  const email = j.client_email && String(j.client_email).trim();
  const key = normalizePrivateKey(j.private_key);
  if (email && key && /BEGIN [A-Z ]*PRIVATE KEY/.test(key)) {
    return { email, key };
  }
  return null;
}

function loadGoogleCredentials() {
  const jsonEnv = trimEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (jsonEnv) {
    try {
      const creds = credentialsFromParsedJson(JSON.parse(jsonEnv));
      if (creds) return creds;
    } catch {
      /* fall through */
    }
  }

  const email = trimEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const key = normalizePrivateKey(trimEnv("GOOGLE_PRIVATE_KEY"));
  if (email && key && /BEGIN [A-Z ]*PRIVATE KEY/.test(key)) {
    return { email, key };
  }

  if (!process.env.VERCEL && fs.existsSync(LOCAL_CREDENTIALS_FILE)) {
    try {
      const j = JSON.parse(fs.readFileSync(LOCAL_CREDENTIALS_FILE, "utf8"));
      return credentialsFromParsedJson(j);
    } catch (e) {
      console.error("[waitlist] local credentials file invalid:", e.message);
    }
  }

  return null;
}

function spreadsheetId() {
  return trimEnv("GOOGLE_SHEET_ID") || DEFAULT_GOOGLE_SHEET_ID;
}

function googleSheetsConfigured() {
  return loadGoogleCredentials() != null;
}

function readJsonBody(req) {
  const b = req.body;
  if (b != null && typeof b === "object" && !Buffer.isBuffer(b)) {
    return b;
  }
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

function a1RangeForTab(tab) {
  const t = (tab || "Sheet1").trim() || "Sheet1";
  const quoted = /^[A-Za-z0-9_]+$/.test(t) ? t : `'${t.replace(/'/g, "''")}'`;
  return `${quoted}!A:B`;
}

async function appendToGoogleSheet(email) {
  const creds = loadGoogleCredentials();
  if (!creds) throw new Error("Missing Google credentials");

  const auth = new google.auth.JWT({
    email: creds.email,
    key: creds.key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const tab = trimEnv("GOOGLE_SHEET_TAB") || "Sheet1";
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: a1RangeForTab(tab),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[new Date().toISOString(), email]],
    },
  });
}

async function appendWaitlistRowTmpXlsx(email) {
  const workbook = new ExcelJS.Workbook();
  if (fs.existsSync(XLSX_PATH)) {
    await workbook.xlsx.readFile(XLSX_PATH);
  }
  let ws = workbook.getWorksheet("Waitlist");
  if (!ws) {
    ws = workbook.addWorksheet("Waitlist");
    ws.addRow(["Timestamp", "Email"]);
    ws.getRow(1).font = { bold: true };
  }
  ws.addRow([new Date().toISOString(), email]);
  await workbook.xlsx.writeFile(XLSX_PATH);
}

function sheetsErrorMessage(err) {
  const apiMsg = err?.response?.data?.error?.message || err?.message || "";
  const s = String(apiMsg);
  if (/Requested entity was not found|not found/i.test(s)) {
    return "Spreadsheet or tab not found. Check GOOGLE_SHEET_TAB (exact tab name).";
  }
  if (/permission|denied|insufficient|403|does not have permission/i.test(s)) {
    return "Cannot write to the sheet. Share it with your service account email (Editor) and enable Google Sheets API.";
  }
  if (/invalid_grant|invalid JWT|DECODER/i.test(s)) {
    return "Invalid Google credentials. Fix GOOGLE_SERVICE_ACCOUNT_JSON or key in Vercel.";
  }
  return "Could not save your signup. Try again later.";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readJsonBody(req);

  const email = (body && String(body.email || "").trim()) || "";
  if (!email || !validEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    if (googleSheetsConfigured()) {
      await appendToGoogleSheet(email);
    } else {
      console.warn(
        "[waitlist] No Google credentials — using /tmp only. On Vercel set GOOGLE_SERVICE_ACCOUNT_JSON (full JSON) or EMAIL+PRIVATE_KEY; locally add prooven-f4e4cafabfea.json in project root."
      );
      await appendWaitlistRowTmpXlsx(email);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[waitlist]", err.response?.data || err.message || err);
    return res.status(500).json({ error: sheetsErrorMessage(err) });
  }
};
