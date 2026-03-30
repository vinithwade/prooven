/**
 * POST /api/waitlist — production on Vercel uses Supabase when env vars are set.
 * Fallback: /tmp Excel (ephemeral). Local dev uses server.local.js + waitlist.xlsx.
 */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { createClient } = require("@supabase/supabase-js");

const XLSX_PATH = path.join("/tmp", "waitlist.xlsx");

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function supabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && url.startsWith("http"));
}

async function saveToSupabase(email) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  const { error } = await supabase.from("waitlist_signups").insert({ email });
  if (error) {
    if (error.code === "23505") {
      return;
    }
    throw error;
  }
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
    if (supabaseConfigured()) {
      await saveToSupabase(email);
    } else {
      await appendWaitlistRowTmpXlsx(email);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not save your signup. Try again later." });
  }
};
