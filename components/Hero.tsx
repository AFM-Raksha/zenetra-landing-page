import { Arrow, Check, Chk } from "./Icons";
import LiveConsole from "./LiveConsole";

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <div className="badges">
            <span className="badge2"><i><Check size={10} /></i>Read-only access</span>
            <span className="badge2"><i><Check size={10} /></i>Runs in your environment</span>
          </div>
          <h1>
            Monitor <em className="acc">every</em> transaction.
            <span className="taupe">Across every company, every day.</span>
          </h1>
          <p className="sub">
            <b>Zenetra monitors 100% of your transactions</b> for fraud patterns across every company in your group, and backs every flag with evidence.
          </p>
          <div className="ctas">
            <a className="btn" href="#contact">Request a demo <Arrow /></a>
            <a className="btn2" href="#features">See a sample flag</a>
          </div>
          <div className="chks">
            <Chk>Zoho Books, Tally, SAP &amp; more</Chk>
            <Chk>Every entity in one view</Chk>
            <Chk>Evidence on every flag</Chk>
          </div>
        </div>
        <LiveConsole />
      </div>
    </section>
  );
}
