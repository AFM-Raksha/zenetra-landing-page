"use client";

import { useEffect, useRef, useState } from "react";
import { ENTITIES } from "@/lib/content";

type View = "entity" | "group";

const STEPS = [
  { title: "Split vendor", tag: "Vendor risk", body: `Apex Supplies in ${ENTITIES.IND} and Apex Supply Co in ${ENTITIES.EXP} share one PAN. Each company sees a small vendor. Together the group paid one supplier ₹1.9 crore, above its tender limit.` },
  { title: "Shared bank account", tag: "Vendor risk", body: `Apex Supply Co and Northline Traders are paid into the same account, ••4471. Northline is also a customer of ${ENTITIES.RET}.` },
  { title: "Round-trip", tag: "Group risk", body: "₹48 lakh leaves Industries as a purchase, returns through Northline as a customer advance to Retail, then moves back to Industries as an intercompany loan. The sales and cash look real. Nothing was sold." },
];

const STORY = [
  { n: ["v1", "v2"], e: ["e1", "e2"], a: [] as string[] },
  { n: ["v2", "v3"], e: ["e3", "e4"], a: [] as string[] },
  { n: ["v1", "v2", "v3"], e: ["e5", "e1", "e2", "e3", "e4", "e6", "e7"], a: ["e5", "e6", "e7"] },
];

const CYCLE_MS = 7000;

export default function GroupView() {
  const [view, setView] = useState<View>("group");
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  // Auto-advance only while the diagram is on screen and motion is allowed.
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((es) => setAuto(es[0].isIntersecting && !reduce), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cycling = auto && view === "group";
  useEffect(() => {
    if (!cycling) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % STEPS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [cycling, cur]);

  const S = STORY[cur];
  const node = (id: string) => `vnode${S.n.includes(id) ? " on" : ""}`;
  const edge = (id: string, local = false) => `edge${local ? " local" : " cross"}${S.e.includes(id) ? " on" : ""}`;
  const amt = (id: string) => `amt${S.a.includes(id) && view === "group" ? " on" : ""}`;

  return (
    <section className="sec band" id="group">
      <div className="wrap">
        <p className="eyebrow">Group view</p>
        <h2 className="h2" style={{ marginTop: 14 }} data-reveal>
          The fraud that hides <em className="acc">between</em>
          <br />
          <span className="dm">your companies.</span>
        </h2>
        <p className="lead" style={{ marginTop: 22 }}>
          Each company can pass its own review while money moves through the gaps between them. Zenetra reads every entity as one network of vendors, people and bank accounts.
        </p>
        <div className="group">
          <div>
            <div className="vt" role="group" aria-label="Monitoring scope">
              <button type="button" aria-pressed={view === "entity"} onClick={() => setView("entity")}>Check each company</button>
              <button type="button" aria-pressed={view === "group"} onClick={() => setView("group")}>Check the group</button>
            </div>
            <div className="steps" hidden={view !== "group"}>
              {STEPS.map((s, i) => (
                <button key={s.title} className="step" type="button" aria-pressed={cur === i} onClick={() => setCur(i)}>
                  <h3>{s.title} <span className="mono">{s.tag}</span></h3>
                  <p>{s.body}</p>
                  <div className="bar"><i key={`${cur}-${cycling}`} className={cycling && cur === i ? "run" : undefined} /></div>
                </button>
              ))}
            </div>
            <div className="emsg" hidden={view === "group"}>
              <b>All three companies pass.</b> Each entity&apos;s checks find nothing unusual, because every link that matters crosses an entity boundary.
            </div>
          </div>

          <div className="graph" data-view={view} ref={graphRef}>
            <svg viewBox="0 0 760 420" role="img" aria-label="Network of three group companies, their vendors, a shared PAN and a shared bank account.">
              <rect className="ebox" x="16" y="16" width="232" height="300" rx="18" />
              <rect className="ebox" x="264" y="16" width="232" height="300" rx="18" />
              <rect className="ebox" x="512" y="16" width="232" height="300" rx="18" />
              <text className="elab" x="34" y="42">ENTITY 01</text>
              <text className="elab" x="282" y="42">ENTITY 02</text>
              <text className="elab" x="530" y="42">ENTITY 03</text>

              <path className={edge("e7")} d="M628 92 C 560 4, 200 4, 132 92" />
              <path className={edge("e5", true)} d="M132 100 L132 182" />
              <path className={edge("e8", true)} d="M380 100 L380 182" />
              <path className={edge("e6", true)} d="M628 182 L628 100" />
              <path className={edge("e1")} d="M132 190 C 140 300, 200 360, 256 366" />
              <path className={edge("e2")} d="M380 190 C 372 300, 312 360, 256 366" />
              <path className={edge("e3")} d="M380 190 C 388 300, 448 360, 504 366" />
              <path className={edge("e4")} d="M628 190 C 620 300, 560 360, 504 366" />

              <text className={amt("e5")} x="140" y="146">₹48.0L purchase</text>
              <text className={amt("e6")} x="636" y="146">₹47.5L advance</text>
              <text className={amt("e7")} x="318" y="30">₹47.5L intercompany loan</text>

              <g><rect className="hub" x="125" y="86" width="14" height="14" rx="4" /><text x="132" y="76" textAnchor="middle">{ENTITIES.IND}</text></g>
              <g><rect className="hub" x="373" y="86" width="14" height="14" rx="4" /><text x="380" y="76" textAnchor="middle">{ENTITIES.EXP}</text></g>
              <g><rect className="hub" x="621" y="86" width="14" height="14" rx="4" /><text x="628" y="76" textAnchor="middle">{ENTITIES.RET}</text></g>

              <g><circle className={node("v1")} cx="132" cy="186" r="8" /><text x="132" y="218" textAnchor="middle">Apex Supplies</text><text className="sub" x="132" y="234" textAnchor="middle">vendor V-1021</text></g>
              <g><circle className={node("v2")} cx="380" cy="186" r="8" /><text x="380" y="218" textAnchor="middle">Apex Supply Co</text><text className="sub" x="380" y="234" textAnchor="middle">vendor V-0448</text></g>
              <g><circle className={node("v3")} cx="628" cy="186" r="8" /><text x="628" y="218" textAnchor="middle">Northline Traders</text><text className="sub" x="628" y="234" textAnchor="middle">vendor + customer C-0310</text></g>

              {[132, 380, 628].map((x) => (
                <g className="okc" key={x}><rect x={x - 70} y="272" width="140" height="24" rx="12" /><text x={x} y="288" textAnchor="middle">No exceptions</text></g>
              ))}

              <g className="cross"><rect className="snode" x="186" y="352" width="140" height="30" rx="15" /><text x="256" y="371" textAnchor="middle" className="sub" style={{ fill: "#F2F1EE" }}>PAN AAKFA••21K</text></g>
              <g className="cross"><rect className="snode" x="434" y="352" width="140" height="30" rx="15" /><text x="504" y="371" textAnchor="middle" className="sub" style={{ fill: "#F2F1EE" }}>Bank a/c ••4471</text></g>
              <text className="sub cross" x="380" y="408" textAnchor="middle">Shared identifiers, visible only when entities are read together</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
