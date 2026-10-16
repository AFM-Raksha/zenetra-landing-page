"use client";

import { useState } from "react";
import { BOARD_CARDS, BOARD_COLUMNS, type BoardCard } from "@/lib/content";

const AVC = ["#7C5CD6", "#1B8A84", "#3567D6", "#B07A45", "#D8452B", "#1E8A5A"];

function initialColumns(): BoardCard[][] {
  const cols: BoardCard[][] = BOARD_COLUMNS.map(() => []);
  BOARD_CARDS.forEach(([c, card]) => cols[c].push(card));
  return cols;
}
const AVATAR = Object.fromEntries(BOARD_CARDS.map(([, c], k) => [c.id, AVC[k % AVC.length]]));

export default function FlagBoard() {
  const [cols, setCols] = useState(initialColumns);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<number | null>(null);

  // Move the dragged card to column `to`, before the card the pointer is above.
  const moveTo = (to: number, clientY: number, list: HTMLElement) => {
    if (!dragId) return;
    const others = [...list.querySelectorAll<HTMLElement>(".kc")].filter((k) => k.dataset.id !== dragId);
    const after = others.find((k) => clientY < k.getBoundingClientRect().top + k.offsetHeight / 2);
    setCols((prev) => {
      const card = prev.flat().find((c) => c.id === dragId);
      if (!card) return prev;
      const next = prev.map((col) => col.filter((c) => c.id !== dragId));
      const idx = after ? next[to].findIndex((c) => c.id === after.dataset.id) : next[to].length;
      const at = idx < 0 ? next[to].length : idx;
      if (prev[to][at] === card && prev[to].length === next[to].length + 1) return prev;
      next[to].splice(at, 0, card);
      return next;
    });
  };

  return (
    <section className="sec" id="board">
      <div className="wrap">
        <div className="head-block" style={{ marginBottom: 0 }}>
          <p className="eyebrow">Flag board</p>
          <h2 className="h2" data-reveal>Every flag, tracked to closure.</h2>
          <p className="lead">
            Flags land on a shared board with owners, notes and a full history. High-risk flags can be escalated immediately. Leadership sees what was raised, what was done and who signed it off.
          </p>
          <div className="feat">
            <span>Assign owners</span><span>Instant escalation</span><span>Notes and evidence</span><span>Full activity history</span><span>Board-ready export</span>
          </div>
        </div>
        <div className="board-scroll">
          <div className="board">
            {BOARD_COLUMNS.map(([name, color], ci) => (
              <div key={name} className={`col${over === ci ? " over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setOver(ci); moveTo(ci, e.clientY, e.currentTarget.querySelector(".kcards") as HTMLElement); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null); }}
                onDrop={(e) => { e.preventDefault(); setOver(null); }}>
                <div className="col-h"><i style={{ background: color }} />{name} <span>({cols[ci].length})</span></div>
                <div className="kcards">
                  {cols[ci].map((c) => (
                    <div key={c.id} data-id={c.id} className={`kc${dragId === c.id ? " dragging" : ""}`} draggable
                      onDragStart={(e) => { setDragId(c.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.id); }}
                      onDragEnd={() => { setDragId(null); setOver(null); }}>
                      <div className="top">
                        <span className="av" style={{ background: AVATAR[c.id] }}>{c.party.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                        <div><b>{c.party}</b><span className="ent">{c.entity}</span></div>
                      </div>
                      <div className="ln"><span className="rl"><span className="pill br">{c.tag}</span><span>{c.note}</span></span></div>
                      <div className="ln">
                        <span className="mono" style={{ fontSize: 12.5, color: "var(--head)" }}>{c.amount}</span>
                        <span className="score" style={{ background: `${c.color}1A`, color: c.color }}>Risk {c.risk}</span>
                      </div>
                      <span className="dt">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="bcap">Drag a flag between stages.</p>
      </div>
    </section>
  );
}
