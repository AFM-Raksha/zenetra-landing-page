import { Arrow } from "./Icons";

const STEPS: [string, string][] = [
  ["Connect", "Authorise a read-only link to each company's ERP: Zoho Books, Tally, SAP and more."],
  ["Map", "Every entity, vendor, employee, customer and journal lands in one model."],
  ["Monitor", "Detections run on every sync, inside and across companies."],
  ["Resolve", "Flags arrive with evidence. Your team works them to closure."],
];

export default function HowItWorks() {
  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="head-block center">
          <p className="eyebrow">How it works</p>
          <h2 className="h2" data-reveal>From read-only access to first flags in 4 steps.</h2>
        </div>
        <div className="how">
          {STEPS.map(([label, text], i) => (
            <div className="hcard" key={label}>
              <div className="lab"><span className="num">{i + 1}</span><span className="pl">{label}</span></div>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="hcta"><a className="btn" href="#contact">Request a demo <Arrow /></a></div>
      </div>
    </section>
  );
}
