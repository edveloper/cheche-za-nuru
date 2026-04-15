type PageSectionProps = {
  label?: string;
  title: string;
  body?: string;
  children: React.ReactNode;
  tone?: "default" | "tint" | "dark";
};

export function PageSection({
  label,
  title,
  body,
  children,
  tone = "default",
}: PageSectionProps) {
  const className =
    tone === "dark"
      ? "page-section page-section-dark"
      : tone === "tint"
        ? "page-section page-section-tint"
        : "page-section";

  return (
    <section className={className}>
      <div className="section-heading">
        {label ? <p className="section-label">{label}</p> : null}
        <h2>{title}</h2>
        {body ? <p className="section-body">{body}</p> : null}
      </div>
      {children}
    </section>
  );
}
