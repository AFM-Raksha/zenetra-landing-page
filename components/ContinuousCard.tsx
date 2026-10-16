"use client";

import { useEffect, useRef, useState } from "react";
import { FLAG_TYPES, inr, type FlagType } from "@/lib/content";
import { Chk } from "./Icons";

type Mode = "continuous" | "sample";
type Cell = { a: boolean; s: boolean; chk: boolean; flag: boolean; miss: boolean; t: number; type?: FlagType; amt?: number };
type Col = { done: boolean; cells: Cell[] };

const COL = { cell: "#E4E3DF", on: "#C9C2B8", ink: "#202020", mute: "#8A8A8F", flag: "#D8452B", bronze: "#B07A45", bg: "#FFFFFF" };
const ANOM = 0.014, SPEED = 30;
// Periodic sampling starts small and widens slowly, to show that even large samples leave gaps.
const SAMPLE_START = 0.05, SAMPLE_END = 0.5, RAMP_S = 60;

export default function ContinuousCard() {
  const [mode, setMode] = useState<Mode>("continuous");
  const [stats, setStats] = useState({ seen: 0, chk: 0, flag: 0, miss: 0, screened: 0, rate: 5 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvasRef.current, tip = tipRef.current;
    if (!cv || !tip) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, P = 14, S = 9, rows = 0, padY = 14, beamX = 0, offset = 0, running = false, last = 0, statT = 0, raf = 0;
    let cols: Col[] = [];
    let sampleT = 0;
    const sampleRate = () => SAMPLE_START + (SAMPLE_END - SAMPLE_START) * Math.min(1, sampleT / RAMP_S);
    let st = { seen: 0, chk: 0, flag: 0, miss: 0 };

    const makeCol = (): Col => ({ done: false, cells: Array.from({ length: rows }, () => ({ a: Math.random() < ANOM, s: Math.random() < sampleRate(), chk: false, flag: false, miss: false, t: -1e9 })) });
    const proc = (col: Col, now: number) => {
      col.done = true;
      for (const c of col.cells) {
        st.seen++;
        c.chk = mode === "continuous" || c.s;
        if (c.chk) st.chk++;
        if (c.a) {
          if (c.chk) { c.flag = true; c.t = now; c.type = FLAG_TYPES[Math.floor(Math.random() * FLAG_TYPES.length)]; c.amt = Math.round((40000 + Math.random() * 1200000) / 100) * 100; st.flag++; }
          else { c.miss = true; st.miss++; }
        }
      }
    };
    const rr = (x: number, y: number, w: number, h: number, r: number) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (mode === "continuous") {
        const g = ctx.createLinearGradient(beamX - 70, 0, beamX, 0);
        g.addColorStop(0, "rgba(176,122,69,0)"); g.addColorStop(1, "rgba(176,122,69,.14)");
        ctx.fillStyle = g; ctx.fillRect(beamX - 70, 0, 70, H);
      }
      for (let i = 0; i < cols.length; i++) {
        const x = i * P - offset + (P - S) / 2, col = cols[i];
        if (x < -P || x > W) continue;
        for (let r = 0; r < rows; r++) {
          const c = col.cells[r], y = padY + r * P;
          ctx.fillStyle = c.flag ? COL.flag : c.chk ? COL.on : COL.cell;
          ctx.globalAlpha = col.done ? 1 : 0.7; rr(x, y, S, S, 2); ctx.fill(); ctx.globalAlpha = 1;
          if (mode === "sample" && c.s) { ctx.strokeStyle = COL.ink; ctx.lineWidth = 1; rr(x - 1.5, y - 1.5, S + 3, S + 3, 3); ctx.stroke(); }
          if (c.miss) { ctx.strokeStyle = COL.flag; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.arc(x + S / 2, y + S / 2, S * 0.85, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
          if (c.flag) {
            const a = (now - c.t) / 1400;
            if (a >= 0 && a < 1) { ctx.strokeStyle = COL.flag; ctx.globalAlpha = 1 - a; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + S / 2, y + S / 2, S * 0.6 + a * 16, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
          }
        }
      }
      ctx.save();
      if (mode === "continuous") { ctx.strokeStyle = COL.bronze; ctx.lineWidth = 1.5; }
      else { ctx.strokeStyle = COL.mute; ctx.setLineDash([3, 4]); ctx.lineWidth = 1; }
      ctx.beginPath(); ctx.moveTo(beamX + 0.5, 0); ctx.lineTo(beamX + 0.5, H); ctx.stroke(); ctx.restore();
      const lbl = mode === "continuous" ? "MONITORED · 100%" : `SAMPLED · ${Math.round(sampleRate() * 100)}%`;
      ctx.font = '500 10px "IBM Plex Mono", monospace'; ctx.textAlign = "right";
      const tw = ctx.measureText(lbl).width;
      ctx.fillStyle = COL.bg; ctx.fillRect(beamX - tw - 12, 5, tw + 8, 15);
      ctx.fillStyle = mode === "continuous" ? COL.bronze : COL.mute; ctx.fillText(lbl, beamX - 8, 16);
    };
    // "Screened" reflects the entries currently on screen, so it tracks the live sampling rate.
    const paint = () => {
      let done = 0, chk = 0;
      for (const col of cols) if (col.done) for (const c of col.cells) { done++; if (c.chk) chk++; }
      setStats({ ...st, screened: done ? Math.round((chk / done) * 100) : 0, rate: Math.round(sampleRate() * 100) });
    };
    const layout = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = W < 560 ? 11 : 14; S = P < 12 ? 7 : 9; rows = Math.floor((H - 28) / P); padY = (H - rows * P) / 2 + (P - S) / 2; beamX = W - P * 5;
      st = { seen: 0, chk: 0, flag: 0, miss: 0 }; cols = []; offset = 0;
      const n = Math.ceil(W / P) + 2;
      for (let i = 0; i < n; i++) { const c = makeCol(); cols.push(c); if (i * P + P / 2 <= beamX) proc(c, -1e9); }
      draw(performance.now()); paint();
    };
    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (running && !reduce) {
        if (mode === "sample") sampleT += dt;
        offset += SPEED * dt;
        while (offset >= P) { offset -= P; cols.shift(); cols.push(makeCol()); }
        for (let i = 0; i < cols.length; i++) { const c = cols[i]; if (!c.done && i * P - offset + P / 2 <= beamX) proc(c, now); }
        draw(now);
        if (now - statT > 180) { paint(); statT = now; }
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((es) => { running = es[0].isIntersecting; last = 0; });
    io.observe(cv);
    const onVis = () => { last = 0; };
    document.addEventListener("visibilitychange", onVis);
    let rz: ReturnType<typeof setTimeout> | undefined, lastW = innerWidth;
    const onResize = () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rz); rz = setTimeout(layout, 150); };
    addEventListener("resize", onResize);
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      const i = Math.floor((mx + offset) / P), row = Math.floor((my - padY + (P - S) / 2) / P);
      const c = cols[i]?.cells[row];
      if (c && (c.flag || c.miss)) {
        tip.innerHTML = c.flag && c.type ? `<b>${c.type.id}</b> · ${c.type.name}<br>${inr(c.amt ?? 0)} · flagged` : "Anomaly outside the sample<br>Passed unchecked";
        tip.style.left = Math.min(Math.max(mx, 130), W - 130) + "px"; tip.style.top = my + "px"; tip.style.opacity = "1";
      } else tip.style.opacity = "0";
    };
    const onLeave = () => { tip.style.opacity = "0"; };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);

    layout();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); clearTimeout(rz);
      document.removeEventListener("visibilitychange", onVis); removeEventListener("resize", onResize);
      cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);


  return (
    <section className="sec" id="continuous">
      <div className="wrap">
        <div className="bigcard">
          <div className="inner gridbg">
            <span className="flagship"><i />CORE</span>
            <h2 data-reveal>Continuous <em className="acc">monitoring</em></h2>
            <p className="lead">Periodic reviews test a few dozen vouchers. Zenetra screens every transaction as it posts, so nothing passes unseen.</p>
            <div className="chks">
              <Chk>Every voucher, invoice, payslip and journal</Chk>
              <Chk>Every company in the group</Chk>
              <Chk>Every sync, automatically</Chk>
            </div>
            <div className="seg" role="group" aria-label="Monitoring method">
              <button type="button" aria-pressed={mode === "continuous"} onClick={() => setMode("continuous")}>Continuous monitoring</button>
              <button type="button" aria-pressed={mode === "sample"} onClick={() => setMode("sample")}>Periodic sampling</button>
            </div>
          </div>
          <div className="stream" data-mode={mode}>
            <div className="stream-top">
              <p className="stream-cap">
                {mode === "continuous" ? "Every transaction is screened as it posts." : `Sampling now covers ${stats.rate}% of entries. The rest pass unseen.`}
              </p>
              <div className="legend" aria-hidden="true">
                <span><i style={{ background: "#E4E3DF" }} />incoming</span>
                <span><i style={{ background: "#C9C2B8" }} />screened</span>
                <span><i style={{ background: "var(--flag)" }} />flagged</span>
                <span><i style={{ border: "1.5px solid var(--flag)", opacity: 0.6 }} />missed</span>
              </div>
            </div>
            <div className="stage">
              <canvas id="ledger" ref={canvasRef} aria-label="Animated ledger. Each square is a transaction moving through monitoring." />
              <div className="tip" ref={tipRef} />
            </div>
            <div className="sstats">
              <div><div className="k">Entries seen</div><div className="v">{stats.seen.toLocaleString("en-IN")}</div></div>
              <div><div className="k">Screened</div><div className="v">{stats.screened}%</div></div>
              <div className="f"><div className="k">Flags raised</div><div className="v">{stats.flag.toLocaleString("en-IN")}</div></div>
              <div className="m"><div className="k">Missed</div><div className="v">{stats.miss.toLocaleString("en-IN")}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
