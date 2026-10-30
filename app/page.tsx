"use client";

import { useMemo, useState } from "react";
import type {
  GuestBrief,
  HospitalityExperience,
  HotelCapability,
  TasteAgentResult,
} from "@/lib/types";

const CAPABILITIES: HotelCapability[] = [
  "Lighting",
  "Welcome amenity",
  "In-room audio",
  "In-room streaming",
  "Concierge",
  "Restaurant reservations",
  "Transport",
  "Room service",
  "Spa",
];

const BASE_CAPABILITIES: HotelCapability[] = [
  "Lighting",
  "Welcome amenity",
  "In-room audio",
  "In-room streaming",
  "Concierge",
  "Restaurant reservations",
  "Transport",
  "Room service",
];

const PRESETS: Array<{ label: string; guest: GuestBrief }> = [
  {
    label: "Guest 01",
    guest: {
      propertyName: "Casa Forma",
      location: "Guadalajara, Mexico",
      neighborhood: "",
      stayIntent: "Nightlife",
      interests: ["Bad Bunny", "A24", "Soho House"],
      capabilities: [...BASE_CAPABILITIES],
      constraints: {
        dietary: "",
        avoid: "",
        budget: "Premium",
        arrivalTime: "16:00",
        checkoutTime: "12:00",
      },
    },
  },
  {
    label: "Guest 02",
    guest: {
      propertyName: "Casa Forma",
      location: "Guadalajara, Mexico",
      neighborhood: "",
      stayIntent: "Rest",
      interests: ["Sade", "Studio Ghibli", "Muji"],
      capabilities: [...BASE_CAPABILITIES],
      constraints: {
        dietary: "",
        avoid: "loud crowded venues",
        budget: "Premium",
        arrivalTime: "15:00",
        checkoutTime: "12:00",
      },
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
type FeedbackValue = "love" | "skip";

function MomentCard({
  moment,
  featured = false,
  feedback,
  onFeedback,
}: {
  moment: Moment;
  featured?: boolean;
  feedback?: FeedbackValue;
  onFeedback: (value: FeedbackValue) => void;
}) {
  return (
    <article className={featured ? "momentCard featuredMoment" : "momentCard"}>
      <div className="momentLabel">{moment.title}</div>
      <p className="momentAction">{moment.action}</p>
      <p className="momentWhy">{moment.rationale}</p>
      <div className="momentFeedback">
        <button
          type="button"
          className={feedback === "love" ? "selectedFeedback" : ""}
          onClick={() => onFeedback("love")}
        >
          LOVE THIS
        </button>
        <button
          type="button"
          className={feedback === "skip" ? "selectedFeedback" : ""}
          onClick={() => onFeedback("skip")}
        >
          NOT FOR ME
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [guest, setGuest] = useState<GuestBrief>({
    ...PRESETS[1].guest,
    interests: [...PRESETS[1].guest.interests],
    capabilities: [...PRESETS[1].guest.capabilities],
    constraints: { ...PRESETS[1].guest.constraints },
  });
  const [result, setResult] = useState<TasteAgentResult | null>(null);
  const [view, setView] = useState<"guest" | "staff">("guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, FeedbackValue>>({});

  const canBuild = useMemo(
    () =>
      guest.propertyName.trim().length > 1 &&
      guest.location.trim().length > 1 &&
      guest.interests.length === 3 &&
      guest.interests.every((interest) => interest.trim().length > 0) &&
      guest.capabilities.length > 0,
    [guest],
  );

  function clearResult() {
    setResult(null);
    setError(null);
    setFeedback({});
  }

  function setInterest(index: number, value: string) {
    setGuest((current) => ({
      ...current,
      interests: current.interests.map((interest, itemIndex) =>
        itemIndex === index ? value : interest,
      ),
    }));
    clearResult();
  }

  function applyPreset(preset: GuestBrief) {
    setGuest({
      ...preset,
      interests: [...preset.interests],
      capabilities: [...preset.capabilities],
      constraints: { ...preset.constraints },
    });
    setResult(null);
    setView("guest");
    setError(null);
    setFeedback({});
  }

  function toggleCapability(capability: HotelCapability) {
    setGuest((current) => ({
      ...current,
      capabilities: current.capabilities.includes(capability)
        ? current.capabilities.filter((item) => item !== capability)
        : [...current.capabilities, capability],
    }));
    clearResult();
  }

  async function buildStay() {
    if (!canBuild) return;
    setLoading(true);
    setError(null);
    setView("guest");
    setFeedback({});

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Taste could not build this stay.");
      setResult(payload);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Taste could not build this stay.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pageShell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Taste home">
          Taste
        </a>
        <div className="topbarMeta">
          <span>A stay that knows what you like.</span>
          <span className="qlooMark">Powered by Qloo</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">
            PERSONALIZED HOSPITALITY, POWERED BY CULTURAL TASTE
          </p>
          <h1>
            The same hotel.
            <br />
            <em>Your version.</em>
          </h1>
          <p className="heroDek">
            Taste combines what the guest loves, where the hotel is, and what
            the property can actually do.
          </p>
        </div>
        <div className="heroAside">
          <span className="heroIndex">01</span>
          <p>
            Facts + taste + hotel capabilities become an executable stay, not
            another recommendation list.
          </p>
        </div>
      </section>

      <section className="builderSection">
        <div className="builderIntro">
          <div>
            <p className="eyebrow">BUILD THIS STAY</p>
            <h2>Give Taste the guest context and the hotel reality.</h2>
          </div>
          <div className="presetGroup">
            <span>WATCH THE SAME HOTEL CHANGE</span>
            <div>
              {PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => applyPreset(preset.guest)}
                  className="presetButton"
                >
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
                  setGuest((current) => ({
                    ...current,
                    propertyName: event.target.value,
                  }));
                  clearResult();
                }}
              />
            </label>

            <label className="propertyField">
              <span>HOTEL LOCATION</span>
              <input
                value={guest.location}
                onChange={(event) => {
                  setGuest((current) => ({
                    ...current,
                    location: event.target.value,
                  }));
                  clearResult();
                }}
                placeholder="City, State or Country"
              />
            </label>

            <label className="propertyField">
              <span>NEIGHBORHOOD / AREA (OPTIONAL)</span>
              <input
                value={guest.neighborhood}
                onChange={(event) => {
                  setGuest((current) => ({
                    ...current,
                    neighborhood: event.target.value,
                  }));
                  clearResult();
                }}
                placeholder="Roma Norte, Downtown, Shoreditch..."
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
                  className={
                    guest.stayIntent === intent
                      ? "intent activeIntent"
                      : "intent"
                  }
                  onClick={() => {
                    setGuest((current) => ({ ...current, stayIntent: intent }));
                    clearResult();
                  }}
                >
                  <i />
                  {intent}
                </button>
              ))}
            </div>
          </div>

          <div className="builderSubsection">
            <span>WHAT CAN THIS HOTEL ACTUALLY CONTROL?</span>
            <div className="capabilityGrid">
              {CAPABILITIES.map((capability) => (
                <button
                  type="button"
                  key={capability}
                  className={
                    guest.capabilities.includes(capability)
                      ? "capability activeCapability"
                      : "capability"
                  }
                  onClick={() => toggleCapability(capability)}
                >
                  {capability}
                </button>
              ))}
            </div>
          </div>

          <div className="builderSubsection">
            <span>GUEST CONSTRAINTS</span>
            <div className="constraintGrid">
              <label>
                <span>DIETARY / ALLERGIES</span>
                <input
                  value={guest.constraints.dietary}
                  onChange={(event) => {
                    setGuest((current) => ({
                      ...current,
                      constraints: {
                        ...current.constraints,
                        dietary: event.target.value,
                      },
                    }));
                    clearResult();
                  }}
                  placeholder="Vegetarian, nut allergy..."
                />
              </label>

              <label>
                <span>AVOID</span>
                <input
                  value={guest.constraints.avoid}
                  onChange={(event) => {
                    setGuest((current) => ({
                      ...current,
                      constraints: {
                        ...current.constraints,
                        avoid: event.target.value,
                      },
                    }));
                    clearResult();
                  }}
                  placeholder="Crowds, loud bars..."
                />
              </label>

              <label>
                <span>BUDGET</span>
                <select
                  value={guest.constraints.budget}
                  onChange={(event) => {
                    setGuest((current) => ({
                      ...current,
                      constraints: {
                        ...current.constraints,
                        budget: event.target.value as
                          | "Flexible"
                          | "Value"
                          | "Premium",
                      },
                    }));
                    clearResult();
                  }}
                >
                  <option>Flexible</option>
                  <option>Value</option>
                  <option>Premium</option>
                </select>
              </label>

              <label>
                <span>ARRIVAL</span>
                <input
                  type="time"
                  value={guest.constraints.arrivalTime}
                  onChange={(event) => {
                    setGuest((current) => ({
                      ...current,
                      constraints: {
                        ...current.constraints,
                        arrivalTime: event.target.value,
                      },
                    }));
                    clearResult();
                  }}
                />
              </label>

              <label>
                <span>CHECKOUT</span>
                <input
                  type="time"
                  value={guest.constraints.checkoutTime}
                  onChange={(event) => {
                    setGuest((current) => ({
                      ...current,
                      constraints: {
                        ...current.constraints,
                        checkoutTime: event.target.value,
                      },
                    }));
                    clearResult();
                  }}
                />
              </label>
            </div>
          </div>

          <button
            className="buildButton"
            type="button"
            onClick={buildStay}
            disabled={loading || !canBuild}
          >
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
            <h2>Taste becomes operational context.</h2>
          </div>
          <div className="promiseFlow">
            <span>Guest + property</span>
            <b>→</b>
            <span>Qloo + locality</span>
            <b>→</b>
            <span>Executable stay</span>
          </div>
        </section>
      ) : (
        <section className="results">
          <div className="interpretationPanel">
            <div>
              <span>LOCATION CHECK</span>
              <strong>{result.locationContext.resolvedName}</strong>
              <small>
                Requested: {result.locationContext.requested} · strict local
                boundary
              </small>
            </div>
            <div className="interpretationSeeds">
              <span>TASTE INTERPRETATION</span>
              <div>
                {result.interpretedInterests.map((item) => (
                  <article key={item.id}>
                    <small>{item.input}</small>
                    <strong>{item.resolvedName}</strong>
                    <em>{item.resolvedType}</em>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="resultsTop">
            <div>
              <p className="eyebrow">
                YOUR STAY / {result.guest.stayIntent.toUpperCase()}
              </p>
              <h2>{result.experience.headline}</h2>
              <p className="profileLine">{result.experience.profile}</p>
            </div>
            <div className="viewSwitch">
              <button
                type="button"
                className={view === "guest" ? "activeView" : ""}
                onClick={() => setView("guest")}
              >
                YOUR STAY
              </button>
              <button
                type="button"
                className={view === "staff" ? "activeView" : ""}
                onClick={() => setView("staff")}
              >
                VIEW HOTEL PREP
              </button>
            </div>
          </div>

          {view === "guest" ? (
            <>
              <div className="itineraryPanel">
                <span>YOUR STAY, IN TIME</span>
                <div className="itineraryGrid">
                  {result.experience.itinerary.map((item) => (
                    <article key={item.time + item.title}>
                      <b>{item.time}</b>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="stayGrid">
                {[
                  result.experience.room,
                  result.experience.arrival,
                  result.experience.welcome,
                  result.experience.dinner,
                  result.experience.after,
                  result.experience.tomorrow,
                ].map((moment, index) => (
                  <MomentCard
                    key={moment.title}
                    moment={moment}
                    featured={index === 0}
                    feedback={feedback[moment.title]}
                    onFeedback={(value) =>
                      setFeedback((current) => ({
                        ...current,
                        [moment.title]: value,
                      }))
                    }
                  />
                ))}
              </div>

              <div className="unexpectedStrip">
                <div>
                  <span>ONE THING YOU DIDN&apos;T ASK FOR</span>
                  <h3>{result.experience.unexpected.action}</h3>
                </div>
              </div>
            </>
          ) : (
            <div className="staffPanel">
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
                    <ul>
                      {section.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className="staffFoot">
                <span>ENABLED CAPABILITIES</span>
                <p>{result.guest.capabilities.join(" · ")}</p>
              </div>
            </div>
          )}

          <details className="proof">
            <summary>
              <span>WHY THIS FITS YOU</span>
              <b>Inspect Qloo evidence</b>
            </summary>
            <div className="proofBody">
              <div className="resolvedSeeds">
                <span>YOU SAID</span>
                <div>
                  {result.resolvedSeeds.map((seed) => (
                    <b key={seed.id}>{seed.name}</b>
                  ))}
                </div>
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
                                ? Math.round(entity.affinity * 100) +
                                  "% affinity"
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
                    <b>{step.stage}</b>
                    <p>{step.detail}</p>
                    <em>{step.status}</em>
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
          <h2>
            Taste understands the guest, the place, and what the hotel can
            actually execute.
          </h2>
        </div>
        <div className="systemFlow">
          <div>
            <span>CONTEXT</span>
            <p>Guest taste, hotel location, constraints and capabilities.</p>
          </div>
          <b>→</b>
          <div>
            <span>QLOO</span>
            <p>Cross-domain taste plus strict local place inventory.</p>
          </div>
          <b>→</b>
          <div>
            <span>TASTE</span>
            <p>Timed guest experience plus staff-ready actions.</p>
          </div>
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
