import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cheche Za Nuru Foundation",
  description:
    "A modern foundation website for Cheche Za Nuru focused on education, healthcare, sports, and community empowerment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div className="site-shell">
          <div className="header-band">
            <div className="page-shell">
              <SiteHeader />
            </div>
          </div>
          <div className="page-shell">
            <main className="site-main">{children}</main>
          </div>
          <div className="footer-band">
            <div className="page-shell footer-inner">
              <SiteFooter />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
