import Link from "next/link";
import { Arrow, SpriteDefs } from "./Icons";
import Nav from "./Nav";
import Footer from "./Footer";
import { LEGAL } from "@/lib/legal";

export default function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <SpriteDefs />
      <Nav />
      <main id="top" className="wrap">
        <article className="doc">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="updated">Effective {LEGAL.effectiveDate}</p>
          <p className="intro">{intro}</p>
          {children}
          <Link className="btn back" href="/">Back to Zenetra <Arrow /></Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
