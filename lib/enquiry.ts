import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import nodemailer from "nodemailer";
import { ENTITY_OPTIONS, ERP_OPTIONS } from "./form-options";

// Demo-request handling: validate, email the team, then keep a copy.
// Email: any SMTP provider through the SMTP_* variables (Gmail by default). See .env.example.
// Storage: a private file per enquiry in Vercel Blob; a local JSONL file during development.

export type Enquiry = { name: string; email: string; company: string; entities: string; erp: string };

const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;

/** Returns a clean enquiry, or a message saying what to fix. */
export function validateEnquiry(raw: Record<string, unknown>): { ok: true; value: Enquiry } | { ok: false; error: string } {
  const str = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string).trim().replace(/\s+/g, " ") : "");
  const value = { name: str("name"), email: str("email").toLowerCase(), company: str("company"), entities: str("entities"), erp: str("erp") };
  if (value.name.length < 2 || value.name.length > 100) return { ok: false, error: "Enter your full name." };
  if (value.email.length > 200 || !EMAIL_RE.test(value.email)) return { ok: false, error: "Enter a valid work email." };
  if (value.company.length < 2 || value.company.length > 150) return { ok: false, error: "Enter your company or group name." };
  if (!(ENTITY_OPTIONS as readonly string[]).includes(value.entities)) return { ok: false, error: "Choose how many companies are in the group." };
  if (!(ERP_OPTIONS as readonly string[]).includes(value.erp)) return { ok: false, error: "Choose your ERP." };
  return { ok: true, value };
}

// ---------- storage ----------

export type StoredEnquiry = Enquiry & { id: string; created_at: string; email_sent: boolean };

/** A sortable, unique reference such as 20261029-142205-a1b2c3. */
export function newEnquiryId(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
  return `${stamp}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Saves one enquiry as a private JSON file in Vercel Blob (needs BLOB_READ_WRITE_TOKEN, which Vercel
 * adds when a Blob store is connected to the project). During development without a token it appends
 * to .data/enquiries.jsonl. Returns false when no storage is available.
 */
export async function storeEnquiry(rec: StoredEnquiry): Promise<boolean> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(`enquiries/${rec.created_at.slice(0, 7)}/${rec.id}.json`, JSON.stringify(rec, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return true;
  }
  if (process.env.NODE_ENV !== "production") {
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, "enquiries.jsonl"), JSON.stringify(rec) + "\n");
    return true;
  }
  console.warn("[enquiry] storage not configured; missing: BLOB_READ_WRITE_TOKEN");
  return false;
}

// ---------- email ----------

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function mailer() {
  // Only the Gmail address and its App Password are required; the server defaults to Gmail's.
  const { SMTP_USER, SMTP_PASS } = process.env;
  const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
  if (!SMTP_USER || !SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  transport ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Emails the team. Returns false when SMTP is not configured. */
export async function emailEnquiry(e: Enquiry, ref: string): Promise<boolean> {
  const t = mailer();
  // Sender and recipient default to the sending account, so one Gmail inbox both sends and receives.
  const to = process.env.ENQUIRY_TO || process.env.SMTP_USER;
  const from = process.env.ENQUIRY_FROM || process.env.SMTP_USER;
  if (!t || !to || !from) {
    // Name the missing settings (never their values) so the cause shows up in the server logs.
    const missing = ["SMTP_USER", "SMTP_PASS"].filter((k) => !process.env[k]);
    console.warn(`[enquiry] email not configured; missing: ${missing.join(", ") || "none"}`);
    return false;
  }

  const rows: [string, string][] = [["Name", e.name], ["Work email", e.email], ["Company or group", e.company], ["Companies in the group", e.entities], ["ERP", e.erp]];
  rows.push(["Reference", ref]);
  await t.sendMail({
    from: `Zenetra website <${from}>`,
    to,
    replyTo: { name: e.name, address: e.email },
    subject: `Demo request: ${e.company} (${e.name})`,
    text: ["New demo request from the Zenetra website.", "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"),
    html: `<p>New demo request from the Zenetra website.</p><table cellpadding="6" style="border-collapse:collapse;font:14px sans-serif">${rows
      .map(([k, v]) => `<tr><td style="color:#6E6E73">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`)
      .join("")}</table><p style="color:#6E6E73;font:12px sans-serif">Reply to this email to answer ${esc(e.name)} directly.</p>`,
  });
  return true;
}
