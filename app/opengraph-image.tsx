import { ImageResponse } from "next/og";
import { ZMark } from "@/lib/og-mark";

export const alt = "Zenetra: monitor every transaction across every company in your group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)", color: "#202020" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ZMark width={64} />
          <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1 }}>Zenetra</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, letterSpacing: -4, lineHeight: 1 }}>
            Monitor&nbsp;<span style={{ color: "#A8723F" }}>every</span>&nbsp;transaction.
          </div>
          <div style={{ display: "flex", fontSize: 54, letterSpacing: -2, color: "#A2978C", marginTop: 18 }}>
            Across every company, every day.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#3D3D42" }}>
          {["100% of transactions", "Read-only access", "Zoho Books, Tally, SAP & more"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "#FFFFFF", border: "1px solid #E3E3E6" }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
