"use client";

import { useMemo, useState } from "react";
import type {
  BudgetTier,
  GuestBrief,
  HospitalityExperience,
  InterestKind,
  PreferenceCategory,
  StayIntent,
  TasteAgentResult,
  TripPurpose,
} from "@/lib/types";

const VISUALS = {
  hero: "https://images.unsplash.com/photo-1599624893198-d000bdd8bef8?auto=format&fit=crop&q=85&w=2200",
  room: "https://images.unsplash.com/photo-1790419683322-b08a7050c424?auto=format&fit=crop&q=85&w=1400",
  welcome: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=85&w=1400",
  dinner: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=85&w=1400",
  after: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=85&w=1400",
  tomorrow: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1400",
  arrival: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1400",
};

const PREFERENCES: PreferenceCategory[] = [
  "Live Music",
  "Fine Dining",
  "Local Food",
  "Art",
  "Architecture",
  "Shopping",
  "Spa",
  "Wellness",
  "Nightlife",
  "Walking Distance",
  "Guided Tours",
  "In-room Services",
  "Design",
  "Nature",
];

const INTENTS: StayIntent[] = [
  "Rest",
  "Explore",
  "Romance",
  "Nightlife",
  "Food",
  "Celebrate",
  "Business",
];

const PURPOSES: TripPurpose[] = ["Leisure", "Business", "Celebration", "Mixed"];
const BUDGETS: BudgetTier[] = ["$", "$", "$$", "$$"];
const INTEREST_KINDS: InterestKind[] = [
  "Artist",
  "Film",
  "Brand",
  "Restaurant",
  "Cuisine",
  "Activity",
  "Other",
];

const DEFAULT_GUEST: GuestBrief = {
  guestName: "Matthew",
  propertyName: "Casa Forma",
  location: "Guadalajara, Mexico",
  stayIntent: "Explore",
  tripPurpose: "Leisure",
  budgetTier: "$$$",
  partySize: 2,
  adults: 2,
  children: 0,
  preferences: ["Art", "Fine Dining", "Walking Distance"],
  interests: ["Guillermo del Toro", "Neo Soul"],
  interestKinds: ["Film", "Other"],
};

type Moment = HospitalityExperience["room"];

