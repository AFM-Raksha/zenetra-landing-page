import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import nodemailer from "nodemailer";
import postgres from "postgres";
import { ENTITY_OPTIONS, ERP_OPTIONS } from "./form-options";

// Demo-request handling: validate, store, then email the team.
// Storage: Postgres when DATABASE_URL is set; a local JSONL file during development; otherwise email only.
// Email: any SMTP provider (Zoho Mail, SMTP2GO, Brevo) through the SMTP_* variables. See .env.example.


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

let sql: ReturnType<typeof postgres> | null = null;
let tableReady: Promise<unknown> | null = null;

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  sql ??= postgres(url, { max: 1, idle_timeout: 20, prepare: false });
  tableReady ??= sql`
    create table if not exists enquiries (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      name text not null,
      email text not null,
      company text not null,
      entities text not null,
      erp text not null,
      email_sent boolean not null default false
    )`;
  return sql;
}

/** Saves the enquiry. Returns a reference id, or null when no storage is configured. */
export async function storeEnquiry(e: Enquiry): Promise<string | null> {
  const s = db();
  if (s) {
    await tableReady;
    const [row] = await s`
      insert into enquiries (name, email, company, entities, erp)
      values (${e.name}, ${e.email}, ${e.company}, ${e.entities}, ${e.erp})
      returning id`;
    return String(row.id);
  }
  if (process.env.NODE_ENV !== "production") {
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    const id = `local-${Date.now()}`;
    await appendFile(join(dir, "enquiries.jsonl"), JSON.stringify({ id, created_at: new Date().toISOString(), ...e }) + "\n");
    return id;
  }
  return null;
}

export async function markEmailed(id: string) {
  const s = db();
  if (s && /^\d+$/.test(id)) await s`update enquiries set email_sent = true where id = ${id}`;
}

// ---------- email ----------

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function mailer() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
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
export async function emailEnquiry(e: Enquiry, ref: string | null): Promise<boolean> {
  const t = mailer();
  const to = process.env.ENQUIRY_TO;
  const from = process.env.ENQUIRY_FROM ?? process.env.SMTP_USER;
  if (!t || !to || !from) return false;

  const rows: [string, string][] = [["Name", e.name], ["Work email", e.email], ["Company or group", e.company], ["Companies in the group", e.entities], ["ERP", e.erp]];
  if (ref) rows.push(["Reference", ref]);
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
