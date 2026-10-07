"use client";

import { usePathname } from "next/navigation";

import { FloatingDonate } from "@/components/floating-donate";
import { ScrollToTop } from "@/components/scroll-to-top";

interface Props {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function ConditionalSiteChrome({ header, footer, children }: Props) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="header-band">
        <div className="page-shell">{header}</div>
      </div>
      <div className="page-shell">
        <main id="main" className="site-main">{children}</main>
      </div>
      <div className="footer-band">
        <div className="page-shell footer-inner">{footer}</div>
      </div>
      <FloatingDonate />
      <ScrollToTop />
    </div>
  );
}
