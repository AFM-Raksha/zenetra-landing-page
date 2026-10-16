import { PATTERNS, RISK_AREAS } from "@/lib/content";

export default function RiskAreas() {
  return (
    <section className="sec greyband" id="areas">
      <div className="wrap">
        <div className="head-block">
          <p className="eyebrow">Six risk areas</p>
          <h2 className="h2" data-reveal>Different leaks need different detections.</h2>
          <p className="lead">
            Procurement fraud rarely looks like one bad entry. It shows up as a pattern across vendors, approvals and payments. Zenetra&apos;s detections are grouped by where the money leaks. Hover a tag to see what it covers.
          </p>
        </div>
        <div className="areas">
          {RISK_AREAS.map((a, i) => (
            <div className="area" key={a.title}>
              <span className="no">0{i + 1}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <div className="tags">
                {a.tags.map((t) => (
                  <span key={t} className={`tag ${a.tone}`} title={PATTERNS.find((p) => p.name === t)?.desc}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
