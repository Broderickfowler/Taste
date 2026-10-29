"use client";

import { useMemo, useState } from "react";
import type { TasteAgentResult } from "@/lib/types";

const DEFAULT_BRIEF = {
  businessName: "Casa Forma",
  businessType: "Boutique hotel",
  location: "Guadalajara, Mexico",
  audience: "Design-conscious American travelers ages 28–40",
  goal: "Increase direct bookings and cultural relevance",
  interests: "A24, Bad Bunny, Soho House",
};

function formatAffinity(value: number | null | undefined) {
  if (typeof value !== "number") return "QLOO";
  return value >= 0 && value <= 1
    ? `${Math.round(value * 100)}%`
    : value.toFixed(2);
}

export default function Home() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF);
  const [result, setResult] = useState<TasteAgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domainsWithData = useMemo(
    () => result?.domains.filter((domain) => domain.entities.length) ?? [],
    [result],
  );

  async function analyze() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...brief,
          interests: brief.interests
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Analysis failed.");
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <div className="wordmark">TASTE//OS</div>
        <div className="topmeta">
          <span>QLOO CULTURAL INTELLIGENCE</span>
          <span className="statusDot">LIVE SYSTEM</span>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">CULTURAL STRATEGY ENGINE / 001</p>
          <h1>
            Turn taste into
            <br />
            <span>business direction.</span>
          </h1>
        </div>
        <p className="heroCopy">
          TASTE//OS uses Qloo to uncover the cross-category cultural signals
          behind an audience, then converts those signals into campaigns,
          partnerships, creative direction and real-world experiences.
        </p>
      </section>

      <section className="workspace">
        <aside className="briefPanel">
          <div className="sectionLabel">01 / BUSINESS BRIEF</div>

          {[
            ["businessName", "BUSINESS"],
            ["businessType", "TYPE"],
            ["location", "LOCATION"],
            ["audience", "TARGET AUDIENCE"],
            ["goal", "OBJECTIVE"],
            ["interests", "KNOWN CULTURAL SIGNALS"],
          ].map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              {key === "audience" || key === "goal" ? (
                <textarea
                  value={brief[key as keyof typeof brief]}
                  onChange={(event) =>
                    setBrief({ ...brief, [key]: event.target.value })
                  }
                />
              ) : (
                <input
                  value={brief[key as keyof typeof brief]}
                  onChange={(event) =>
                    setBrief({ ...brief, [key]: event.target.value })
                  }
                />
              )}
            </label>
          ))}

          <p className="fieldNote">
            Separate known interests with commas. TASTE//OS resolves these to
            Qloo entities before making recommendations.
          </p>

          <button onClick={analyze} disabled={loading}>
            {loading ? "READING THE CULTURE..." : "GENERATE CULTURAL INTELLIGENCE"}
          </button>

          {error ? <div className="errorBox">{error}</div> : null}
        </aside>

        <section className="outputPanel">
          {!result ? (
            <div className="emptyState">
              <p className="eyebrow">SYSTEM READY</p>
              <h2>Start with one real audience decision.</h2>
              <p>
                The demo brief is intentionally focused on a boutique hotel in
                Guadalajara. Run it to see how Qloo taste signals become
                actionable strategy.
              </p>
              <div className="flow">
                <span>BRIEF</span><b>→</b><span>QLOO</span><b>→</b>
                <span>INTERSECTIONS</span><b>→</b><span>STRATEGY</span>
              </div>
            </div>
          ) : (
            <>
              <div className="resultHeader">
                <div>
                  <p className="eyebrow">02 / CULTURAL READ</p>
                  <h2>{result.strategy.campaignConcept.name}</h2>
                </div>
                <div className="proofBadge">
                  {result.resolvedSeeds.length} QLOO SEEDS
                </div>
              </div>

              <div className="dnaGrid">
                <div className="dnaCard primaryCard">
                  <span className="cardNumber">CULTURAL DNA</span>
                  <div className="dnaTags">
                    {result.strategy.culturalDNA.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="dnaCard">
                  <span className="cardNumber">CAMPAIGN PREMISE</span>
                  <p>{result.strategy.campaignConcept.premise}</p>
                </div>
              </div>

              <div className="sectionLabel resultLabel">
                03 / QLOO AFFINITY MAP
              </div>

              <div className="domainGrid">
                {domainsWithData.map((domain) => (
                  <article className="domainCard" key={domain.domain === "dining" ? "LOCAL PLACES" : domain.domain}>
                    <div className="domainHeading">
                      <h3>{domain.domain}</h3>
                      <span>{domain.entities.length} SIGNALS</span>
                    </div>
                    <p className="domainRationale">{domain.rationale}</p>

                    <div className="entityList">
                      {domain.entities.slice(0, 5).map((entity, index) => (
                        <div className="entityRow" key={entity.id}>
                          <span className="rank">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <strong>{entity.name}</strong>
                            <small>
                              {entity.tags.slice(0, 2).join(" / ") ||
                                entity.type ||
                                "Qloo entity"}
                            </small>
                          </div>
                          <span className="affinity">
                            {formatAffinity(entity.affinity)}
                          </span>
                          {entity.drivers?.length ? (
                            <div className="driverLine">
                              DRIVEN BY {entity.drivers.map((driver) => driver.name).join(" + ")}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="sectionLabel resultLabel">
                04 / CULTURAL INTERSECTIONS
              </div>

              <div className="intersectionGrid">
                {result.strategy.intersections.map((intersection) => (
                  <article className="intersectionCard" key={intersection.id}>
                    <div className="intersectionTopline">
                      <span>
                        {intersection.domains[0]} × {intersection.domains[1]}
                      </span>
                      <b>
                        {intersection.explainabilityAvailable
                          ? "QLOO EXPLAINABILITY"
                          : "QLOO CO-SIGNAL"}
                      </b>
                    </div>

                    <h3>
                      {intersection.signals[0].name}
                      <span> × </span>
                      {intersection.signals[1].name}
                    </h3>

                    <p className="intersectionEvidence">
                      {intersection.evidence}
                    </p>

                    <div className="intersectionOpportunity">
                      <span>BUSINESS OPPORTUNITY</span>
                      <p>{intersection.opportunity}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="sectionLabel resultLabel">
                05 / STRATEGY TRANSLATION
              </div>

              <div className="strategyGrid">
                {[
                  ["CREATIVE DIRECTION", result.strategy.creativeDirection],
                  ["PARTNERSHIPS", result.strategy.partnershipIdeas],
                  ["CONTENT SYSTEM", result.strategy.contentIdeas],
                  ["EXPERIENCE IDEAS", result.strategy.experienceIdeas],
                ].map(([title, items]) => (
                  <article className="strategyCard" key={title as string}>
                    <h3>{title as string}</h3>
                    <ol>
                      {(items as string[]).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>

              <details className="trace">
                <summary>VIEW AGENT TRACE + QLOO EVIDENCE</summary>
                <div className="traceBody">
                  {result.trace.map((step, index) => (
                    <div className="traceRow" key={index}>
                      <span>{step.stage}</span>
                      <p>{step.detail}</p>
                      <b>{step.status}</b>
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}
        </section>
      </section>

      <footer>
        <span>TASTE//OS / QLOO AGENTIC HACKATHON</span>
        <span>QLOO DETERMINES AFFINITY. TASTE//OS TURNS AFFINITY INTO STRATEGY.</span>
      </footer>
    </main>
  );
}
