"use client";

import { useState } from "react";
import { DOMAIN_LABEL, PATTERNS, type Domain } from "@/lib/content";

const FILTERS: ("all" | Domain)[] = ["all", "p2p", "pay", "o2c", "r2r", "bnk", "grp"];

export default function PatternsCard() {
  const [filter, setFilter] = useState<"all" | Domain>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = PATTERNS.filter((p) => filter === "all" || p.domain === filter);

  return (
    <article className="fcard">
      <div className="fh"><h3>Fraud patterns</h3><a className="more" href="#areas">Risk areas →</a></div>
      <p className="s">From vendor fraud to round-tripping</p>
      <p className="d">Zenetra&apos;s detections cover purchasing, payroll, sales, journals, banking and related parties. Each pattern is described in terms your finance team and board can follow.</p>
      <div className="mock tinted">
        <div className="rchips" role="group" aria-label="Filter patterns">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="rchip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : DOMAIN_LABEL[f].short}
            </button>
          ))}
        </div>
        <div className="rlist">
          {list.map((p) => {
            const d = DOMAIN_LABEL[p.domain], isOpen = open === p.id;
            return (
              <div className="rr" key={p.id}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)}>
                  <span className="id">{p.id}</span>
                  <span className="n">{p.name}</span>
                  <span className={`tag ${d.tone}`}>{d.short}</span>
                </button>
                <div className="x" hidden={!isOpen}>
                  {p.desc}
                  <b>{p.kind} · Shows up in: {p.where}</b>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
