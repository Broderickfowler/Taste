"use client";

import { useMemo, useState } from "react";
import type { TasteAgentResult } from "@/lib/types";

const PRESETS = [
  {
    label: "Casa Forma",
    brief: {
      businessName: "Casa Forma",
      businessType: "Boutique hotel",
      location: "Guadalajara, Mexico",
      audience: "Design-conscious American travelers ages 28–40",
      goal: "Increase direct bookings and cultural relevance",
      interests: "A24, Bad Bunny, Soho House",
    },
  },
  {
    label: "NOIR//FORM",
    brief: {
      businessName: "NOIR//FORM",
      businessType: "Independent streetwear and fashion label",
      location: "Los Angeles, California",
      audience:
        "Creative professionals, designers, musicians, photographers and fashion-forward consumers ages 22–34",
      goal:
        "Launch a limited capsule collection and build cultural relevance beyond traditional fashion advertising",
      interests: "Frank Ocean, Arc'teryx, A24",
    },
  },
  {
    label: "Luna Social",
    brief: {
      businessName: "LUNA SOCIAL",
      businessType: "Modern Mexican restaurant and late-night cocktail concept",
      location: "Austin, Texas",
      audience:
        "Young professionals, creatives, food-driven travelers and nightlife consumers ages 25–38",
      goal:
        "Create a launch campaign that drives reservations, social sharing and late-night traffic",
      interests: "Bad Bunny, Bottega Veneta, The Bear",
    },
  },
];

type BriefState = {
  businessName: string;
  businessType: string;
  location: string;
  audience: string;
  goal: string;
  interests: string;
};

const DEFAULT_BRIEF: BriefState = { ...PRESETS[0].brief };

function formatAffinity(value: number | null | undefined) {
  if (typeof value !== "number") return "QLOO";
  return value >= 0 && value <= 1
    ? `${Math.round(value * 100)}%`
    : value.toFixed(2);
}

function affinityPercent(value: number | null | undefined) {
  if (typeof value !== "number") return 50;
  if (value >= 0 && value <= 1) return Math.round(value * 100);
  return Math.max(8, Math.min(100, Math.round(value)));
}

