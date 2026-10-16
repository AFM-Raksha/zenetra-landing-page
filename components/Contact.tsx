"use client";

import { useState } from "react";
import { ENTITY_OPTIONS, ERP_OPTIONS } from "@/lib/form-options";
import { Chk } from "./Icons";

type Status = { state: "idle" | "sending" | "sent" | "error"; text?: string };

export default function Contact() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus({ state: "error", text: "Add your name, a work email and your company." });
      return;
    }
    setStatus({ state: "sending", text: "Sending…" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? "We couldn't send your request just now. Please try again in a few minutes.");
      form.reset();
      setStatus({ state: "sent", text: "Thanks. We've received your request and will be in touch by email." });
    } catch (err) {
      setStatus({ state: "error", text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  };

  const sending = status.state === "sending";

  return (
    <section className="sec" id="contact" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="contact">
          <div>
            <p className="eyebrow">Request a demo</p>
            <h2 style={{ marginTop: 12 }}>See Zenetra in action.</h2>
            <p className="lead">Get a guided walkthrough on TestCo, our demo group, and see how flags, evidence and the group view work together.</p>
            <ul>
              <li><Chk>Live walkthrough with our team</Chk></li>
              <li><Chk>Flags, evidence and group view on demo data</Chk></li>
              <li><Chk>Your questions on fit and setup answered</Chk></li>
            </ul>
          </div>
          <form onSubmit={onSubmit} noValidate aria-busy={sending}>
            <label htmlFor="f-name">Full name<input id="f-name" name="name" autoComplete="name" placeholder="Enter your full name" required minLength={2} maxLength={100} /></label>
            <label htmlFor="f-email">Work email<input id="f-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={200} /></label>
            <label className="full" htmlFor="f-co">Company or group<input id="f-co" name="company" autoComplete="organization" placeholder="e.g. TestCo" required minLength={2} maxLength={150} /></label>
            <label htmlFor="f-ent">Companies in the group
              <select id="f-ent" name="entities">{ENTITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
            </label>
            <label htmlFor="f-sys">ERP
              <select id="f-sys" name="erp">{ERP_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
            </label>
            {/* Honeypot for bots. Hidden from people and screen readers. */}
            <div className="hp" aria-hidden="true"><label htmlFor="f-web">Website<input id="f-web" name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <div className="full actions" style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <button className="btn plain" type="submit" disabled={sending}>{sending ? "Sending…" : "Request a demo"}</button>
              <p className="fnote" role="status" style={{ color: status.state === "error" ? "var(--flag)" : status.state === "sending" ? "var(--mute)" : undefined }}>{status.text}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
