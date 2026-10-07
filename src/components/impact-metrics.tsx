import type { ImpactMetric } from "@/lib/impact-content";
import { toTitleCase } from "@/lib/title-case";

type ImpactMetricsProps = {
  metrics: ImpactMetric[];
  heading?: string;
};

/** Full-bleed navy band of the foundation's own figures, as entered in the admin. */
export function ImpactMetrics({ metrics, heading = "So Far" }: ImpactMetricsProps) {
  if (!metrics.length) {
    return null;
  }

  return (
    <section className="stat-band full-bleed" aria-label="Our impact so far">
      <div className="stat-band-inner">
        <p className="stat-band-heading">{heading}</p>
        <div className="stat-band-grid" data-count={Math.min(metrics.length, 4)}>
          {metrics.map((metric) => (
            <div key={metric.slug} className="stat-band-item">
              <strong>{metric.value}</strong>
              <span>{toTitleCase(metric.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