function displayDomain(domain: string) {
  if (domain === "dining") return "Local places";
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function formatDriverScore(value: number | null | undefined) {
  if (typeof value !== "number") return null;
  return value >= 0 && value <= 1
    ? `${Math.round(value * 100)}%`
    : value.toFixed(2);
}

export default function Home() {
  const [brief, setBrief] = useState<BriefState>({ ...DEFAULT_BRIEF });
  const [result, setResult] = useState<TasteAgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domainsWithData = useMemo(
    () => result?.domains.filter((domain) => domain.entities.length) ?? [],
    [result],
  );

  const signalCount = useMemo(
    () =>
      domainsWithData.reduce(
        (total, domain) => total + domain.entities.length,
        0,
      ),
    [domainsWithData],
  );

  function applyPreset(preset: BriefState) {
    setBrief({ ...preset });
    setResult(null);
    setError(null);
  }

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
    <main className="appShell">
      <header className="topbar">
        <div className="brandLockup">
          <div className="wordmark">TASTE//OS</div>
          <span>Culture into strategy</span>
        </div>
        <div className="topmeta">
          <span>Powered by Qloo</span>
          <span className="statusDot">Live intelligence</span>
        </div>
      </header>

      <section className="hero">
        <div className="heroIntro">
          <p className="eyebrow">Cultural intelligence for business decisions</p>
          <h1>
            Know what
            <br />
            <span>moves your audience.</span>
          </h1>
        </div>
        <div className="heroAside">
          <p>
            TASTE//OS maps cross-category taste signals, finds the cultural
            intersections that matter, and translates them into campaign,
            partnership, content and experience direction.
          </p>
          <div className="heroProof">
            <span>Qloo entity resolution</span>
            <span>Cross-domain insights</span>
            <span>Explainable evidence</span>
          </div>
        </div>
      </section>

      <section className="briefSection">
        <div className="sectionIntro">
          <div>
            <span className="sectionKicker">01</span>
            <p className="eyebrow">Build the cultural brief</p>
            <h2>Start with the audience you want to understand.</h2>
          </div>

          <div className="presetBlock">
            <span>Demo presets</span>
            <div className="presetRow">
              {PRESETS.map((preset) => (
                <button
                  className="presetButton"
                  key={preset.label}
                  onClick={() => applyPreset(preset.brief)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="briefCard">
          <div className="formGrid">
            <label>
              <span>Business</span>
              <input
                value={brief.businessName}
                onChange={(event) =>
                  setBrief({ ...brief, businessName: event.target.value })
                }
              />
            </label>

            <label>
              <span>Business type</span>
              <input
                value={brief.businessType}
                onChange={(event) =>
                  setBrief({ ...brief, businessType: event.target.value })
                }
              />
            </label>

            <label>
              <span>Location</span>
              <input
                value={brief.location}
                onChange={(event) =>
                  setBrief({ ...brief, location: event.target.value })
                }
              />
            </label>

            <label>
              <span>Known cultural signals</span>
              <input
                value={brief.interests}
                onChange={(event) =>
                  setBrief({ ...brief, interests: event.target.value })
                }
              />
            </label>

            <label className="wideField">
              <span>Target audience</span>
              <textarea
                value={brief.audience}
                onChange={(event) =>
                  setBrief({ ...brief, audience: event.target.value })
                }
              />
            </label>

            <label className="wideField">
              <span>Business objective</span>
              <textarea
                value={brief.goal}
                onChange={(event) =>
                  setBrief({ ...brief, goal: event.target.value })
                }
              />
            </label>
          </div>

          <div className="briefActions">
            <p>
              Known cultural signals are resolved to Qloo entities before any
              strategy is generated.
            </p>
            <button
              className="analyzeButton"
              onClick={analyze}
              disabled={loading}
            >
              <span>
                {loading
                  ? "Reading the culture..."
                  : "Generate cultural intelligence"}
              </span>
              <b>↗</b>
            </button>
          </div>

          {error ? <div className="errorBox">{error}</div> : null}
        </div>
      </section>

      {!result ? (
        <section className="emptyState">
          <div className="emptyOrb">
            <span>Q</span>
          </div>
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2>One brief. Five cultural domains. One strategic point of view.</h2>
            <p className="emptyCopy">
              Run a brief to reveal Qloo-backed affinity signals, cultural
              intersections, campaign opportunities and the evidence behind
              each recommendation.
            </p>
          </div>
        </section>
      ) : (
        <section className="results">
          <div className="resultsHero">
            <div className="resultsNarrative">
              <span className="sectionKicker">02</span>
              <p className="eyebrow">Strategic read</p>
              <h2>{result.strategy.campaignConcept.name}</h2>
              <p className="campaignPremise">
                {result.strategy.campaignConcept.premise}
              </p>
            </div>

            <div className="proofRail">
              <div className="proofStat">
                <b>{result.resolvedSeeds.length}</b>
                <span>Resolved seeds</span>
              </div>
              <div className="proofStat">
                <b>{signalCount}</b>
                <span>Live signals</span>
              </div>
              <div className="proofStat">
                <b>{result.strategy.intersections.length}</b>
                <span>Intersections</span>
              </div>
              <div className="proofStat accentStat">
                <b>{result.tasteTags.length}</b>
                <span>Taste tags</span>
              </div>
            </div>
          </div>

          <div className="dnaPanel">
            <div className="dnaCopy">
              <p className="eyebrow">Cultural DNA</p>
              <h3>The audience profile Qloo sees across the seed set.</h3>
            </div>
            <div className="dnaTags">
              {result.strategy.culturalDNA.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <section className="resultSection">
            <div className="resultSectionHeader">
              <div>
                <span className="sectionKicker">03</span>
                <p className="eyebrow">Signal landscape</p>
                <h3>What this audience is culturally adjacent to.</h3>
              </div>
              <p>
                Each signal below comes directly from Qloo's cross-domain
                intelligence layer.
              </p>
            </div>

            <div className="domainGrid">
              {domainsWithData.map((domain) => (
                <article className="domainCard" key={domain.domain}>
                  <div className="domainTop">
                    <div>
                      <span className="domainIndex">
                        {String(
                          domainsWithData.findIndex(
                            (item) => item.domain === domain.domain,
                          ) + 1,
                        ).padStart(2, "0")}
                      </span>
                      <h4>{displayDomain(domain.domain)}</h4>
                    </div>
                    <span className="signalCount">
                      {domain.entities.length} signals
                    </span>
                  </div>

                  <p className="domainRationale">{domain.rationale}</p>

                  <div className="entityList">
                    {domain.entities.slice(0, 4).map((entity) => (
                      <div className="entityCard" key={entity.id}>
                        <div className="entityMain">
                          <div>
                            <strong>{entity.name}</strong>
                            <small>
                              {entity.tags.slice(0, 2).join(" / ") ||
                                entity.type ||
                                "Qloo entity"}
                            </small>
                          </div>
                          <span>{formatAffinity(entity.affinity)}</span>
                        </div>

                        <div className="affinityTrack">
                          <span
                            style={{
                              width: `${affinityPercent(entity.affinity)}%`,
                            }}
                          />
                        </div>

                        <details className="signalWhy">
                          <summary>Why this signal</summary>
                          <div className="signalWhyBody">
                            <p>
                              Qloo returned <strong>{entity.name}</strong> at{" "}
                              <strong>{formatAffinity(entity.affinity)}</strong>{" "}
                              from the combined cultural seed profile.
                            </p>

                            {entity.drivers?.length ? (
                              entity.drivers.some(
                                (driver) => typeof driver.score === "number",
                              ) ? (
                                <div className="driverBreakdown">
                                  {entity.drivers.map((driver) => (
                                    <span key={driver.id}>
                                      {driver.name}
                                      {formatDriverScore(driver.score)
                                        ? ` / ${formatDriverScore(driver.score)}`
                                        : ""}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="evidenceNote">
                                  Explainability references seed context:{" "}
                                  {entity.drivers
                                    .map((driver) => driver.name)
                                    .join(", ")}
                                  . The response does not expose a per-seed
                                  contribution value.
                                </p>
                              )
                            ) : (
                              <p className="evidenceNote">
                                Qloo returned this recommendation without
                                seed-level explainability detail in this
                                response.
                              </p>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="resultSection intersectionSection">
            <div className="resultSectionHeader">
              <div>
                <span className="sectionKicker">04</span>
                <p className="eyebrow">Cultural intersections</p>
                <h3>The combinations a generic audience profile would miss.</h3>
              </div>
              <p>
                TASTE//OS combines independent Qloo signals into practical
                opportunities without claiming causation.
              </p>
            </div>

            <div className="intersectionGrid">
              {result.strategy.intersections.map((intersection, index) => (
                <article
                  className={
                    index === 0
                      ? "intersectionCard featuredIntersection"
                      : "intersectionCard"
                  }
                  key={intersection.id}
                >
                  <div className="intersectionMeta">
                    <span>
                      {displayDomain(intersection.domains[0])} ×{" "}
                      {displayDomain(intersection.domains[1])}
                    </span>
                    <b>
                      {intersection.explainabilityAvailable
                        ? "Qloo evidence"
                        : "Qloo co-signal"}
                    </b>
                  </div>

                  <h4>
                    {intersection.signals[0].name}
                    <span> × </span>
                    {intersection.signals[1].name}
                  </h4>

                  <p className="intersectionEvidence">
                    {intersection.evidence}
                  </p>

                  <div className="opportunityBlock">
                    <span>Business opportunity</span>
                    <p>{intersection.opportunity}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="resultSection strategySection">
            <div className="resultSectionHeader">
              <div>
                <span className="sectionKicker">05</span>
                <p className="eyebrow">Strategy translation</p>
                <h3>What the business can actually do with the signal.</h3>
              </div>
            </div>

            <div className="strategyGrid">
              {[
                ["Creative direction", result.strategy.creativeDirection],
                ["Partnerships", result.strategy.partnershipIdeas],
                ["Content system", result.strategy.contentIdeas],
                ["Experience ideas", result.strategy.experienceIdeas],
              ].map(([title, items], index) => (
                <article className="strategyCard" key={title as string}>
                  <span className="strategyNumber">
                    0{index + 1}
                  </span>
                  <h4>{title as string}</h4>
                  <ol>
                    {(items as string[]).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <details className="trace">
            <summary>
              <span>06 / Agent trace + Qloo evidence</span>
              <b>Open technical proof</b>
            </summary>
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
        </section>
      )}

      <footer>
        <div>TASTE//OS</div>
        <p>Qloo determines affinity. TASTE//OS turns affinity into strategy.</p>
        <span>Qloo Agentic Hackathon / 2026</span>
      </footer>
    </main>
  );
}
