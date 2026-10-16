"use client";

import { useRef, useState } from "react";
import { ENTITIES } from "@/lib/content";
import { Mark } from "./Icons";

const TABS = [
  { id: "sum", label: "Summary" },
  { id: "ev", label: "Evidence" },
  { id: "pat", label: "Pattern" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function EvidenceCard() {
  const [tab, setTab] = useState<Tab>("sum");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    refs.current[n]?.focus();
  };

  return (
    <article className="fcard">
      <div className="fh"><h3>Evidence</h3><a className="more" href="#security">Traceability →</a></div>
      <p className="s">Every flag is backed by its source entries</p>
      <p className="d">Each flag carries the entries behind it and a case summary, so reviewers can act without digging through the ERP.</p>
      <div className="mock">
        <div className="fm-head">
          <div className="row">
            <span className="pill flag">High risk</span>
            <span className="pill br">Payment risk</span>
            <span className="pill g">{ENTITIES.IND}</span>
          </div>
          <h4>Bank details changed, then paid next morning</h4>
          <div className="meta">Shree Ganesh Polymers · ₹6,40,000 · 13 Mar 2026</div>
        </div>
        <div className="tabs" role="tablist" aria-label="Flag detail">
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`t-${t.id}`} aria-controls={`p-${t.id}`}
              aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="panel" role="tabpanel" id="p-sum" aria-labelledby="t-sum" hidden={tab !== "sum"}>
          <div className="sumbox">
            <div className="who"><Mark width={14} height={10} />Case summary</div>
            <p className="sumtext">
              The bank account for Shree Ganesh Polymers was changed at 18:42 on 12 March<sup>[1]</sup>, and ₹6.4 lakh was paid to the new account at 10:05 the next morning<sup>[2]</sup>. The same user made both entries. No callback confirms the change<sup>[3]</sup>, and all 41 earlier payments went to the old account<sup>[4]</sup>.
            </p>
          </div>
          <p className="sum-note">Assembled from evidence [1]–[4]. Every flag is reviewed by your team before it is closed.</p>
        </div>

        <div className="panel" role="tabpanel" id="p-ev" aria-labelledby="t-ev" hidden={tab !== "ev"}>
          <ol className="ev">
            <li><span className="num">[1]</span><div><p>Bank account changed ••2209 → ••8817</p><small>Tally change history · user ACC-04 · 12 Mar 18:42</small></div></li>
            <li><span className="num">[2]</span><div><p>₹6,40,000 paid to ••8817</p><small>PV/25-26/1184 · ACC-04 · 13 Mar 10:05</small></div></li>
            <li><span className="num">[3]</span><div><p>No callback verification on record</p><small>Callback register</small></div></li>
            <li><span className="num">[4]</span><div><p>41 earlier payments, all to ••2209</p><small>Payment history · Apr 2023 to Feb 2026</small></div></li>
          </ol>
        </div>

        <div className="panel" role="tabpanel" id="p-pat" aria-labelledby="t-pat" hidden={tab !== "pat"}>
          <dl className="kv">
            <dt>Pattern</dt><dd>Payment diversion</dd>
            <dt>What it is</dt><dd>Supplier bank details are changed shortly before a payment, so money goes to an account the supplier does not control.</dd>
            <dt>Category</dt><dd>Payment risk</dd>
            <dt>Severity</dt><dd>High</dd>
          </dl>
        </div>
      </div>
    </article>
  );
}
