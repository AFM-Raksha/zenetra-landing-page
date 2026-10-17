"use client";

import { useEffect, useRef, useState } from "react";

// One financial year (Apr 2025 – Mar 2026) drawn as twelve month calendars, GitHub style:
// each column is a week, each row a weekday. Both rows play out the same year in sync.
// Zenetra checks every day as it happens. The sample takes a handful of snapshots across the
// year (shown as soft flashes that leave a ring behind) and only sees the days inside them.

const X0 = 0, X1 = 520, GAP = 6;
const PAD = 16; // room above and below the calendar for the snapshot rings
const START = Date.UTC(2025, 3, 1);
const DAYS = 365;

const SCAN = 6500;      // ms to play out the year
const HOLD = 3800;      // ms to rest on the finished year before looping
const CYCLE = SCAN + HOLD;
const FLASH = 1600;     // ms each snapshot flash lasts

const LAYOUT = (() => {
  const raw: { month: number; col: number; row: number }[] = [];
  const colsPerMonth: number[] = [];
  for (let d = 0; d < DAYS; d++) {
    const date = new Date(START + d * 86400000);
    const month = (date.getUTCMonth() + 9) % 12; // April = 0
    const firstWd = (new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).getUTCDay() + 6) % 7; // Monday = 0
    const col = Math.floor((date.getUTCDate() - 1 + firstWd) / 7);
    raw.push({ month, col, row: (date.getUTCDay() + 6) % 7 });
    colsPerMonth[month] = Math.max(colsPerMonth[month] ?? 0, col + 1);
  }
  const totalCols = colsPerMonth.reduce((a, b) => a + b, 0);
  const pitch = (X1 - X0 - 11 * GAP) / totalCols;
  const monthX = colsPerMonth.map((_, m) => X0 + colsPerMonth.slice(0, m).reduce((a, b) => a + b, 0) * pitch + m * GAP);
  const cells = raw.map((r) => ({ x: monthX[r.month] + r.col * pitch, y: r.row * pitch }));
  return { cells, size: pitch - 1.1, height: 7 * pitch };
})();

type Snap = { from: number; to: number; at: number; ringDay: number; dx: number; dy: number };
type Year = { events: number[]; snaps: Snap[]; pct: number };

// Seeded so the server render and the first browser render match.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const atDay = (d: number) => (d / DAYS) * SCAN;

function makeYear(rand: () => number): Year {
  const pct = 15 + Math.floor(rand() * 6);
  const k = 5 + Math.floor(rand() * 4); // 5–8 snapshots
  const total = Math.round((DAYS * pct) / 100);
  const seg = DAYS / k;
  // One snapshot per slice of the year keeps them in order and spaced, so only 2–3 flash at once.
  // Window lengths vary a little but always add up to the target share of the year.
  const lens = Array.from({ length: k }, () => 0.85 + rand() * 0.3);
  const scale = total / lens.reduce((a, b) => a + b, 0);
  const sizes = lens.map((l) => Math.round(l * scale));
  sizes[k - 1] += total - sizes.reduce((a, b) => a + b, 0);
  const snaps: Snap[] = Array.from({ length: k }, (_, i) => {
    const len = sizes[i];
    // Centres stay in the middle 60% of each slice, so no more than three flashes ever overlap.
    const center = Math.round(i * seg + seg * (0.2 + 0.6 * rand()));
    const from = Math.max(0, center - Math.floor(len / 2));
    const to = Math.min(DAYS, from + len);
    // The ring lands on a random day inside the snapshot, nudged a little, so marks don't line up.
    const ringDay = from + Math.floor(rand() * (to - from));
    return { from, to, at: atDay(center), ringDay, dx: (rand() - 0.5) * 6, dy: (rand() - 0.5) * 6 };
  });
  const inSnap = (d: number) => snaps.some((s) => d >= s.from && d < s.to);
  const shown = Math.round((Array.from({ length: DAYS }, (_, d) => d).filter(inSnap).length / DAYS) * 100);

  const n = 6 + Math.floor(rand() * 15); // 6–20 fraud events
  const set = new Set<number>();
  while (set.size < n) set.add(5 + Math.floor(rand() * (DAYS - 10)));
  const events = [...set].sort((a, b) => a - b);
  // The sample should catch some of them, never none and never all.
  const caught = events.filter(inSnap);
  if (caught.length === 0) {
    const s = snaps[Math.floor(rand() * snaps.length)];
    events[Math.floor(rand() * events.length)] = s.from + Math.floor(rand() * (s.to - s.from));
  } else if (caught.length === events.length) {
    events[0] = snaps[0].from > 2 ? snaps[0].from - 2 : snaps[0].to + 2;
  }
  const unique = new Set(events);
  while (unique.size < 6) {
    const d = 5 + Math.floor(rand() * (DAYS - 10));
    if (!inSnap(d)) unique.add(d);
  }
  return { events: [...unique].sort((a, b) => a - b), snaps, pct: shown };
}

const C = { empty: "#ECEDEF", seen: "#C9C2B8", flag: "#D8452B", head: "#B07A45" };
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const MARK_R = 9;
const VIEW = `0 ${-PAD} ${X1} ${LAYOUT.height + PAD * 2}`;

