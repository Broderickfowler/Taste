"use client";

import { useMemo, useState } from "react";
import type { GuestBrief, HospitalityExperience, TasteAgentResult } from "@/lib/types";

const VISUALS = {
  hero: "https://images.unsplash.com/photo-1599624893198-d000bdd8bef8?auto=format&fit=crop&q=85&w=2200",
  room: "https://images.unsplash.com/photo-1790419683322-b08a7050c424?auto=format&fit=crop&q=85&w=1400",
  dining: "https://images.unsplash.com/photo-1741852197045-cc35920a3aa0?auto=format&fit=crop&q=85&w=1400",
  rest: "https://images.unsplash.com/photo-1777383504729-bd8364d28de8?auto=format&fit=crop&q=85&w=1400",
};

const PRESETS: Array<{ label: string; guest: GuestBrief }> = [
  {
    label: "Guest 01",
    guest: {
      propertyName: "Casa Forma",
      location: "Guadalajara, Mexico",
      stayIntent: "Nightlife",
      interests: ["Bad Bunny", "A24", "Soho House"],
    },
  },
  {
    label: "Guest 02",
    guest: {
      propertyName: "Casa Forma",
      location: "Guadalajara, Mexico",
      stayIntent: "Rest",
      interests: ["Sade", "Studio Ghibli", "Muji"],
    },
  },
];

const INTENTS: GuestBrief["stayIntent"][] = [
  "Rest",
  "Explore",
  "Romance",
  "Nightlife",
  "Food",
];

type Moment = HospitalityExperience["room"];

