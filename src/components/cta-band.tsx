import Link from "next/link";

type CtaBandProps = {
  label: string;
  heading: string;
  body: string;
  primaryText?: string;
  secondaryText?: string;
};

export function CtaBand({
  label,
  heading,
  body,
  primaryText = "Make a Donation",
  secondaryText = "Other ways to help",
}: CtaBandProps) {
  return (
    <section className="page-section page-section-orange">
      <div className="section-heading cta-heading-center">
        <p className="section-label">{label}</p>
        <h2>{heading}</h2>
        <p className="section-body">{body}</p>
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
