/**
 * POST /api/waitlist
 * - If Google Sheets env vars are set: appends a row (timestamp, email) to your sheet. Works on Vercel.
 * - Else: writes to /tmp Excel (ephemeral on serverless).
 * Local dev: use server.local.js → waitlist.xlsx.
 *
 * Setup: Google Cloud → enable Sheets API → service account → JSON key.
 * Vercel env: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
 * Optional: GOOGLE_SHEET_TAB (default Sheet1). Share the sheet with the service account email (Editor).
 */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { google } = require("googleapis");

const XLSX_PATH = path.join("/tmp", "waitlist.xlsx");

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function googleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

function a1RangeForTab(tab) {
  const t = (tab || "Sheet1").trim() || "Sheet1";
  const quoted = /^[A-Za-z0-9_]+$/.test(t) ? t : `'${t.replace(/'/g, "''")}'`;
  return `${quoted}!A:B`;
}

async function appendToGoogleSheet(email) {
  const privateKey = String(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const tab = process.env.GOOGLE_SHEET_TAB || "Sheet1";
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
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

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = (req.body && String(req.body.email || "").trim()) || "";
  if (!email || !validEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    if (googleSheetsConfigured()) {
      await appendToGoogleSheet(email);
    } else {
      await appendWaitlistRowTmpXlsx(email);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not save your signup. Try again later." });
  }
};
