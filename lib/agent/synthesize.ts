import type {
  DomainResult,
  ExperienceMoment,
  GuestBrief,
  HospitalityExperience,
  QlooEntity,
  QlooTasteTag,
} from "@/lib/types";

function top(domain: DomainResult | undefined, count = 3): QlooEntity[] {
  return (domain?.entities ?? []).slice(0, count);
}

function names(entities: QlooEntity[]) {
  return entities.map((entity) => entity.name).filter(Boolean);
}

function evidence(...groups: QlooEntity[][]) {
  return Array.from(new Set(groups.flatMap(names))).slice(0, 4);
}

function firstName(domain: DomainResult | undefined, fallback: string) {
  return domain?.entities[0]?.name || fallback;
}

function moment(
  title: string,
  action: string,
  rationale: string,
  evidenceItems: string[],
): ExperienceMoment {
  return { title, action, rationale, evidence: evidenceItems };
}

function cleanTags(tags: QlooTasteTag[]) {
  return tags
    .map((tag) => tag.name)
    .filter(Boolean)
    .filter((name, index, all) => all.indexOf(name) === index)
    .slice(0, 3);
}

export function synthesizeExperience(
  guest: GuestBrief,
  domains: DomainResult[],
  tasteTags: QlooTasteTag[],
): HospitalityExperience {
  const music = domains.find((d) => d.domain === "music");
  const dining = domains.find((d) => d.domain === "dining");
  const brands = domains.find((d) => d.domain === "brands");
  const film = domains.find((d) => d.domain === "film");
  const travel = domains.find((d) => d.domain === "travel");

  const leadArtist = firstName(music, "a low-key listening profile");
  const leadPlace = firstName(dining, "a locally distinctive restaurant");
  const leadBrand = firstName(brands, "a restrained design reference");
  const leadFilm = firstName(film, "a cinematic in-room selection");
  const leadDestination = firstName(travel, "a slower local discovery");

  const tagProfile = cleanTags(tasteTags);
  const profile =
    tagProfile.length > 0
      ? tagProfile.join(" / ")
      : guest.stayIntent === "Rest"
        ? "quiet / design-led / restorative"
        : guest.stayIntent === "Nightlife"
          ? "social / energetic / after-dark"
          : guest.stayIntent === "Romance"
            ? "intimate / sensory / unhurried"
            : guest.stayIntent === "Food"
              ? "food-led / local / discovery-driven"
              : "curious / local / culture-led";

  const intentRoom: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Use a quieter room preset with lower light, fewer visual interruptions and a slower arrival cadence.",
    Explore: "Set the room up as a calm basecamp, with a concise neighborhood discovery card ready on arrival.",
    Romance: "Use warm low light, a minimal two-person welcome setup and remove unnecessary visual clutter.",
    Nightlife: "Keep the room crisp and energized, with a later-night service note and an easy return-to-room setup.",
    Food: "Make the welcome food-forward, with local tasting cues and dinner details visible immediately.",
  };

  const intentAfter: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Skip the obvious nightlife recommendation. Prioritize a quiet, design-forward evening option or an early return.",
    Explore: "Send the guest toward a neighborhood-led evening stop that feels local rather than tourist-default.",
    Romance: "Recommend an intimate bar or late dessert stop with atmosphere over volume.",
    Nightlife: "Recommend the strongest after-dark place adjacent to the guest's cultural profile, not simply the highest-rated club.",
    Food: "Follow dinner with a bar, dessert or late-night bite that extends the same cultural profile.",
  };

  return {
    profile,
    headline: \`${guest.propertyName}, tuned to this guest.\`,
    room: moment(
      "ROOM",
      intentRoom[guest.stayIntent],
      \`The room direction uses the guest's declared intent plus Qloo affinities around ${leadBrand} and ${leadFilm}.\`,
      evidence(top(brands, 2), top(film, 2)),
    ),
    arrival: moment(
      "ARRIVAL",
      \`Build a short arrival listening sequence around ${leadArtist}, then soften the energy to match a ${guest.stayIntent.toLowerCase()} stay.\`,
      "Music is not treated as decoration. It sets the emotional tempo of check-in and the first ten minutes in the room.",
      evidence(top(music, 3)),
    ),
    welcome: moment(
      "WELCOME",
      guest.stayIntent === "Food"
        ? \`Offer a small locally sourced tasting bite or beverage that feels adjacent to ${leadPlace} rather than a generic amenity.\`
        : \`Choose a small local welcome beverage or bite with the same restraint and cultural position as ${leadBrand}.\`,
      "The welcome moment connects the guest's cross-domain taste profile to something physical the hotel can actually prepare.",
      evidence(top(dining, 2), top(brands, 2)),
    ),
    dinner: moment(
      "DINNER",
      \`Lead with ${leadPlace} as the primary dinner direction, then keep one backup from the same Qloo place set.\`,
      "The recommendation is generated from the guest's combined cultural seeds and localized to the property market.",
      evidence(top(dining, 3)),
    ),
    after: moment(
      "AFTER",
      intentAfter[guest.stayIntent],
      \`Use ${leadArtist} and ${leadBrand} as the cultural filter so the evening does not collapse into a generic 'top nightlife' list.\`,
      evidence(top(music, 2), top(brands, 2), top(dining, 1)),
    ),
    tomorrow: moment(
      "TOMORROW",
      \`Build a short local discovery around the sensibility Qloo connects to ${leadDestination}, then pair it with one nearby place from the guest's dining profile.\`,
      "The next-day plan is shaped by the guest's taste pattern, not a one-size-fits-all city itinerary.",
      evidence(top(travel, 2), top(dining, 2)),
    ),
    unexpected: moment(
      "UNEXPECTED",
      \`Add one surprise cultural recommendation adjacent to ${leadFilm} or ${leadBrand} that the guest did not explicitly ask for.\`,
      "This is the demo moment that shows Qloo reaching beyond declared preferences into adjacent taste.",
      evidence(top(film, 2), top(brands, 2)),
    ),
    staffPrep: [
      {
        area: "ROOM",
        actions: [
          intentRoom[guest.stayIntent],
          \`Use ${leadBrand} as a reference for restraint and visual tone, without imitating the brand.\`,
        ],
      },
      {
        area: "F&B",
        actions: [
          \`Prepare one welcome beverage or bite adjacent to ${leadPlace}.\`,
          \`Keep ${names(top(dining, 2)).join(" and ") || "two local options"} ready for concierge handoff.\`,
        ],
      },
      {
        area: "MEDIA",
        actions: [
          \`Arrival audio direction: ${leadArtist} and adjacent artists from the Qloo set.\`,
          \`In-room film direction: ${leadFilm} or a culturally adjacent title.\`,
        ],
      },
      {
        area: "LOCAL",
        actions: [
          \`Primary evening recommendation: ${leadPlace}.\`,
          \`Next-day discovery should reflect the guest's ${profile.toLowerCase()} profile.\`,
        ],
      },
    ],
    confidence: domains.filter((domain) => domain.entities.length >= 2).length >= 3 ? "High" : "Medium",
  };
}
