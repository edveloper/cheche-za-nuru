type PageIntroProps = {
  label: string;
  title: string;
  body: string;
  aside?: string;
};

export function PageIntro({ label, title, body, aside }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="page-intro-main">
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
        <p className="page-intro-body">{body}</p>
      </div>
      {aside ? <aside className="page-intro-aside">{aside}</aside> : null}
    </section>
  );
}
