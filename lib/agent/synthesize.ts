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

function cleanTags(tags: QlooTasteTag[]) {
  return tags
    .map((tag) => tag.name)
    .filter(Boolean)
    .filter((name, index, all) => all.indexOf(name) === index)
    .slice(0, 3);
}

function moment(
  title: string,
  action: string,
  rationale: string,
  evidenceItems: string[],
): ExperienceMoment {
  return { title, action, rationale, evidence: evidenceItems };
}

function placeAt(domain: DomainResult | undefined, index: number, fallback: string) {
  return domain?.entities[index]?.name || fallback;
}

function artistAt(domain: DomainResult | undefined, index: number, fallback: string) {
  return domain?.entities[index]?.name || fallback;
}

function filmAt(domain: DomainResult | undefined, index: number, fallback: string) {
  return domain?.entities[index]?.name || fallback;
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

  const artistOne = artistAt(music, 0, "a quiet soul and jazz mix");
  const artistTwo = artistAt(music, 1, "a complementary second artist");
  const dinnerOne = placeAt(dining, 0, "a nearby independent restaurant");
  const dinnerTwo = placeAt(dining, 1, "a second nearby restaurant");
  const eveningPlace = placeAt(dining, 2, dinnerTwo);
  const filmOne = filmAt(film, 0, "a visually distinctive film");
  const discovery = placeAt(dining, 3, placeAt(dining, 2, dinnerTwo));

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

  const roomAction: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Before arrival, close the blackout curtains halfway, set only the bedside lamps to warm light, turn the TV off, remove unnecessary tabletop materials, and place water beside the bed.",
    Explore: "Keep the room visually calm, place water and a compact neighborhood card by the entry, leave the desk clear, and have a walking route ready for the first two hours after check-in.",
    Romance: "Set warm low lighting, remove visual clutter, place two glasses and chilled sparkling water in the room, and keep the first hour after arrival free of nonessential service interruptions.",
    Nightlife: "Use a brighter arrival light preset, place two bottles of water by the bed, make charging access obvious, and leave a late-return card with room-service and transport information.",
    Food: "Keep the room minimal, place water and a small palate-cleansing snack at arrival, and have the dinner route and reservation details visible before the guest unpacks.",
  };

  const welcomeAction: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Serve chilled mineral water with citrus and a small seasonal fruit plate. Keep the presentation quiet and minimal.",
    Explore: "Offer a local coffee or tea with a small grab-and-go bite that the guest can take into the neighborhood.",
    Romance: "Set out chilled sparkling water, two glasses, seasonal fruit, and a small piece of dark chocolate.",
    Nightlife: "Offer cold sparkling water, citrus, and a light salty snack before the guest heads out for the evening.",
    Food: "Serve a small local tasting bite with a nonalcoholic aperitif so the first food moment feels intentional without replacing dinner.",
  };

  const afterAction: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Keep the evening short. Recommend " + eveningPlace + " only if the guest wants to go back out, otherwise route them directly back for a quiet in-room wind-down.",
    Explore: "Use " + eveningPlace + " as the optional final stop, then send the guest back through a walkable neighborhood route rather than adding another destination.",
    Romance: "Use " + eveningPlace + " as the late stop and keep the recommendation focused on atmosphere, conversation, and a slower pace.",
    Nightlife: "Send the guest to " + eveningPlace + " after dinner as the primary late-night move, then keep one transport option ready for the return to the hotel.",
    Food: "After dinner, use " + eveningPlace + " as the second stop for a drink, dessert, or late bite instead of sending the guest to an unrelated nightlife venue.",
  };

  const tomorrowAction: Record<GuestBrief["stayIntent"], string> = {
    Rest: "Start late. Offer a quiet breakfast window, then suggest " + discovery + " as the single optional outing rather than building a packed itinerary.",
    Explore: "Build the morning around " + discovery + " as the anchor, with one nearby coffee stop and enough open time for the guest to wander.",
    Romance: "Keep the morning unhurried and use " + discovery + " as the only planned stop before lunch.",
    Nightlife: "Plan a slower start, late coffee, and " + discovery + " as the first daytime stop so the schedule respects the previous night.",
    Food: "Use " + discovery + " as the daytime anchor, then add one nearby lunch recommendation from the same local area.",
  };

  return {
    profile,
    headline: guest.propertyName + ", tuned to this guest.",
    room: moment(
      "ROOM",
      roomAction[guest.stayIntent],
      "This changes the physical arrival conditions of the room before the guest walks in.",
      evidence(top(brands, 2), top(film, 2)),
    ),
    arrival: moment(
      "ARRIVAL",
      "Queue a 20-minute arrival set beginning with " + artistOne + ", then transition into " + artistTwo + ". Keep the volume low enough that it feels like atmosphere, not programming.",
      "The first few minutes should immediately feel different from a standard room handoff.",
      evidence(top(music, 3)),
    ),
    welcome: moment(
      "WELCOME",
      welcomeAction[guest.stayIntent],
      "The welcome is intentionally small, specific, and easy for hotel staff to prepare before check-in.",
      evidence(top(dining, 2), top(brands, 2)),
    ),
    dinner: moment(
      "DINNER",
      "Recommend " + dinnerOne + " first. Keep " + dinnerTwo + " as the backup so staff can offer a real alternative without restarting the search.",
      "The guest receives a specific first choice and one fallback, not a long recommendation list.",
      evidence(top(dining, 3)),
    ),
    after: moment(
      "AFTER",
      afterAction[guest.stayIntent],
      "The evening recommendation follows the pace of the stay instead of defaulting every guest to the same nightlife list.",
      evidence(top(dining, 4), top(music, 2)),
    ),
    tomorrow: moment(
      "TOMORROW",
      tomorrowAction[guest.stayIntent],
      "The next day is intentionally paced around the guest's selected stay style.",
      evidence(top(dining, 4), top(travel, 2)),
    ),
    unexpected: moment(
      "UNEXPECTED",
      "Leave a discreet in-room recommendation for " + filmOne + " as an optional wind-down choice, without making it part of the formal itinerary.",
      "This is a small adjacent discovery the guest did not explicitly request.",
      evidence(top(film, 3)),
    ),
    staffPrep: [
      {
        area: "ROOM",
        actions: [
          roomAction[guest.stayIntent],
          "Complete the setup before the guest reaches the room. Do not explain the personalization unless the guest asks.",
        ],
      },
      {
        area: "F&B",
        actions: [
          welcomeAction[guest.stayIntent],
          "Keep " + dinnerOne + " and " + dinnerTwo + " ready as the concierge's two dinner choices.",
        ],
      },
      {
        area: "MEDIA",
        actions: [
          "Arrival audio: begin with " + artistOne + " and move into " + artistTwo + ".",
          "Optional in-room film: " + filmOne + ".",
        ],
      },
      {
        area: "LOCAL",
        actions: [
          "Dinner: " + dinnerOne + ". Backup: " + dinnerTwo + ".",
          "Later or next-day option: " + discovery + ".",
        ],
      },
    ],
    confidence: domains.filter((domain) => domain.entities.length >= 2).length >= 3 ? "High" : "Medium",
  };
}
