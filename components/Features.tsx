import CoverageCard from "./CoverageCard";
import PatternsCard from "./PatternsCard";
import EvidenceCard from "./EvidenceCard";
import { ENTITIES } from "@/lib/content";

function GapsCard() {
  return (
    <article className="fcard">
      <div className="fh"><h3>Gaps, named</h3></div>
      <p className="s">Missing data is never reported as clean</p>
      <p className="d">When a source isn&apos;t connected, the detections that depend on it are marked as not run, with the reason. You always know what was actually covered.</p>
      <div className="mock tinted">
        <div className="gap-top">
          <svg className="donut" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#ECEDEF" strokeWidth="9" />
            <circle cx="40" cy="40" r="32" fill="none" stroke="#B07A45" strokeWidth="9" strokeLinecap="round" strokeDasharray="134 201" transform="rotate(-90 40 40)" />
            <text x="40" y="45" textAnchor="middle" style={{ font: "500 15px var(--f)", fill: "#202020" }}>4/6</text>
          </svg>
          <div><b>4 of 6 data sources connected</b><span>{ENTITIES.IND} · March · 18,240 entries</span></div>
        </div>
        <ul className="gl">
          <li><span className="r">Purchases and payments</span><span className="pill ok">Connected</span></li>
          <li><span className="r">Sales and receipts</span><span className="pill ok">Connected</span></li>
          <li><span className="r">Journals and change history</span><span className="pill ok">Connected</span></li>
          <li><span className="r">Payroll register</span><span className="pill g">Not connected</span><span className="why">Payroll detections paused</span></li>
          <li><span className="r">Related-party register</span><span className="pill g">Not connected</span><span className="why">Related-party detections paused</span></li>
        </ul>
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section className="sec" id="features" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head-block center">
          <h2 className="h2" data-reveal>Every flag comes with proof <span className="taupe">and context</span></h2>
        </div>
        <div className="fgrid">
          <CoverageCard />
          <PatternsCard />
          <EvidenceCard />
          <GapsCard />
        </div>
      </div>
    </section>
  );
}
