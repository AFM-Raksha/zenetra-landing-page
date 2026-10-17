import { SOURCES_1, SOURCES_2 } from "@/lib/content";

const ICON = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// One editorial sentence, with each claim as an inline token that lights up in turn.
function Statement() {
  const tok = (delay: number, icon: React.ReactNode, text: string) => (
    <span className="tok" style={{ animationDelay: `${delay}s` }}>
      <i>{icon}</i>{text}
    </span>
  );
  return (
    <p className="stats-sentence">
      Zenetra monitors {tok(0, <svg {...ICON}><circle cx="8" cy="8" r="6" /><path d="M8 2v6h6" /></svg>, "100%")} of your transactions,
      across {tok(2.6, <svg {...ICON}><circle cx="4" cy="4" r="2" /><circle cx="12" cy="4" r="2" /><circle cx="8" cy="12" r="2" /><path d="M5.5 5.5l1.5 4.8M10.5 5.5L9 10.3M6 4h4" /></svg>, "every entity")} in your group,
      with {tok(5.2, <svg {...ICON}><rect x="3.5" y="7" width="9" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>, "read-only")} access
      <span className="muted"> to the ERP and other sources you already run.</span>
    </p>
  );
}

function Track({ items, id }: { items: [string, string, string, string][]; id: string }) {
  // Two copies for the visual loop, then a duplicate set hidden from screen readers.
  const set = [...items, ...items];
  return (
    <div className="marq-track" id={id}>
      {[...set, ...set].map(([name, color, abbr, note], i) => (
        <span className="src" key={i} aria-hidden={i >= set.length ? true : undefined}>
          <i style={{ background: color }}>{abbr}</i>
          {name}
          {note && <small>{note}</small>}
        </span>
      ))}
    </div>
  );
}

export default function StatsSources() {
  return (
    <section className="greyband" style={{ paddingBlock: "8px 64px" }}>
      <div className="wrap">
        <Statement />
        <p className="eyebrow center" style={{ marginBottom: 18 }}>Works with Zoho Books, Tally, SAP &amp; other sources &amp; more</p>
        <div className="marq"><Track items={SOURCES_1} id="mq1" /></div>
        <div className="marq rev" style={{ marginTop: 10 }}><Track items={SOURCES_2} id="mq2" /></div>
      </div>
    </section>
  );
}
