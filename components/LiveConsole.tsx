"use client";

import { useEffect, useRef, useState } from "react";
import { ENTRY_KINDS, FLAG_TYPES, flagsFor, inr, type FlagType } from "@/lib/content";

const TICKS = 16;
const MAX_ROWS = 8;
const ENT = ["IND", "EXP", "RET"];
// Weighted list of entry kinds, so purchases stream more often than bank entries.
const KIND_POOL = ENTRY_KINDS.flatMap((k) => Array<typeof k>(k.weight).fill(k));

type Row = {
  id: number; time: string; party: string; ent: string; voucher: string; amt: number;
  flag: FlagType | null; hit: number; run: boolean; done: boolean; fresh: boolean;
};

// Seeded generator so the server render and first client render match.
function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function makeRow(rand: () => number, clock: number, vn: number, fresh: boolean): Row {
  const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)];
  const kind = pick(KIND_POOL);
  const amt = Math.round((8000 + rand() * rand() * 1400000) / 10) * 10;
  const isFlag = rand() < 0.17;
  return {
    id: vn,
    time: `${pad(Math.floor(clock / 3600) % 24)}:${pad(Math.floor(clock / 60) % 60)}:${pad(clock % 60)}`,
    party: pick(kind.parties), ent: pick(ENT), voucher: `${kind.vt}/25-26/${vn}`, amt,
    flag: isFlag ? pick(flagsFor(kind.domain)) : null, hit: Math.floor(rand() * TICKS),
    run: !fresh, done: !fresh, fresh,
  };
}

function initialRows() {
  const rand = seeded(42);
  let clock = 10 * 3600 + 5 * 60;
  const rows: Row[] = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    clock += 7 + Math.floor(rand() * 40);
    rows.unshift(makeRow(rand, clock, 1181 + i, false));
  }
  return { rows, clock, vn: 1180 + MAX_ROWS };
}

export default function LiveConsole() {
  const [{ rows }, setState] = useState(() => ({ rows: initialRows().rows }));
  const [checked, setChecked] = useState(18240);
  const [flags, setFlags] = useState(7);
  const [toast, setToast] = useState<{ flag: FlagType; party: string; amt: number } | null>(null);
  const [toastOn, setToastOn] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const init = initialRows();
    let clock = init.clock, vn = init.vn, visible = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; });
    if (listRef.current) io.observe(listRef.current);

    const add = () => {
      if (!visible || document.hidden) return;
      clock += 7 + Math.floor(Math.random() * 40);
      const row = makeRow(Math.random, clock, ++vn, true);
      setState((s) => ({ rows: [row, ...s.rows].slice(0, MAX_ROWS) }));
      requestAnimationFrame(() => requestAnimationFrame(() =>
        setState((s) => ({ rows: s.rows.map((r) => (r.id === row.id ? { ...r, run: true } : r)) }))));
      later(() => {
        setState((s) => ({ rows: s.rows.map((r) => (r.id === row.id ? { ...r, done: true } : r)) }));
        setChecked((c) => c + 1);
        if (row.flag) {
          setFlags((f) => f + 1);
          setToast({ flag: row.flag, party: row.party, amt: row.amt });
          setToastOn(true);
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => setToastOn(false), 3200);
        }
      }, TICKS * 34 + 200);
    };
    const iv = setInterval(add, 1250);
    return () => { clearInterval(iv); io.disconnect(); timers.forEach(clearTimeout); clearTimeout(toastTimer); };
  }, []);

  const shown = toast ?? { flag: FLAG_TYPES[1], party: "Shree Ganesh Polymers", amt: 640000 };

  return (
    <div className="console-wrap">
      <div className="console" aria-label="Live monitoring console, demo data">
        <div className="c-head">
          <span className="t">Live monitoring <span>· TestCo</span></span>
          <span className="live"><i />Streaming</span>
        </div>
        <div className="c-cols" aria-hidden="true">
          <span>Time</span><span>Entry</span><span>Amount</span><span>Checks</span><span>Result</span>
        </div>
        <div className="lrows" ref={listRef}>
          {rows.map((r) => (
            <div key={r.id} className={`lrow${r.done && r.flag ? " flagged" : ""}`} style={r.fresh ? undefined : { animation: "none" }}>
              <span className="tm">{r.time}</span>
              <span className="who"><b>{r.party}</b><span>{r.voucher}</span><em>{r.ent}</em></span>
              <span className="amt">{inr(r.amt)}</span>
              <span className={`ticks${r.run ? " run" : ""}`}>
                {Array.from({ length: TICKS }, (_, k) => (
                  <i key={k} className={r.done && r.flag && k === r.hit ? "hit" : undefined}
                    style={{ transitionDelay: r.done ? "0ms" : `${k * 34}ms` }} />
                ))}
              </span>
              <span className="st">
                {!r.done ? <span className="pill g">Checking</span>
                  : r.flag ? <span className="pill flag mono">{r.flag.id}</span>
                  : <span className="pill ok">Clear</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="c-foot">
          <div><div className="k">Monitored today</div><div className="v">{checked.toLocaleString("en-IN")}</div></div>
          <div><div className="k">Open flags</div><div className="v r">{flags}</div></div>
          <div><div className="k">Coverage</div><div className="v">100%</div></div>
        </div>
      </div>
      <div className={`toast${toastOn ? " show" : ""}`} role="status" aria-live="polite">
        <div className="top"><i />New flag · {shown.flag.id}</div>
        <b>{shown.flag.name}</b>
        <span className="m">{shown.party} · {inr(shown.amt)}</span>
      </div>
    </div>
  );
}
