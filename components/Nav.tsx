import { Arrow, Mark } from "./Icons";

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#top" aria-label="Zenetra home">
          <Mark />
          <b>Zenetra</b>
          <span className="badge">ENTERPRISE</span>
        </a>
        <nav aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#areas">What it detects</a>
          <a href="#group">Group monitoring</a>
          <a href="#security">Security</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn sm" href="#contact">Request a demo <Arrow /></a>
      </div>
    </header>
  );
}
