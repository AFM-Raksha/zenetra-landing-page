"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) =>
    setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="head-block center">
          <p className="eyebrow">FAQ</p>
          <h2 className="h2" data-reveal>Questions finance teams ask first</h2>
        </div>
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <div className="q" key={q} data-open={open.has(i) ? "" : undefined}>
              <button type="button" aria-expanded={open.has(i)} aria-controls={`qa${i}`} onClick={() => toggle(i)}>
                {q}
                <span className="pm"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" /></svg></span>
              </button>
              <div className="a" id={`qa${i}`} hidden={!open.has(i)}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
