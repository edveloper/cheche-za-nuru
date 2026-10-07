type IconName =
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "LinkedIn"
  | "YouTube"
  | "Email"
  | "Phone"
  | "WhatsApp"
  | "Location";

type SocialIconProps = {
  platform: IconName;
  className?: string;
};

export function SocialIcon({ platform, className }: SocialIconProps) {
  if (platform === "Email") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="m5.5 7 6.5 5 6.5-5" />
      </svg>
    );
  }

  if (platform === "Phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.3 4.8c.4-.9 1.5-1.2 2.3-.7l1.8 1c.7.4 1 1.3.7 2l-.8 2a2 2 0 0 0 .4 2.1l.8.8a2 2 0 0 0 2.1.4l2-.8c.7-.3 1.6 0 2 .7l1 1.8c.5.8.2 1.9-.7 2.3l-1.8.9c-1.8.9-4 .8-5.7-.2a19.2 19.2 0 0 1-5.2-5.2c-1-1.7-1.1-3.9-.2-5.7Z" />
      </svg>
    );
  }

  if (platform === "Location") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20.5s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" />
        <circle cx="12" cy="10.5" r="2.2" />
      </svg>
    );
  }

  if (platform === "Facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 8H17V4.5h-2.5c-3 0-5 2-5 5v2H7v3.5h2.5V20h3.5v-5H16l.5-3.5h-3.5v-2c0-.9.6-1.5 1.5-1.5Z" />
      </svg>
    );
  }

  if (platform === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "LinkedIn") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 11v5" />
        <path d="M8 8v.5" />
        <path d="M12 16v-5" />
        <path d="M12 11a3 3 0 0 1 3 3v2" />
      </svg>
    );
  }

  if (platform === "WhatsApp") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.6 20.4 4.9 16.5A8.6 8.6 0 1 1 8 19.3Z" />
        <path
          d="M9.1 8.4c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6a6.4 6.4 0 0 0 2.8 2.8l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.7.3-1.5.4-2.4.1a7.6 7.6 0 0 1-4.6-4.6c-.3-.9-.2-1.7.1-2.3Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  if (platform === "YouTube") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  /* TikTok (default) */
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 4.5v8.3a4.2 4.2 0 1 1-3.2-4.1" />
      <path d="M13.5 5.5c1.2 1.7 2.8 2.7 5 3" />
    </svg>
  );
}