function MomentCard({ moment, featured = false }: { moment: Moment; featured?: boolean }) {
  const image =
    moment.title === "ROOM"
      ? VISUALS.room
      : moment.title === "WELCOME"
        ? VISUALS.welcome
        : moment.title === "DINNER"
          ? VISUALS.dinner
          : moment.title === "AFTER"
            ? VISUALS.after
            : moment.title === "TOMORROW"
              ? VISUALS.tomorrow
              : VISUALS.arrival;

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
  const [guest, setGuest] = useState<GuestBrief>(DEFAULT_GUEST);
  const [result, setResult] = useState<TasteAgentResult | null>(null);
  const [view, setView] = useState<"guest" | "staff">("guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canBuild = useMemo(
    () =>
      guest.preferences.length >= 3 &&
      guest.interests.length >= 1 &&
      guest.interests.every((interest) => interest.trim().length > 0) &&
      guest.adults + guest.children === guest.partySize,
    [guest],
  );

  function updateGuest(patch: Partial<GuestBrief>) {
    setGuest((current) => ({ ...current, ...patch }));
    setResult(null);
    setError(null);
  }

  function togglePreference(preference: PreferenceCategory) {
    setGuest((current) => {
      const selected = current.preferences.includes(preference);
      return {
        ...current,
        preferences: selected
          ? current.preferences.filter((item) => item !== preference)
          : [...current.preferences, preference],
      };
    });
    setResult(null);
    setError(null);
  }

  function updateInterest(index: number, value: string) {
    setGuest((current) => ({
      ...current,
      interests: current.interests.map((interest, itemIndex) =>
        itemIndex === index ? value : interest,
      ),
    }));
    setResult(null);
    setError(null);
  }

  function setInterestKind(index: number, kind: InterestKind) {
    updateGuest({
      interestKinds: guest.interestKinds.map((item, itemIndex) =>
        itemIndex === index ? kind : item,
      ),
    });
  }

  function addInterest() {
    if (guest.interests.length >= 5) return;
    updateGuest({
      interests: [...guest.interests, ""],
      interestKinds: [...guest.interestKinds, "Other"],
    });
  }

  function removeInterest(index: number) {
    if (guest.interests.length <= 1) return;
    updateGuest({
      interests: guest.interests.filter((_, itemIndex) => itemIndex !== index),
      interestKinds: guest.interestKinds.filter((_, itemIndex) => itemIndex !== index),
    });
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
          <a href="#preferences">Preferences</a>
          <a href="#stay">My Stay</a>
          <a href="#prep">Hotel Prep</a>
        </nav>
        <div className="topbarMeta">
          <span className="qlooMark">Powered by Qloo</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div
          className="heroVisual"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.28)), url(${VISUALS.hero})`,
          }}
        />
        <div className="heroCopy">
          <p className="eyebrow">TASTE V2 / PERSONALIZED HOSPITALITY</p>
          <h1>Your trip first.<br /><em>Your taste second.</em></h1>
          <p className="heroDek">
            Taste starts with why you are traveling, what kind of experience you want,
            and the cultural references that actually help us understand you.
          </p>
        </div>
      </section>

      <section className="builderSection" id="preferences">
        <div className="builderIntro">
          <div>
            <p className="eyebrow">01 / TRIP CONTEXT</p>
            <h2>Start with what the hotel should already know.</h2>
          </div>
          <p className="sectionNote">
            Trip context constrains the recommendation space before cultural taste is used to rank it.
          </p>
        </div>

        <div className="builderCard v2Builder">
          <div className="contextGrid">
            <label className="propertyField">
              <span>GUEST NAME</span>
              <input value={guest.guestName ?? ""} onChange={(event) => updateGuest({ guestName: event.target.value })} />
            </label>
            <label className="propertyField">
              <span>PROPERTY</span>
              <input value={guest.propertyName} onChange={(event) => updateGuest({ propertyName: event.target.value })} />
            </label>
            <label className="propertyField">
              <span>LOCATION</span>
              <input value={guest.location} onChange={(event) => updateGuest({ location: event.target.value })} />
            </label>
            <label className="propertyField">
              <span>PARTY SIZE</span>
              <input type="number" min={1} max={20} value={guest.partySize} onChange={(event) => updateGuest({ partySize: Number(event.target.value) })} />
            </label>
            <label className="propertyField">
              <span>ADULTS</span>
              <input type="number" min={1} max={20} value={guest.adults} onChange={(event) => updateGuest({ adults: Number(event.target.value) })} />
            </label>
            <label className="propertyField">
              <span>CHILDREN</span>
              <input type="number" min={0} max={19} value={guest.children} onChange={(event) => updateGuest({ children: Number(event.target.value) })} />
            </label>
          </div>

          <div className="v2Group">
            <span className="fieldLabel">TRIP PURPOSE</span>
            <div className="choiceRow">
              {PURPOSES.map((purpose) => (
                <button
                  type="button"
                  key={purpose}
                  className={guest.tripPurpose === purpose ? "choiceChip activeChoice" : "choiceChip"}
                  onClick={() => updateGuest({ tripPurpose: purpose })}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>

          <div className="v2Group">
            <span className="fieldLabel">WHAT SHOULD THIS STAY FEEL LIKE?</span>
            <div className="choiceRow">
              {INTENTS.map((intent) => (
                <button
                  type="button"
                  key={intent}
                  className={guest.stayIntent === intent ? "choiceChip activeChoice" : "choiceChip"}
                  onClick={() => updateGuest({ stayIntent: intent })}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          <div className="v2Group">
            <span className="fieldLabel">SPEND COMFORT</span>
            <div className="choiceRow">
              {BUDGETS.map((budget) => (
                <button
                  type="button"
                  key={budget}
                  className={guest.budgetTier === budget ? "choiceChip activeChoice" : "choiceChip"}
                  onClick={() => updateGuest({ budgetTier: budget })}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>

          <div className="v2Group">
            <div className="groupHead">
              <div>
                <span className="fieldLabel">02 / WHAT ARE YOU INTERESTED IN?</span>
                <p>Select at least three. Keep going until the trip feels represented.</p>
              </div>
              <b>{guest.preferences.length} selected</b>
            </div>
            <div className="preferenceGrid">
              {PREFERENCES.map((preference) => (
                <button
                  type="button"
                  key={preference}
                  className={guest.preferences.includes(preference) ? "preferenceCard selectedPreference" : "preferenceCard"}
                  onClick={() => togglePreference(preference)}
                >
                  <span>{guest.preferences.includes(preference) ? "✓" : "+"}</span>
                  <strong>{preference}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="v2Group culturalFollowup">
            <div className="groupHead">
              <div>
                <span className="fieldLabel">03 / GIVE TASTE SOMETHING SPECIFIC</span>
                <p>
                  Add artists, films, designers, restaurants, brands, cuisines, places, or other cultural references you genuinely like.
                </p>
              </div>
              <button type="button" className="addReference" onClick={addInterest} disabled={guest.interests.length >= 5}>
                + ADD REFERENCE
              </button>
            </div>

            <div className="referenceList">
              {guest.interests.map((interest, index) => (
                <div className="referenceRow" key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <select
                    value={guest.interestKinds[index] ?? "Other"}
                    onChange={(event) => setInterestKind(index, event.target.value as InterestKind)}
                    aria-label={"Reference type " + (index + 1)}
                  >
                    {INTEREST_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                  </select>
                  <input
                    value={interest}
                    placeholder={index === 0 ? "Example: Sade" : "Example: A24, Bottega Veneta, omakase"}
                    onChange={(event) => updateInterest(index, event.target.value)}
                  />
                  <button type="button" onClick={() => removeInterest(index)} disabled={guest.interests.length <= 1}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="buildButton" type="button" onClick={buildStay} disabled={loading || !canBuild}>
            <span>{loading ? "BUILDING A BETTER-MATCHED STAY" : "BUILD MY STAY"}</span>
            <b>{loading ? "•••" : "↗"}</b>
          </button>

          {!canBuild ? (
            <p className="validationNote">
              Select at least three experience preferences, add at least one cultural reference,
              and make sure adults + children equals party size.
            </p>
          ) : null}

          {error ? <div className="errorBox">{error}</div> : null}
        </div>
      </section>

      {!result ? (
        <section className="demoPromise">
          <div className="promiseNumber">02</div>
          <div>
            <p className="eyebrow">WHAT CHANGED</p>
            <h2>Context qualifies. Qloo ranks. Taste translates.</h2>
          </div>
          <div className="promiseFlow">
            <span>Trip context</span><b>→</b><span>Guided taste</span><b>→</b><span>Hotel action</span>
          </div>
        </section>
      ) : (
        <section className="results" id="stay">
          <div className="resultsTop">
            <div>
              <p className="eyebrow">MY STAY / {result.guest.stayIntent.toUpperCase()}</p>
              <h2>
                {result.guest.guestName
                  ? `${result.guest.guestName}, here are ideas for a great stay based on your tastes.`
                  : result.experience.headline}
              </h2>
              <p className="profileLine">{result.experience.profile}</p>
            </div>
            <div className="viewSwitch">
              <button type="button" className={view === "guest" ? "activeView" : ""} onClick={() => setView("guest")}>
                MY STAY
              </button>
              <button type="button" className={view === "staff" ? "activeView" : ""} onClick={() => setView("staff")}>
                HOTEL OPERATIONS
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
                  <span>HOTEL OPERATIONS / GUEST PREP</span>
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
                <span>Context available to staff</span>
                <p>
                  {result.guest.partySize} guests · {result.guest.tripPurpose} · {result.guest.budgetTier} spend comfort · {result.guest.preferences.join(" · ")}
                </p>
              </div>
            </div>
          )}

          <details className="proof" id="fit">
            <summary><span>WHY THIS FITS YOU</span><b>Inspect Qloo evidence</b></summary>
            <div className="proofBody">
              <div className="resolvedSeeds">
                <span>RESOLVED CULTURAL SIGNALS</span>
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
            </div>
          </details>
        </section>
      )}

      <section className="systemSection">
        <div>
          <span className="systemNumber">03</span>
          <p className="eyebrow">THE V2 MODEL</p>
          <h2>Better personalization begins before the recommendation query.</h2>
        </div>
        <div className="systemFlow">
          <div><span>HOTEL CONTEXT</span><p>Party, purpose, property, location and spend comfort.</p></div>
          <b>→</b>
          <div><span>QLOO + TASTE</span><p>Resolved cultural signals, cross-domain affinity and intent-aware interpretation.</p></div>
          <b>→</b>
          <div><span>TWO EXPERIENCES</span><p>Guest-facing ideas and a separate staff preparation surface.</p></div>
        </div>
      </section>

      <footer>
        <div>Taste</div>
        <p>V2 exploration branch</p>
        <span>Powered by Qloo</span>
      </footer>
    </main>
  );
}
