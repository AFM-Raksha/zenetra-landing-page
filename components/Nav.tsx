import Link from "next/link";
import { Arrow, Mark } from "./Icons";

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="brand" href="/#top" aria-label="Zenetra home">
          <Mark />
          <b>Zenetra</b>
          <span className="badge">ENTERPRISE</span>
        </Link>
        <nav aria-label="Primary">
          <Link href="/#how">How it works</Link>
          <Link href="/#areas">What it detects</Link>
          <Link href="/#group">Group monitoring</Link>
          <Link href="/#security">Security</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <Link className="btn sm" href="/#contact">Request a demo <Arrow /></Link>
      </div>
    </header>
  );
}
