import { Mark } from "./Icons";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid2">
          <div>
            <a className="brand" href="#top"><Mark /><b>Zenetra</b></a>
            <p className="about">Continuous transaction monitoring and fraud detection for companies and groups.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul><li><a href="#how">How it works</a></li><li><a href="#areas">What it detects</a></li><li><a href="#group">Group monitoring</a></li><li><a href="#board">Flag board</a></li></ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul><li><a href="#features">Sample flag</a></li><li><a href="#security">Security</a></li><li><a href="#faq">FAQ</a></li></ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul><li><a href="#contact">Request a demo</a></li></ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Zenetra</span>
          <span>Sample page · TestCo, its vendors and all amounts are illustrative</span>
        </div>
      </div>
    </footer>
  );
}
