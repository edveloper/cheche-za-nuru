import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";

import { AuthErrorHandler } from "@/components/auth-error-handler";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ConditionalSiteChrome } from "@/components/conditional-site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | School, Health and Sport for Children in Kenya`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  // Lets the mobile action bar sit above the iPhone home indicator.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-KE"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable}`}
    >
      <body>
        <AuthErrorHandler />
        <ConditionalSiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </ConditionalSiteChrome>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
