// Sends a GA4 event when GA has loaded. Does nothing otherwise: in development,
// on preview deploys, or before a visitor has accepted analytics cookies.
type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
