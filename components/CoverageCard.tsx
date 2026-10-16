"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const X0 = 96, X1 = 516, DAYS = 365, PITCH = (X1 - X0) / DAYS;
const EV = [38, 96, 151, 203, 262, 341];
const WIN = [332, 354];
const MONTHS = ["A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F", "M"];
const MDAYS = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31];
const MONTH_START = MDAYS.map((_, i) => MDAYS.slice(0, i).reduce((a, b) => a + b, 0));
const W = Math.max(PITCH - 0.35, 0.6);

export default function CoverageCard() {
  const [day, setDay] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef(0);

  const play = useCallback(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now(), dur = 3200;
    const f = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      if (p < 1) { setDay(p * DAYS); rafRef.current = requestAnimationFrame(f); } else setDay(null);
    };
    rafRef.current = requestAnimationFrame(f);
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let done = false;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting && !done) { done = true; play(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [play]);

  const monthMarks = MONTHS.map((m, i) => {
    const x = X0 + MONTH_START[i] * PITCH;
    return (
      <g key={i}>
        <text x={x + 2} y={14}>{m}</text>
        <line x1={x} x2={x} y1={20} y2={150} stroke="#EEEEF0" />
      </g>
    );
  });

  const headX = day === null ? null : X0 + (day / DAYS) * (X1 - X0);

  return (
    <article className="fcard">
      <div className="fh"><h3>Coverage</h3><a className="more" href="#continuous">How it works →</a></div>
      <p className="s">All 365 days, not three weeks</p>
      <p className="d">A year-end sample sees one review window. Zenetra monitors every day, so each event is flagged soon after it posts.</p>
      <div className="mock yr">
        <svg ref={svgRef} viewBox="0 0 520 168" role="img" aria-label="One financial year. The year-end sample catches 1 of 6 events. Continuous monitoring flags all 6.">
          {monthMarks}
          <text x={0} y={62} className="rl">Year-end sample</text>
          <text x={0} y={126} className="rl">Zenetra</text>
          <rect x={X0 + WIN[0] * PITCH - 2} y={42} width={(WIN[1] - WIN[0]) * PITCH + 4} height={34} rx={4} fill="#F3F4F6" stroke="#A2978C" strokeDasharray="2 3" />
          <text x={X0 + WIN[0] * PITCH - 6} y={88} textAnchor="end">review window · ~60 vouchers</text>
          {Array.from({ length: DAYS }, (_, d) => {
            const x = X0 + d * PITCH, inW = d >= WIN[0] && d < WIN[1];
            const isFlag = EV.includes(d - 1);
            const on = day === null || d <= day;
            return (
              <g key={d}>
                <rect x={x} y={46} width={W} height={26} fill={inW && d % 3 === 0 ? "#3D3D42" : "#ECEDEF"} />
                <rect x={x} y={110} width={W} height={26} fill={isFlag ? "#D8452B" : on ? "#C9C2B8" : "#ECEDEF"} />
              </g>
            );
          })}
          {EV.map((d) => {
            const x = X0 + d * PITCH + PITCH / 2, caught = d >= WIN[0] && d < WIN[1];
            return (
              <g key={d}>
                <path d={`M${x - 4} 26 L${x} 32 L${x + 4} 26 Z`} fill="#D8452B" />
                <line x1={x} x2={x} y1={34} y2={150} stroke="#D8452B" strokeWidth={0.7} strokeDasharray="2 3" opacity={0.55} />
                <circle cx={x} cy={59} r={6} fill={caught ? "#D8452B" : "#fff"} stroke="#D8452B" strokeWidth={1.2} opacity={caught ? 1 : 0.7} />
                <circle cx={x + PITCH} cy={123} r={6} fill="#D8452B" />
                <text x={x + PITCH} y={162} textAnchor="middle" style={{ fill: "#D8452B" }}>flag</text>
              </g>
            );
          })}
          {headX !== null && <line x1={headX} x2={headX} y1={104} y2={142} stroke="#B07A45" strokeWidth={2} />}
        </svg>
        <div className="yr-sum">
          <div><b>1 of 6</b><span>caught by year-end sampling</span></div>
          <div className="good"><b>6 of 6</b><span>flagged by continuous monitoring</span></div>
        </div>
        <p className="rp">Illustrative year, FY 2025–26 · <button className="replay" type="button" onClick={play}>Replay</button></p>
      </div>
    </article>
  );
}
