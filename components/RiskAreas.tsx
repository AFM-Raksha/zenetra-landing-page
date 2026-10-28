import { PATTERNS, RISK_AREAS } from "@/lib/content";

const byId = (id: string) => PATTERNS.find((p) => p.id === id);

// A rule tag with a small card that opens on hover or keyboard focus.
function RuleTag({ id, tone }: { id: string; tone: string }) {
  const p = byId(id);
  if (!p) return <span className={`tag ${tone} mono`}>{id}</span>;
  return (
    <span className="rtag" tabIndex={0} aria-describedby={`tip-${id}`}>
      <span className={`tag ${tone} mono`}>{id}</span>
      <span className="rtip" role="tooltip" id={`tip-${id}`}>
        <span className="rtip-h"><span className="rtip-id">{id}</span><b>{p.name}</b></span>
        <span className="rtip-d">{p.desc}</span>
      </span>
    </span>
  );
}

export default function RiskAreas() {
  return (
    <section className="sec greyband" id="areas">
      <div className="wrap">
        <div className="head-block">
          <p className="eyebrow">Several risk areas</p>
          <h2 className="h2" data-reveal>Different leaks need different detections.</h2>
          <p className="lead">
            Misappropriations rarely look like bad entries. It shows up as a pattern across customers, vendors, payroll, accounting transactions and bank accounts, and often across companies. Zenetra&apos;s detections are grouped by where the money leaks. Hover a tag to see what it covers.
          </p>
        </div>
        <div className="areas">
          {RISK_AREAS.map((a, i) => (
            <div className={`area${a.more ? " more" : ""}`} key={a.title}>
              <span className="no">0{i + 1}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              {a.tags.length > 0 && <div className="tags">
                {a.tags.map((t) => (
                  a.concept
                    ? <span key={t} className="tag g">{t}</span>
                    : <RuleTag key={t} id={t} tone={a.tone} />
                ))}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
