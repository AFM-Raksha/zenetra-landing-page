import { emailEnquiry, markEmailed, storeEnquiry, validateEnquiry } from "@/lib/enquiry";

// Best-effort rate limit per server instance: a few requests per address in a short window.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (status: number, body: object) => Response.json(body, { status });

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false, error: "Send the form as JSON." });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (limited(ip)) return json(429, { ok: false, error: "Too many requests. Please try again in a few minutes." });

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: "The form could not be read. Please try again." });
  }

  // Honeypot: real visitors never see or fill this field. Reply as if it worked.
  if (typeof raw.website === "string" && raw.website.trim() !== "") return json(200, { ok: true });

  const parsed = validateEnquiry(raw);
  if (!parsed.ok) return json(400, { ok: false, error: parsed.error });

  let ref: string | null = null;
  let emailed = false;
  try {
    ref = await storeEnquiry(parsed.value);
  } catch (err) {
    console.error("[enquiry] store failed", err);
  }
  try {
    emailed = await emailEnquiry(parsed.value, ref);
    if (emailed && ref) await markEmailed(ref);
  } catch (err) {
    console.error("[enquiry] email failed", err);
  }

  if (!ref && !emailed) {
    console.error("[enquiry] not saved or emailed; check DATABASE_URL and SMTP_* settings");
    return json(503, { ok: false, error: "We couldn't send your request just now. Please try again in a few minutes." });
  }
  return json(200, { ok: true });
}