function Evidence({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="evidenceChips">
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

function MomentCard({ moment, featured = false }: { moment: Moment; featured?: boolean }) {
  const image =
    moment.title === "ROOM"
      ? VISUALS.room
      : moment.title === "DINNER" || moment.title === "WELCOME"
        ? VISUALS.dining
        : VISUALS.rest;

  return (
    <article className={featured ? "momentCard featuredMoment" : "momentCard"}>
      <div className="momentImage" style={{ backgroundImage: `url(${image})` }} />
      <div className="momentBody">
        <div className="momentLabel">{moment.title}</div>
        <p className="momentAction">{moment.action}</p>
        <p className="momentWhy">{moment.rationale}</p>
      </div>
    </article>
  );
}

export default function Home() {
  const [guest, setGuest] = useState<GuestBrief>({ ...PRESETS[1].guest });
  const [result, setResult] = useState<TasteAgentResult | null>(null);
  const [view, setView] = useState<"guest" | "staff">("guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canBuild = useMemo(
    () => guest.interests.length === 3 && guest.interests.every((interest) => interest.trim().length > 0),
    [guest.interests],
  );

  function setInterest(index: number, value: string) {
    setGuest((current) => ({
      ...current,
      interests: current.interests.map((interest, itemIndex) => itemIndex === index ? value : interest),
    }));
    setResult(null);
    setError(null);
  }

  function applyPreset(preset: GuestBrief) {
    setGuest({ ...preset, interests: [...preset.interests] });
    setResult(null);
    setView("guest");
    setError(null);
  }

  async function buildStay() {
    if (!canBuild) return;
    setLoading(true);
    setError(null);
    setView("guest");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Taste could not build this stay.");
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Taste could not build this stay.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pageShell">
      <header className="topbar">
        <div className="brandLockup">
          <a className="brand" href="#top" aria-label="Taste home">Taste</a>
          <span className="brandTagline">THE SAME HOTEL. YOUR VERSION.</span>
        </div>
        <nav className="mainNav" aria-label="Taste sections">
          <a href="#stay">My Stay</a>
          <a href="#prep">Hotel Prep</a>
          <a href="#fit">Why This Fits You</a>
        </nav>
        <div className="topbarMeta">
          <span className="qlooMark">Powered by Qloo</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div
          className="heroVisual"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.28)), url(${VISUALS.hero})` }}
          aria-label="Guadalajara city view"
        />
        <div className="heroCopy">
          <h1>The same hotel.<br /><em>Your version.</em></h1>
          <p className="heroDek">
            Pick three things you love. Taste turns them into a stay designed around you.
          </p>
        </div>
      </section>

      <section className="builderSection">
        <div className="builderIntro">
          <div>
            <p className="eyebrow">BUILD THIS STAY</p>
            <h2>Choose the hotel, then tell us three things you love.</h2>
          </div>
          <div className="presetGroup">
            <span>WATCH THE SAME HOTEL CHANGE</span>
            <div>
              {PRESETS.map((preset) => (
                <button type="button" key={preset.label} onClick={() => applyPreset(preset.guest)} className="presetButton">
                  {preset.label}
                  <small>{preset.guest.interests.join(" / ")}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="builderCard">
          <div className="propertyGrid">
            <label className="propertyField">
              <span>PROPERTY</span>
              <input
                value={guest.propertyName}
                onChange={(event) => {
                  setGuest((current) => ({ ...current, propertyName: event.target.value }));
                  setResult(null);
                  setError(null);
                }}
                aria-label="Hotel property name"
              />
            </label>

            <label className="propertyField">
              <span>HOTEL LOCATION</span>
              <input
                value={guest.location}
                onChange={(event) => {
                  setGuest((current) => ({ ...current, location: event.target.value }));
                  setResult(null);
                  setError(null);
                }}
                aria-label="Hotel location"
                placeholder="City, State or Country"
              />
            </label>
          </div>

          <div className="loveGrid">
            {guest.interests.map((interest, index) => (
              <label className="loveField" key={index}>
                <span>{"0" + (index + 1)}</span>
                <input
                  value={interest}
                  onChange={(event) => setInterest(index, event.target.value)}
                  aria-label={"Thing you love " + (index + 1)}
                />
              </label>
            ))}
          </div>

          <div className="intentBlock">
            <span>WHAT KIND OF STAY?</span>
            <div className="intentRow">
              {INTENTS.map((intent) => (
                <button
                  type="button"
                  key={intent}
                  className={guest.stayIntent === intent ? "intent activeIntent" : "intent"}
                  onClick={() => {
                    setGuest((current) => ({ ...current, stayIntent: intent }));
                    setResult(null);
                    setError(null);
                  }}
                >
                  <i />{intent}
                </button>
              ))}
            </div>
          </div>

          <button className="buildButton" type="button" onClick={buildStay} disabled={loading || !canBuild}>
            <span>{loading ? "READING YOUR TASTE" : "BUILD MY STAY"}</span>
            <b>{loading ? "•••" : "↗"}</b>
          </button>

          {error ? <div className="errorBox">{error}</div> : null}
        </div>
      </section>

      {!result ? (
        <section className="demoPromise">
          <div className="promiseNumber">02</div>
          <div>
            <p className="eyebrow">WHAT TASTE DOES</p>
            <h2>Your preferences become operations.</h2>
          </div>
          <div className="promiseFlow">
            <span>3 things you love</span><b>→</b><span>Qloo taste graph</span><b>→</b><span>Hotel actions</span>
          </div>
        </section>
      ) : (
        <section className="results" id="stay">
          <div className="resultsTop">
            <div>
              <p className="eyebrow">YOUR STAY / {result.guest.stayIntent.toUpperCase()}</p>
              <h2>{result.experience.headline}</h2>
              <p className="profileLine">{result.experience.profile}</p>
            </div>
            <div className="viewSwitch">
              <button type="button" className={view === "guest" ? "activeView" : ""} onClick={() => setView("guest")}>
                YOUR STAY
              </button>
              <button type="button" className={view === "staff" ? "activeView" : ""} onClick={() => setView("staff")}>
                VIEW HOTEL PREP
              </button>
            </div>
          </div>

          {view === "guest" ? (
            <>
              <div className="stayGrid">
                <MomentCard moment={result.experience.room} featured />
                <MomentCard moment={result.experience.arrival} />
                <MomentCard moment={result.experience.welcome} />
                <MomentCard moment={result.experience.dinner} />
                <MomentCard moment={result.experience.after} />
                <MomentCard moment={result.experience.tomorrow} />
              </div>
              <div className="unexpectedStrip">
                <div>
                  <span>ONE THING YOU DIDN&apos;T ASK FOR</span>
                  <h3>{result.experience.unexpected.action}</h3>
                </div>
              </div>
            </>
          ) : (
            <div className="staffPanel" id="prep">
              <div className="staffHeader">
                <div>
                  <span>GUEST EXPERIENCE CARD</span>
                  <h3>{result.experience.profile}</h3>
                </div>
                <div className="confidence">
                  <span>CONFIDENCE</span>
                  <b>{result.experience.confidence}</b>
                </div>
              </div>
              <div className="prepGrid">
                {result.experience.staffPrep.map((section) => (
                  <article key={section.area}>
                    <span>{section.area}</span>
                    <ul>{section.actions.map((action) => <li key={action}>{action}</li>)}</ul>
                  </article>
                ))}
              </div>
              <div className="staffFoot">
                <span>Prepared before arrival</span>
                <p>Taste converts declared preferences into a practical handoff for rooms, F&amp;B, media and local recommendations.</p>
              </div>
            </div>
          )}

          <details className="proof" id="fit">
            <summary><span>WHY THIS FITS YOU</span><b>Inspect Qloo evidence</b></summary>
            <div className="proofBody">
              <div className="resolvedSeeds">
                <span>YOU SAID</span>
                <div>{result.resolvedSeeds.map((seed) => <b key={seed.id}>{seed.name}</b>)}</div>
              </div>

              <div className="domainProofGrid">
                {result.domains.map((domain) => (
                  <article key={domain.domain}>
                    <div className="proofDomainHead">
                      <span>{domain.domain.toUpperCase()}</span>
                      <small>{domain.entities.length} QLOO SIGNALS</small>
                    </div>
                    <div className="proofEntities">
                      {domain.entities.slice(0, 4).map((entity) => (
                        <div key={entity.id}>
                          <strong>{entity.name}</strong>
                          <small>
                            {typeof entity.affinity === "number"
                              ? entity.affinity <= 1
                                ? Math.round(entity.affinity * 100) + "% affinity"
                                : entity.affinity.toFixed(2)
                              : "Qloo recommendation"}
                          </small>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="traceBlock">
                <span>AGENT TRACE</span>
                {result.trace.map((step, index) => (
                  <div className="traceRow" key={index}>
                    <b>{step.stage}</b><p>{step.detail}</p><em>{step.status}</em>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </section>
      )}

      <section className="systemSection">
        <div>
          <span className="systemNumber">03</span>
          <p className="eyebrow">THE PRODUCT</p>
          <h2>Hospitality becomes more personal when culture becomes usable.</h2>
        </div>
        <div className="systemFlow">
          <div><span>GUEST TASTE</span><p>Three cultural references plus stay intent.</p></div>
          <b>→</b>
          <div><span>QLOO</span><p>Cross-domain affinities, places, brands, music, film and travel.</p></div>
          <b>→</b>
          <div><span>TASTE</span><p>Guest moments plus a staff-ready preparation card.</p></div>
        </div>
      </section>

      <footer>
        <div>Taste</div>
        <p>The same hotel. Your version.</p>
        <span>Powered by Qloo</span>
      </footer>
    </main>
  );
}
