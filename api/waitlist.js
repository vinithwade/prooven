/**
 * POST /api/waitlist
 * - Google Sheets when GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY are set.
 * - Else: /tmp Excel only (ephemeral — not your personal sheet).
 *
 * Share the Google Sheet with the service account email as Editor.
 * Optional: GOOGLE_SHEET_TAB (default Sheet1) must match the tab name exactly.
 */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { google } = require("googleapis");

const XLSX_PATH = path.join("/tmp", "waitlist.xlsx");

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

function googleSheetsConfigured() {
  const id = trimEnv("GOOGLE_SHEET_ID");
  const email = trimEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const key = normalizePrivateKey(trimEnv("GOOGLE_PRIVATE_KEY"));
  return Boolean(id && email && key && /BEGIN [A-Z ]*PRIVATE KEY/.test(key));
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
  const privateKey = normalizePrivateKey(trimEnv("GOOGLE_PRIVATE_KEY"));
  const auth = new google.auth.JWT({
    email: trimEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const tab = trimEnv("GOOGLE_SHEET_TAB") || "Sheet1";
  await sheets.spreadsheets.values.append({
    spreadsheetId: trimEnv("GOOGLE_SHEET_ID"),
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
    return "Spreadsheet or tab not found. Check GOOGLE_SHEET_ID and GOOGLE_SHEET_TAB (exact tab name).";
  }
  if (/permission|denied|insufficient|403|does not have permission/i.test(s)) {
    return "Cannot write to the sheet. Share it with your service account email (Editor) and enable Google Sheets API.";
  }
  if (/invalid_grant|invalid JWT|DECODER/i.test(s)) {
    return "Invalid Google credentials. Check GOOGLE_PRIVATE_KEY in Vercel (full key, line breaks as \\n or real newlines).";
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
        "[waitlist] Google Sheets env not complete — using /tmp only. Set GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY on Vercel."
      );
      await appendWaitlistRowTmpXlsx(email);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[waitlist]", err.response?.data || err.message || err);
    return res.status(500).json({ error: sheetsErrorMessage(err) });
  }
};