const SAMPLE_POINTS = ["A few days, picked at random", "Checked after the year closes", "Found long after, often too late to act"];
const ZEN_POINTS = ["Every transaction, every day", "Checked the moment it posts", "Flagged in time to take quick decisions"];

export default function CoverageCard() {
  const [t, setT] = useState(CYCLE - 1); // at rest: the finished year
  const [year, setYear] = useState<Year>(() => makeYear(seeded(7)));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, start = 0, running = false;
    const frame = (now: number) => {
      if (!start) start = now;
      let e = now - start;
      if (e >= CYCLE) { start = now; e = 0; setYear(makeYear(Math.random)); }
      setT(e);
      if (running) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vis && !running) { running = true; start = 0; setYear(makeYear(Math.random)); raf = requestAnimationFrame(frame); }
      if (!vis) { running = false; cancelAnimationFrame(raf); setT(CYCLE - 1); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const { cells, size, height } = LAYOUT;
  const scanDay = t < SCAN ? Math.floor((t / SCAN) * DAYS) : DAYS;
  const yearDone = t >= SCAN;

  // Days inside a snapshot count as sampled once its flash fires. Only fraud days inside show it.
  const sampled = new Set<number>();
  for (const s of year.snaps) if (t >= s.at) for (let d = s.from; d < s.to; d++) sampled.add(d);
  const events = new Set(year.events);
  const headX = scanDay < DAYS ? cells[scanDay].x + size / 2 : null;

  return (
    <article className="fcard">
      <div className="fh"><h3>Coverage</h3><a className="more" href="#continuous">See it live →</a></div>
      <p className="s">All 365 days, not few days</p>
      <p className="d">A sample looks at a few documents of the year, usually after it has closed. Zenetra checks every transaction as it posts, so exceptions are flagged while there is still time to act.</p>
      <div className="mock yr" ref={wrapRef}>
        <div className="yr-row">
          <div className="yr-lab"><b>Year-end sample</b><span>a few days, checked later</span></div>
          <svg viewBox={VIEW} role="img" aria-label="Year-end sample: a few snapshots across the year, catching only the fraud inside them.">
            {cells.map((c, d) => {
              const isEvent = events.has(d);
              const caught = isEvent && sampled.has(d);
              const missed = isEvent && yearDone && !caught;
              return (
                <rect key={d} x={c.x} y={c.y} width={size} height={size} rx={0.9}
                  fill={caught ? C.flag : missed ? "#fff" : C.empty}
                  stroke={missed ? C.flag : undefined} strokeWidth={missed ? 0.9 : undefined} />
              );
            })}
            {/* Snapshot flashes: a soft ring blooms and fades, then leaves a faint ring where the sample was taken. */}
            {year.snaps.map((s, i) => {
              const p = (t - s.at) / FLASH;
              if (p <= 0) return null;
              const c = cells[s.ringDay];
              const cx = c.x + size / 2 + s.dx, cy = c.y + size / 2 + s.dy;
              const mark = <circle cx={cx} cy={cy} r={MARK_R} fill="rgba(176,122,69,0.06)" stroke={C.head} strokeWidth={1} />;
              if (p >= 1) return <g key={i} opacity={0.55}>{mark}</g>;
              const r = 3.6 + ease(p) * 12;
              const o = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
              return (
                <g key={i} style={{ pointerEvents: "none" }}>
                  <g opacity={0.55 * Math.min(1, p / 0.6)}>{mark}</g>
                  <g opacity={o * 0.85}>
                    <circle cx={cx} cy={cy} r={r} fill="rgba(176,122,69,0.10)" stroke={C.head} strokeWidth={1.2} />
                    <circle cx={cx} cy={cy} r={r * 0.45} fill="rgba(255,255,255,0.55)" />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="yr-row">
          <div className="yr-lab zen"><b>Zenetra</b><span>every transaction, as it posts</span></div>
          <svg viewBox={VIEW} role="img" aria-label="Zenetra: every day checked as it happens, with each fraud flagged straight away.">
            {cells.map((c, d) => (
              <rect key={d} x={c.x} y={c.y} width={size} height={size} rx={0.9}
                fill={d < scanDay ? (events.has(d) ? C.flag : C.seen) : C.empty} />
            ))}
            {headX !== null && <line x1={headX} x2={headX} y1={-4} y2={height + 3} stroke={C.head} strokeWidth={1.8} strokeLinecap="round" />}
          </svg>
        </div>

        <div className="yr-vs">
          <div className="vs-sample">
            <p className="yr-vs-h">Year-end sample</p>
            <ul>{SAMPLE_POINTS.map((x) => (
              <li key={x}><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>{x}</li>
            ))}</ul>
          </div>
          <div className="vs-zen">
            <p className="yr-vs-h">Zenetra</p>
            <ul>{ZEN_POINTS.map((x) => (
              <li key={x}><svg width="14" height="14" aria-hidden="true"><use href="#ick" /></svg>{x}</li>
            ))}</ul>
          </div>
        </div>
      </div>
    </article>
  );
}
