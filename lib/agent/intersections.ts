import type {
  CulturalDomain,
  CulturalIntersection,
  DomainResult,
  QlooEntity,
} from "@/lib/types";

const OPPORTUNITY_BY_PAIR: Record<string, string> = {
  "brands|film":
    "Translate the brand and film co-signal into a distinct visual world, editorial partnership, or limited campaign collaboration.",
  "brands|music":
    "Use the brand and music co-signal to shape creator casting, soundtrack, merchandise, and culturally aligned partnerships.",
  "brands|dining":
    "Turn the brand and local-place co-signal into a design-led neighborhood collaboration, limited amenity, or co-branded activation.",
  "brands|travel":
    "Use the brand and travel co-signal to shape destination partnerships, guest amenities, retail, and arrival moments.",
  "dining|film":
    "Build a local-place and cinema moment such as a screening dinner, filmmaker itinerary, or editorial nightlife experience.",
  "dining|music":
    "Build an after-dark local-place and sound experience that turns two audience affinities into one bookable or shareable moment.",
  "dining|travel":
    "Convert the local-place and travel co-signal into a neighborhood guide, cultural itinerary, or destination-led guest package.",
  "film|music":
    "Use the film and music co-signal as the campaign's narrative language, soundtrack direction, and creator brief.",
  "film|travel":
    "Turn the film and travel co-signal into a cinematic destination story, itinerary, or themed guest experience.",
  "music|travel":
    "Use the music and travel co-signal to create a location-specific soundtrack, live program, or creator-led destination story.",
};

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

function sharedTags(a: QlooEntity, b: QlooEntity) {
  const left = new Map(a.tags.map((tag) => [normalizeTag(tag), tag]));
  const right = new Set(b.tags.map(normalizeTag));

  return Array.from(left.entries())
    .filter(([key]) => right.has(key))
    .map(([, original]) => original)
    .slice(0, 4);
}

function pairKey(a: CulturalDomain, b: CulturalDomain) {
  return [a, b].sort().join("|");
}

function opportunityFor(a: CulturalDomain, b: CulturalDomain) {
  return (
    OPPORTUNITY_BY_PAIR[pairKey(a, b)] ||
    "Combine these independent Qloo signals into one campaign, partnership, or experience and validate the idea against the business objective."
  );
}

function affinityScore(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value >= 0 && value <= 1) return value;
  return Math.min(Math.abs(value), 100) / 100;
}

export function buildCulturalIntersections(
  domains: DomainResult[],
): CulturalIntersection[] {
  const usable = domains.filter((domain) => domain.entities.length > 0);
  const candidates: Array<CulturalIntersection & { _score: number }> = [];

  for (let i = 0; i < usable.length; i += 1) {
    for (let j = i + 1; j < usable.length; j += 1) {
      const leftDomain = usable[i];
      const rightDomain = usable[j];
      const left = leftDomain.entities[0];
      const right = rightDomain.entities[0];

      if (!left || !right) continue;

      const sharedContext = sharedTags(left, right);
      const explainabilityAvailable = Boolean(
        left.explainability || right.explainability,
      );

      const leftDrivers = left.drivers ?? [];
      const rightDrivers = right.drivers ?? [];
      const sharedDrivers = leftDrivers
        .filter((leftDriver) =>
          rightDrivers.some((rightDriver) => rightDriver.id === leftDriver.id),
        )
        .map((driver) => driver.name);

      const evidence = sharedDrivers.length
        ? `${left.name} and ${right.name} were both linked by Qloo explainability to ${sharedDrivers.join(", ")}.`
        : sharedContext.length
          ? `${left.name} and ${right.name} independently surfaced from the same Qloo seed profile and share Qloo metadata: ${sharedContext.join(", ")}.`
          : `${left.name} and ${right.name} independently surfaced as leading signals in ${leftDomain.domain} and ${rightDomain.domain} from the same Qloo seed profile.`;

      const _score =
        sharedDrivers.length * 3 +
        sharedContext.length * 2 +
        affinityScore(left.affinity) +
        affinityScore(right.affinity) +
        (explainabilityAvailable ? 0.5 : 0) +
        Math.max(0, 0.2 - (i + j) * 0.02);

      candidates.push({
        id: `${leftDomain.domain}-${rightDomain.domain}-${left.id}-${right.id}`,
        domains: [leftDomain.domain, rightDomain.domain],
        signals: [
          {
            id: left.id,
            name: left.name,
            affinity: left.affinity ?? null,
            drivers: leftDrivers,
          },
          {
            id: right.id,
            name: right.name,
            affinity: right.affinity ?? null,
            drivers: rightDrivers,
          },
        ],
        sharedContext,
        evidence,
        opportunity: opportunityFor(leftDomain.domain, rightDomain.domain),
        explainabilityAvailable,
        _score,
      });
    }
  }

  return candidates
    .sort((a, b) => b._score - a._score)
    .slice(0, 4)
    .map(({ _score, ...intersection }) => intersection);
}
