import { PATTERNS, RISK_AREAS } from "@/lib/content";

const byId = (id: string) => PATTERNS.find((p) => p.id === id);

export default function RiskAreas() {
  return (
    <section className="sec greyband" id="areas">
      <div className="wrap">
        <div className="head-block">
          <p className="eyebrow">Nine risk areas</p>
          <h2 className="h2" data-reveal>Different leaks need different detections.</h2>
          <p className="lead">
            Fraud rarely looks like one bad entry. It shows up as a pattern across vendors, payroll, sales, journals and bank accounts, and often across companies. Zenetra&apos;s detections are grouped by where the money leaks. Hover a tag to see what it covers.
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
                  a.concept
                    ? <span key={t} className="tag g">{t}</span>
                    : <span key={t} className={`tag ${a.tone} mono`} title={byId(t) ? `${byId(t)!.name}: ${byId(t)!.desc}` : undefined}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
