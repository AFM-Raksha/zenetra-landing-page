import { Arrow, Chk } from "./Icons";

export default function FinalCta() {
  return (
    <section className="sec final">
      <div className="wrap">
        <p className="eyebrow">Get started</p>
        <h2 data-reveal>Connect one company today.<br /><span className="taupe">See every flag tomorrow.</span></h2>
        <p className="lead">Start with one entity and one quarter. Add the rest of the group when you&apos;ve seen what it finds.</p>
        <a className="btn" href="#contact">Request a scan <Arrow /></a>
        <div className="chks">
          <Chk>100% of entries</Chk>
          <Chk>Read-only</Chk>
          <Chk>Explained flags</Chk>
          <Chk>Group-wide rules</Chk>
        </div>
      </div>
    </section>
  );
}
