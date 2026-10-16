"use client";

import { useState } from "react";
import { AREA_LABEL, PATTERNS, type Area } from "@/lib/content";

const FILTERS: ("all" | Area)[] = ["all", "vendor", "approval", "payment", "group"];

export default function PatternsCard() {
  const [filter, setFilter] = useState<"all" | Area>("all");
  const [open, setOpen] = useState<string | null>(null);
  // Reference IDs follow the procure-to-pay (P2P) numbering format and stay fixed when filtering.
  const list = PATTERNS
    .map((p, i) => ({ ...p, ref: `P2P-${String(i + 1).padStart(2, "0")}` }))
    .filter((p) => filter === "all" || p.area === filter);

  return (
    <article className="fcard">
      <div className="fh"><h3>Fraud patterns</h3><a className="more" href="#areas">Risk areas →</a></div>
      <p className="s">Known fraud schemes, explained plainly</p>
      <p className="d">Zenetra&apos;s detections are built around established fraud typologies. Each one is described in terms your finance team and board can follow.</p>
      <div className="mock tinted">
        <div className="rchips" role="group" aria-label="Filter patterns">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="rchip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : AREA_LABEL[f].short}
            </button>
          ))}
        </div>
        <div className="rlist">
          {list.map((p) => {
            const a = AREA_LABEL[p.area], isOpen = open === p.name;
            return (
              <div className="rr" key={p.name}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.name)}>
                  <span className="id">{p.ref}</span>
                  <span className="n">{p.name}</span>
                  <span className={`tag ${a.tone}`}>{a.short}</span>
                </button>
                <div className="x" hidden={!isOpen}>{p.desc}<b>Shows up in: {p.where}</b></div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
