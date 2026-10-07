"use client";

import { useState } from "react";

type DomainView = {
  slug: string;
  label: string;
  intro: string;
  response: string;
  stats: readonly {
    label: string;
    value: number;
    suffix: string;
    detail: string;
    sourceLabel: string;
    sourceUrl: string;
  }[];
};

type CountyPressure = {
  area: string;
  value: number;
  tone: "high" | "medium";
  label: string;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
};

type ImpactVisualizationsProps = {
  domains: readonly DomainView[];
  countyPressure: readonly CountyPressure[];
};

function formatFigure(value: number, suffix: string) {
  if (suffix === "M") {
    return `${value}${suffix}`;
  }

  if (!suffix) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return `${value}${suffix}`;
}

export function ImpactVisualizations({
  domains,
  countyPressure,
}: ImpactVisualizationsProps) {
  const [activeDomain, setActiveDomain] = useState(domains[0]?.slug ?? "education");

  const selectedDomain =
    domains.find((domain) => domain.slug === activeDomain) ?? domains[0];

  return (
    <div className="impact-visuals">
      <section className="impact-viz-block">
        <div className="impact-tabs" role="tablist" aria-label="Impact domains">
          {domains.map((domain) => (
            <button
              key={domain.slug}
              type="button"
              role="tab"
              aria-selected={selectedDomain.slug === domain.slug}
              className={
                selectedDomain.slug === domain.slug ? "impact-tab impact-tab-active" : "impact-tab"
              }
              onClick={() => setActiveDomain(domain.slug)}
            >
              {domain.label}
            </button>
          ))}
        </div>

        <div className="impact-domain-panel">
          <div className="impact-domain-copy">
            <p>{selectedDomain.intro}</p>
            <p className="impact-domain-response">{selectedDomain.response}</p>
          </div>

          <div className="impact-bars">
            {selectedDomain.stats.map((stat) => {
              // Only percentages get a bar; a bar for "2.5M" or "900,000" would mean nothing.
              const isPercentage = stat.suffix.includes("%");

              return (
                <article key={stat.label} className="impact-bar-card">
                  <div className="impact-bar-head">
                    <strong>{formatFigure(stat.value, stat.suffix)}</strong>
                    <span>{stat.label}</span>
                  </div>
                  {isPercentage ? (
                    <div className="impact-bar-track" aria-hidden="true">
                      <span
                        className="impact-bar-fill"
                        style={{ width: `${Math.min(stat.value, 100)}%` }}
                      />
                    </div>
                  ) : null}
                  <p>{stat.detail}</p>
                  <a href={stat.sourceUrl} target="_blank" rel="noreferrer" className="text-link">
                    {stat.sourceLabel}
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="impact-viz-block">
        <div className="section-heading impact-inline-heading">
          <p className="section-label">Where It&apos;s Worst</p>
          <h2>The National Average Hides the Hardest Places</h2>
          <p className="section-body">
            In Kitui and West Pokot, child stunting reaches 46 per cent. That is nearly one child in two.
          </p>
        </div>

        <div className="impact-heat-grid">
          {countyPressure.map((item) => (
            <article
              key={item.area}
              className={
                item.tone === "high"
                  ? "impact-heat-card impact-heat-card-high"
                  : "impact-heat-card impact-heat-card-medium"
              }
            >
              <div className="impact-heat-top">
                <h3>{item.area}</h3>
                <strong>{item.value}%</strong>
              </div>
              <p className="card-label">{item.label}</p>
              <p>{item.note}</p>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-link">
                {item.sourceLabel}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
