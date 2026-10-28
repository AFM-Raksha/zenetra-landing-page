import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid2">
          <div>
            <Link className="brand" href="/#top"><b>Zenetra</b></Link>
            <p className="about">Continuous transaction monitoring and exception flagging for companies and groups.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul><li><Link href="/#how">How it works</Link></li><li><Link href="/#areas">What it detects</Link></li><li><Link href="/#group">Group monitoring</Link></li><li><Link href="/#board">Flag board</Link></li></ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul><li><Link href="/#sample-flag">Sample flag</Link></li><li><Link href="/#security">Security</Link></li><li><Link href="/#faq">FAQ</Link></li></ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul><li><Link href="/#contact">Request a demo</Link></li></ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Zenetra</span>
          <span className="legal-links"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></span>
        </div>
      </div>
    </footer>
  );
}
