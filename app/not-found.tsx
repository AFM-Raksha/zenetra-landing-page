import Link from "next/link";
import { SpriteDefs, Arrow } from "@/components/Icons";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="final sec" style={{ minHeight: "100vh", display: "grid", alignItems: "center" }}>
      <SpriteDefs />
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Zenetra home"><b>Zenetra</b></Link>
        <p className="eyebrow">404</p>
        <h1 className="h2">This page doesn&apos;t exist.</h1>
        <p className="lead">The link may be broken, or the page may have moved.</p>
        <Link className="btn" href="/">Back to Zenetra <Arrow /></Link>
      </div>
    </main>
  );
}
