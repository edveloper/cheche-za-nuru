import Link from "next/link";

type CtaBandProps = {
  heading: string;
  body: string;
  primaryText?: string;
  secondaryText?: string;
};

export function CtaBand({
  heading,
  body,
  primaryText = "Donate",
  secondaryText = "Other Ways to Help",
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div className="cta-band-copy">
        <h2>{heading}</h2>
        <p>{body}</p>
      </div>
      <div className="cta-band-actions">
        <Link className="primary-button cta-donate-button" href="/donate">
          {primaryText}
        </Link>
        <Link className="secondary-link cta-secondary-link" href="/get-involved">
          {secondaryText}
        </Link>
      </div>
    </section>
  );
}
