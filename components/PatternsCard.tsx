"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DOMAIN_LABEL, PATTERNS, type Pattern } from "@/lib/content";

// Every pattern scrolls past in a random order. Clicking one pauses the reel and opens it in place.
const SECONDS_PER_ROW = 2.4;

function shuffled(list: Pattern[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function PatternsCard() {
  // The server renders the library in its stored order; the browser reshuffles it on every load.
  const [order, setOrder] = useState<Pattern[]>(PATTERNS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [nudge, setNudge] = useState(0);
  const reelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOrder(shuffled(PATTERNS)));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenId(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [openId]);

  // If the opened row would end up under the bottom fade, lift the list just enough to show it.
  useLayoutEffect(() => {
    const reel = reelRef.current, item = openRef.current;
    if (!openId || !reel || !item) { setNudge(0); return; }
    const t = setTimeout(() => {
      const visibleBottom = reel.getBoundingClientRect().top + reel.clientHeight * 0.8;
      const over = item.getBoundingClientRect().bottom - visibleBottom;
      setNudge(over > 0 ? over : 0);
    }, 260);
    return () => clearTimeout(t);
  }, [openId]);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  // The list is rendered twice for a seamless loop. Both copies open together so the loop stays even.
  const item = (p: Pattern, copy: number) => {
    const d = DOMAIN_LABEL[p.domain];
    const open = openId === p.id;
    return (
      <div key={`${copy}-${p.id}`} className={`reel-item${open ? " on" : ""}`} aria-hidden={copy ? true : undefined}
        ref={open && copy === 0 ? openRef : undefined}>
        <button type="button" className="reel-row" tabIndex={copy ? -1 : 0} aria-expanded={copy ? undefined : open}
          aria-controls={copy ? undefined : `pat-${p.id}`} onClick={() => toggle(p.id)}>
          <span className="id">{p.id}</span>
          <span className="n">{p.name}</span>
          <span className={`tag ${d.tone}`}>{d.short}</span>
        </button>
        <div className="reel-x" id={copy ? undefined : `pat-${p.id}`}>
          <div><p>{p.desc}</p></div>
        </div>
      </div>
    );
  };

  return (
    <article className="fcard">
      <div className="fh"><h3>Unusual patterns</h3><a className="more" href="#areas">Risk areas →</a></div>
      <p className="s">From vendor misappropriations to round-tripping</p>
      <p className="d">Zenetra&apos;s detections cover purchasing, payroll, sales, journals, banking and related parties, built around fraud indicators and exceptions that management teams cannot ignore.</p>
      <div className="mock tinted">
        <div className={`reel${openId ? " paused" : ""}`} ref={reelRef}>
          <div className="reel-shift" style={{ transform: `translateY(${-nudge}px)` }}>
            <div className="reel-track" style={{ animationDuration: `${order.length * SECONDS_PER_ROW}s` }}>
              {order.map((p) => item(p, 0))}
              {order.map((p) => item(p, 1))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
