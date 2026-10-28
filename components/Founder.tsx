import Image from "next/image";

// Ordered by weight: a standing leadership role first, then speaking for the national institute,
// then a competition result.
const CREDENTIALS: [string, string][] = [
  ["Chairman, AI and Technology Initiatives Committee", "KSCAA"],
  ["Speaker", "ICAI"],
  ["Finalist, AI Hackathon", "ICAI"],
];

export default function Founder() {
  return (
    <section className="sec" id="founder">
      <div className="wrap">
        <div className="founder">
          <div className="founder-photo">
            <Image src="/team/prabhava-hegde.jpg" alt="CA Prabhava Hegde" width={512} height={512} sizes="(max-width: 860px) 280px, 400px" />
            <div className="founder-plate">
              <span className="fp-title">Chartered Accountant</span>
            </div>
          </div>
          <div className="founder-body">
            <p className="eyebrow">The mind behind Zenetra</p>
            <h2 className="founder-name">CA Prabhava Hegde</h2>
            <blockquote>
              &ldquo;I find what went wrong. And fix systems so it doesn&apos;t recur.&rdquo;
            </blockquote>
            <div className="founder-bio">
              <p>
                Prabhava Hegde is a Chartered Accountant and co-founding partner at <a className="quiet-link" href="https://hruca.com" target="_blank" rel="noopener">Hegde Raj &amp; Ullody</a>, a 35-member firm in Bengaluru. In 7+ years of practice, he has led various internal audits and forensic audits. He also assists law enforcement agencies in financial investigations. He builds automations that bring audit and technology together. Through Zuna, the firm&rsquo;s technology and virtual CFO practice, he serves clients in India and the US.
              </p>
              <p>Zenetra turns lessons from these investigations into early warnings. Issues surface in time to act.</p>
            </div>
            <dl className="founder-creds">
              {CREDENTIALS.map(([role, org]) => (
                <div key={role}><dt>{role}</dt><dd>{org}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
