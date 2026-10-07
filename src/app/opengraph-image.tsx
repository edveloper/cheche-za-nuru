import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Cheche Za Nuru Foundation: School, Health and Sport for Children in Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo", "czn-logo-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#2a245e",
          color: "#fffdf8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "760px",
            padding: "72px",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#f5c11a", letterSpacing: 2 }}>
            CHECHE ZA NURU FOUNDATION
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            School, Health and Sport for Children in Kenya
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(255,253,248,0.75)" }}>
            chechezanurufoundation.org
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            background: "#f5821f",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 340,
              height: 340,
              borderRadius: 999,
              background: "#fffdf8",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={280} height={280} alt="" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
