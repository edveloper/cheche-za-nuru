'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

type Props = {
  /** Internal paths whose links count as an event, e.g. { '/donate': 'donate_click' }. */
  internalLinks?: Record<string, string>;
  /** Event name for links to other sites. Left out, outbound links are not counted. */
  outboundEvent?: string;
  /** Only count outbound links inside elements matching this selector. */
  outboundScope?: string;
};

/**
 * The ways people get in touch, counted without touching every link:
 * phone, email and WhatsApp links anywhere on the page, plus whatever is passed in.
 * Tools carry data-track-tool="name"; the first interaction with one sends tool_used.
 */
export function InteractionTracking({ internalLinks = {}, outboundEvent, outboundScope }: Props) {
  useEffect(() => {
    const usedTools = new Set<string>();

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const page_path = window.location.pathname;
      if (href.startsWith('tel:')) return track('phone_click', { page_path });
      if (href.startsWith('mailto:')) return track('email_click', { page_path });
      if (/(^|\/\/)(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i.test(href)) return track('whatsapp_click', { page_path });

      let url: URL;
      try { url = new URL(link.href); } catch { return; }
      if (url.host === window.location.host) {
        const name = internalLinks[url.pathname.replace(/\/$/, '') || '/'];
        if (name) track(name, { page_path, link_text: link.textContent?.trim().slice(0, 80) });
        return;
      }
      if (outboundEvent && /^https?:$/.test(url.protocol) && (!outboundScope || link.closest(outboundScope))) {
        track(outboundEvent, { page_path, link_domain: url.hostname, link_url: url.href });
      }
    };

    const onToolUse = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.('[data-track-tool]') as HTMLElement | null;
      const tool = el?.dataset.trackTool;
      if (!tool || usedTools.has(tool)) return;
      usedTools.add(tool);
      track('tool_used', { tool, page_path: window.location.pathname });
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('click', onToolUse, true);
    document.addEventListener('input', onToolUse, true);
    document.addEventListener('change', onToolUse, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('click', onToolUse, true);
      document.removeEventListener('input', onToolUse, true);
      document.removeEventListener('change', onToolUse, true);
    };
    // The props are constants at each call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
