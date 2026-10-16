"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { CASES } from "@/lib/cases";
import { Mark } from "./Icons";

const TABS = [
  { id: "sum", label: "Summary" },
  { id: "ev", label: "Evidence" },
  { id: "pat", label: "Pattern" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const SHOWN = 3;
const ADVANCE_MS = 10000;

/** Renders "text[1] more[2]" with the markers as superscripts. */
function withRefs(text: string) {
  return text.split(/(\[\d\])/).map((part, i) =>
    /^\[\d\]$/.test(part) ? <sup key={i}>{part}</sup> : <Fragment key={i}>{part}</Fragment>);
}

function pickCases() {
  const idx = CASES.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, SHOWN);
}

export default function EvidenceCard() {
  // The server renders the first three cases; the browser swaps in a random three straight after loading.
  const [picks, setPicks] = useState<number[]>(() => CASES.slice(0, SHOWN).map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [tab, setTab] = useState<Tab>("sum");
  const [auto, setAuto] = useState(false);
  const [touched, setTouched] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPicks(pickCases()));
    const el = cardRef.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = el && !reduce ? new IntersectionObserver((es) => setAuto(es[0].isIntersecting), { threshold: 0.4 }) : null;
    if (el && io) io.observe(el);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, []);

  // Step through the cases on a timer until the visitor interacts.
  useEffect(() => {
    if (!auto || touched) return;
    const t = setTimeout(() => { setPos((p) => (p + 1) % SHOWN); setTab("sum"); }, ADVANCE_MS);
    return () => clearTimeout(t);
  }, [auto, touched, pos]);

  const go = (p: number) => { setTouched(true); setPos((p + SHOWN) % SHOWN); setTab("sum"); };
  const c = CASES[picks[pos]];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTouched(true);
    setTab(TABS[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <article className="fcard" id="sample-flag" ref={cardRef}>
      <div className="fh"><h3>Evidence</h3><a className="more" href="#board">Flag board →</a></div>
      <p className="s">Every flag is backed by its source entries</p>
      <p className="d">Each flag carries the entries behind it and a case summary, so reviewers can act without digging through the ERP.</p>
      <div className="mock">
        <div className="case-nav">
          <span className="case-count">Sample case {pos + 1} of {SHOWN}</span>
          <div className="case-dots" role="group" aria-label="Choose a sample case">
            {picks.map((ci, i) => (
              <button key={ci} type="button" aria-label={`Case ${i + 1}: ${CASES[ci].title}`} aria-current={i === pos} onClick={() => go(i)} />
            ))}
          </div>
          <div className="case-arrows">
            <button type="button" aria-label="Previous case" onClick={() => go(pos - 1)}>‹</button>
            <button type="button" aria-label="Next case" onClick={() => go(pos + 1)}>›</button>
          </div>
        </div>

        <div className="case-in" key={c.id} aria-live="polite">
          <div className="fm-head">
            <div className="row">
              <span className={`pill ${c.severity === "High risk" ? "flag" : "amb"}`}>{c.severity}</span>
              <span className="pill br mono">{c.id}</span>
              <span className="pill g">{c.entity}</span>
            </div>
            <h4>{c.title}</h4>
            <div className="meta">{c.meta}</div>
          </div>
          <div className="tabs" role="tablist" aria-label="Flag detail">
            {TABS.map((t, i) => (
              <button key={t.id} ref={(el) => { tabRefs.current[i] = el; }} role="tab" id={`t-${t.id}`} aria-controls={`p-${t.id}`}
                aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} onClick={() => { setTouched(true); setTab(t.id); }} onKeyDown={(e) => onKey(e, i)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="panel" role="tabpanel" id="p-sum" aria-labelledby="t-sum" hidden={tab !== "sum"}>
            <div className="sumbox">
              <div className="who"><Mark width={14} height={10} />Case summary</div>
              <p className="sumtext">{withRefs(c.summary)}</p>
            </div>
            <p className="sum-note">Assembled from evidence [1]–[{c.evidence.length}]. Every flag is reviewed by your team before it is closed.</p>
          </div>

          <div className="panel" role="tabpanel" id="p-ev" aria-labelledby="t-ev" hidden={tab !== "ev"}>
            <ol className="ev">
              {c.evidence.map((e, i) => (
                <li key={i}><span className="num">[{i + 1}]</span><div><p>{e.text}</p><small>{e.src}</small></div></li>
              ))}
            </ol>
          </div>

          <div className="panel" role="tabpanel" id="p-pat" aria-labelledby="t-pat" hidden={tab !== "pat"}>
            <dl className="kv">
              <dt>Pattern</dt><dd>{c.pattern.name} · {c.id}</dd>
              <dt>What it is</dt><dd>{c.pattern.what}</dd>
              <dt>Category</dt><dd>{c.pattern.category}</dd>
              <dt>Severity</dt><dd>{c.severity === "High risk" ? "High" : "Medium"}</dd>
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
