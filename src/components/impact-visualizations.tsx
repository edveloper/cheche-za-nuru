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

type ResponseComparison = {
  title: string;
  challengeLabel: string;
  responseLabel: string;
  challengeValue: number;
  responseValue: number;
};

type ImpactVisualizationsProps = {
  domains: readonly DomainView[];
  countyPressure: readonly CountyPressure[];
  comparisons: readonly ResponseComparison[];
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
  comparisons,
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
              const normalized = Math.min(stat.value, 100);

              return (
                <article key={stat.label} className="impact-bar-card">
                  <div className="impact-bar-head">
                    <strong>{formatFigure(stat.value, stat.suffix)}</strong>
                    <span>{stat.label}</span>
                  </div>
                  <div className="impact-bar-track" aria-hidden="true">
                    <span className="impact-bar-fill" style={{ width: `${normalized}%` }} />
                  </div>
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
          <p className="section-label">Pressure Map</p>
          <h2>County and regional pressure points show where needs intensify.</h2>
          <p className="section-body">
            Some pressures are not evenly distributed. These areas stand out more sharply when
            nutrition and poverty indicators are viewed side by side.
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

      <section className="impact-viz-block">
        <div className="section-heading impact-inline-heading">
          <p className="section-label">Challenge vs Response</p>
          <h2>Our work sits inside a challenge that is much larger than any one organization.</h2>
          <p className="section-body">
            These comparisons are not trying to claim one-for-one equivalence. They show the scale
            of the challenge beside the scale of the support we are building.
          </p>
        </div>

        <div className="impact-response-grid">
          {comparisons.map((item) => (
            <article key={item.title} className="impact-response-card">
              <h3>{item.title}</h3>
              <div className="impact-response-bars">
                <div className="impact-response-row">
                  <span>{item.challengeLabel}</span>
                  <div className="impact-response-track">
                    <span className="impact-response-fill impact-response-fill-challenge" />
                  </div>
                </div>
                <div className="impact-response-row">
                  <span>{item.responseLabel}</span>
                  <div className="impact-response-track">
                    <span
                      className="impact-response-fill impact-response-fill-response"
                      style={{ width: `${item.responseValue}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
