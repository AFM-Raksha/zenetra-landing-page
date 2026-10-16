"use client";

import { useState } from "react";
import { Chk } from "./Icons";

export default function Contact() {
  const [note, setNote] = useState<{ text: string; ok: boolean } | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      setNote({ text: "Add your name, a work email and your company.", ok: false });
      return;
    }
    setNote({ text: "This form isn't connected yet, so nothing was sent.", ok: true });
  };

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
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="f-name">Full name<input id="f-name" autoComplete="name" placeholder="Enter your full name" required /></label>
            <label htmlFor="f-email">Work email<input id="f-email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
            <label className="full" htmlFor="f-co">Company or group<input id="f-co" autoComplete="organization" placeholder="e.g. TestCo" required /></label>
            <label htmlFor="f-ent">Companies in the group
              <select id="f-ent"><option>1</option><option>2–5</option><option>6–20</option><option>More than 20</option></select>
            </label>
            <label htmlFor="f-sys">ERP
              <select id="f-sys"><option>Zoho Books</option><option>Tally Prime</option><option>SAP</option><option>Other</option></select>
            </label>
            <div className="full" style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <button className="btn plain" type="submit">Request a demo</button>
              <p className="fnote" role="status" style={{ color: note && !note.ok ? "var(--flag)" : undefined }}>{note?.text}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
