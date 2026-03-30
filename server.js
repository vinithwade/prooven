const path = require("path");
const fs = require("fs");
const express = require("express");
const ExcelJS = require("exceljs");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const XLSX_PATH = path.join(ROOT, "waitlist.xlsx");

app.use(express.json({ limit: "16kb" }));
app.use(express.static(ROOT));

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function appendWaitlistRow(email) {
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

app.post("/api/waitlist", async (req, res) => {
  const email = (req.body && String(req.body.email || "").trim()) || "";
  if (!email || !validEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  try {
    await appendWaitlistRow(email);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save your signup. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Prooven waitlist server → http://localhost:${PORT}`);
  console.log(`Signups append to: ${XLSX_PATH}`);
});
