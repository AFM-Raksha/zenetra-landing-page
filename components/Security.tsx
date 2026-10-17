const ICON = { width: 18, height: 18, viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: 1.5 };

const ITEMS: [string, string, React.ReactNode][] = [
  ["Read-only by design", "Connectors read vouchers and masters from your ERP. They cannot post, edit or delete.", <svg key="a" {...ICON}><rect x="3" y="8" width="12" height="8" rx="2" /><path d="M6 8V6a3 3 0 016 0v2" /></svg>],
  ["Runs in your environment", "Monitoring runs where your data lives. Nothing is pooled with other clients.", <svg key="b" {...ICON}><rect x="2.5" y="3" width="13" height="5" rx="1.5" /><rect x="2.5" y="10" width="13" height="5" rx="1.5" /></svg>],
  ["Encrypted credentials", "OAuth tokens are encrypted at rest and scoped to each company.", <svg key="c" {...ICON}><circle cx="7" cy="9" r="3.5" /><path d="M10.5 9H16M14 9v2.5" /></svg>],
  ["Every flag is traceable", "Each flag links to the voucher, user and timestamp behind it.", <svg key="d" {...ICON}><path d="M3 4h12M3 9h8M3 14h5" /><circle cx="14" cy="13" r="2.2" /></svg>],
  ["Versioned detections", "The detection version behind every flag is recorded, so results can be reproduced.", <svg key="e" {...ICON}><path d="M5 3v12M5 6h6a2 2 0 012 2v0a2 2 0 01-2 2H5" /></svg>],
  ["Gaps are named", "Detections that cannot run are listed with the reason, every period.", <svg key="f" {...ICON}><circle cx="9" cy="9" r="6.5" /><path d="M9 5.5v4M9 12v.3" /></svg>],
];

export default function Security() {
  return (
    <section className="sec greyband" id="security">
      <div className="wrap">
        <div className="head-block center">
          <p className="eyebrow">Security</p>
          <h2 className="h2" data-reveal>Your data stays <em className="acc">yours.</em></h2>
          <p className="lead">Built for management teams who answer to boards and regulators. Every design choice starts from least access.</p>
        </div>
        <div className="sgrid">
          {ITEMS.map(([title, text, icon]) => (
            <div className="scard" key={title}>
              <span className="ic">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
