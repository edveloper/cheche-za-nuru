import Script from 'next/script';

// GA4 for Cheche Za Nuru. Measurement IDs are public; the env var only exists to override it.
// Preview deploys are skipped so test traffic stays out of the reports.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-8R1WYES435';

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
