import type {
  DomainResult,
  ExperienceMoment,
  GuestBrief,
  HospitalityExperience,
  HotelCapability,
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

function entityAt(domain: DomainResult | undefined, index: number, fallback: string) {
  return domain?.entities[index]?.name || fallback;
}

function hasCapability(guest: GuestBrief, capability: HotelCapability) {
  return guest.capabilities.includes(capability);
}

function addMinutes(time: string, minutes: number) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return minutes === 0 ? time : time + " +" + minutes + "m";
  const total = (Number(match[1]) * 60 + Number(match[2]) + minutes) % (24 * 60);
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0");
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
  const local = domains.find((d) => d.domain === "local");

  const artistOne = entityAt(music, 0, "a low-key arrival mix");
  const artistTwo = entityAt(music, 1, "a complementary second artist");
  const dinnerOne = placeAt(dining, 0, "a nearby independent restaurant");
  const dinnerTwo = placeAt(dining, 1, "a second nearby restaurant");
  const eveningPlace = placeAt(local, 1, placeAt(dining, 2, dinnerTwo));
  const discovery = placeAt(local, 0, placeAt(dining, 3, dinnerTwo));
  const filmOne = entityAt(film, 0, "a visually distinctive film");

  const tags = cleanTags(tasteTags);
  const profile =
    tags.length > 0
      ? tags.join(" / ")
      : guest.stayIntent === "Rest"
        ? "quiet / design-led / restorative"
        : guest.stayIntent === "Nightlife"
          ? "social / energetic / after-dark"
          : guest.stayIntent === "Romance"
            ? "intimate / sensory / unhurried"
            : guest.stayIntent === "Food"
              ? "food-led / local / discovery-driven"
              : "curious / local / culture-led";

  const lighting = hasCapability(guest, "Lighting");
  const welcomeAmenity = hasCapability(guest, "Welcome amenity");
  const audio = hasCapability(guest, "In-room audio");
  const streaming = hasCapability(guest, "In-room streaming");
  const concierge = hasCapability(guest, "Concierge");
  const reservations = hasCapability(guest, "Restaurant reservations");
  const transport = hasCapability(guest, "Transport");
  const roomService = hasCapability(guest, "Room service");

  const roomAction = lighting
    ? guest.stayIntent === "Nightlife"
      ? "Set a brighter arrival preset, leave bedside lighting warm for the return, clear the desk, and make charging access obvious."
      : "Set warm low lighting, remove unnecessary visual clutter, keep the TV off, and place water beside the bed before arrival."
    : "Keep the room visually quiet, remove unnecessary tabletop clutter, leave the TV off, and place water beside the bed before arrival.";

  const welcomeAction = welcomeAmenity
    ? guest.stayIntent === "Nightlife"
      ? "Place cold sparkling water, citrus, and a light salty snack in the room before check-in."
      : guest.stayIntent === "Food"
        ? "Place a small local tasting bite with a nonalcoholic aperitif in the room before check-in."
        : "Place chilled mineral water with citrus and a small seasonal fruit plate in the room before check-in."
    : "Skip the physical amenity. Put one concise personalized welcome card in the room with the first recommendation and the evening contact point.";

  const arrivalAction = audio
    ? "Queue a 20-minute arrival set beginning with " + artistOne + ", then transition into " + artistTwo + ". Keep the volume low."
    : "Use " + artistOne + " and " + artistTwo + " as the arrival soundtrack direction in the guest card, but do not promise in-room playback because this property does not support it.";

  const dinnerAction =
    "Recommend " +
    dinnerOne +
    " first and " +
    dinnerTwo +
    " as the backup." +
    (reservations
      ? " Prepare a reservation option for both."
      : " Present both as concierge suggestions without implying the hotel can book them.") +
    (guest.constraints.dietary
      ? " Before confirming either, staff must verify the guest's dietary note: " +
        guest.constraints.dietary +
        "."
      : "");

  const afterAction =
    guest.stayIntent === "Rest"
      ? "Keep the evening optional. Offer " + eveningPlace + " only if the guest wants to go back out."
      : "Use " + eveningPlace + " as the next local move after dinner." +
        (transport
          ? " Keep a return transport option ready."
          : " Do not promise transport; provide simple return directions instead.");

  const tomorrowAction =
    guest.stayIntent === "Nightlife"
      ? "Plan a slower start and make " + discovery + " the first optional daytime stop."
      : "Make " + discovery + " the anchor local discovery, with open time around it rather than a packed itinerary.";

  const unexpectedAction = streaming
    ? "Leave " + filmOne + " as an optional in-room wind-down recommendation."
    : "Add " + filmOne + " to the guest's optional watch-later list without presenting it as an in-room amenity.";

  const staffPrep = [
    {
      area: "ROOM" as const,
      actions: [
        roomAction,
        roomService
          ? "Room service is available as a fallback if the guest chooses not to go back out."
          : "Do not suggest room service as a fallback because this property does not offer it.",
      ],
    },
    {
      area: "F&B" as const,
      actions: [
        welcomeAction,
        dinnerAction,
        guest.constraints.dietary
          ? "Dietary note: " + guest.constraints.dietary + ". Validate directly with the venue before confirmation."
          : "No dietary note supplied.",
      ],
    },
    {
      area: "MEDIA" as const,
      actions: [arrivalAction, unexpectedAction],
    },
    {
      area: "LOCAL" as const,
      actions: [
        "Primary local discovery: " + discovery + ".",
        "Evening option: " + eveningPlace + ".",
        guest.constraints.avoid
          ? "Avoid preference: " + guest.constraints.avoid + ". Staff should use this as a human review constraint."
          : "No explicit avoid preference supplied.",
      ],
    },
  ];

  if (!concierge) {
    staffPrep[3].actions.push(
      "This property has no concierge capability enabled, so surface directions directly to the guest instead of creating a concierge handoff.",
    );
  }

  const itinerary = [
    {
      time: guest.constraints.arrivalTime,
      title: "Arrival",
      detail: roomAction,
    },
    {
      time: addMinutes(guest.constraints.arrivalTime, 15),
      title: "Settle in",
      detail: welcomeAction,
    },
    {
      time: addMinutes(guest.constraints.arrivalTime, 30),
      title: "Sound of the stay",
      detail: arrivalAction,
    },
    {
      time: addMinutes(guest.constraints.arrivalTime, 150),
      title: "Dinner",
      detail: dinnerAction,
    },
    {
      time: addMinutes(guest.constraints.arrivalTime, 300),
      title: "After",
      detail: afterAction,
    },
    {
      time: "Next morning",
      title: "Local discovery",
      detail: tomorrowAction,
    },
  ];

  return {
    profile:
      profile +
      " / " +
      guest.constraints.budget.toLowerCase() +
      " budget",
    headline: guest.propertyName + ", tuned to this guest.",
    room: moment(
      "ROOM",
      roomAction,
      "Only actions supported by the property's enabled room capabilities are included.",
      evidence(top(brands, 2), top(film, 2)),
    ),
    arrival: moment(
      "ARRIVAL",
      arrivalAction,
      "Music influences the arrival mood, but playback is only promised when the property supports in-room audio.",
      evidence(top(music, 3)),
    ),
    welcome: moment(
      "WELCOME",
      welcomeAction,
      "The welcome moment adapts to the stay intent and the hotel's amenity capabilities.",
      evidence(top(dining, 2), top(brands, 2)),
    ),
    dinner: moment(
      "DINNER",
      dinnerAction,
      "Dinner uses local restaurant inventory and keeps dietary verification explicit rather than inferred.",
      evidence(top(dining, 3)),
    ),
    after: moment(
      "AFTER",
      afterAction,
      "The after-dinner move uses local inventory and respects whether the hotel can arrange transport.",
      evidence(top(local, 4), top(dining, 2)),
    ),
    tomorrow: moment(
      "TOMORROW",
      tomorrowAction,
      "Local discovery comes from location-scoped place inventory, not destination recommendations.",
      evidence(top(local, 4)),
    ),
    unexpected: moment(
      "UNEXPECTED",
      unexpectedAction,
      "Adjacent film taste becomes an optional discovery without pretending the hotel offers unsupported media services.",
      evidence(top(film, 3)),
    ),
    staffPrep,
    itinerary,
    confidence:
      domains.filter((domain) => domain.entities.length >= 2).length >= 3
        ? "High"
        : "Medium",
  };
}
