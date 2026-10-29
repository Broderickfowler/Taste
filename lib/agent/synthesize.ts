import { buildCulturalIntersections } from "@/lib/agent/intersections";
import type {
  BusinessBrief,
  DomainResult,
  QlooEntity,
  QlooTasteTag,
  TasteStrategy,
} from "@/lib/types";

function topEntities(domains: DomainResult[], count = 8): QlooEntity[] {
  return domains
    .flatMap((domain) => domain.entities)
    .sort((a, b) => (b.affinity ?? 0) - (a.affinity ?? 0))
    .slice(0, count);
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function synthesizeStrategy(
  brief: BusinessBrief,
  domains: DomainResult[],
  tasteTags: QlooTasteTag[],
): TasteStrategy {
  const leaders = topEntities(domains);
  const intersections = buildCulturalIntersections(domains);

  const culturalDNA = tasteTags
    .map((tag) => tag.name)
    .filter(Boolean)
    .slice(0, 5);

  const leadMusic = domains.find((d) => d.domain === "music")?.entities[0]?.name;
  const leadPlace = domains.find((d) => d.domain === "dining")?.entities[0]?.name;
  const leadBrand = domains.find((d) => d.domain === "brands")?.entities[0]?.name;
  const leadIntersection = intersections[0];

  const campaignName =
    leadIntersection
      ? `${leadIntersection.signals[0].name} × ${leadIntersection.signals[1].name}`
      : brief.location.toLowerCase().includes("guadalajara")
        ? "CULTURAL SIGNAL / GDL"
        : `${titleCase(brief.businessName)} / CULTURAL SIGNAL`;

  const intersectionPremise = leadIntersection
    ? `The leading co-signal is ${leadIntersection.signals[0].name} × ${leadIntersection.signals[1].name} across ${leadIntersection.domains[0]} and ${leadIntersection.domains[1]}.`
    : "Use the strongest available Qloo signals as the cultural foundation.";

  return {
    culturalDNA:
      culturalDNA.length > 0
        ? culturalDNA
        : ["Qloo taste-tag analysis returned no usable tags"],
    intersections,
    campaignConcept: {
      name: campaignName,
      premise: `Build a campaign for ${brief.audience} around the strongest Qloo-backed cultural intersections. ${intersectionPremise} Use the signals as cultural proof, not decoration.`,
    },
    creativeDirection: [
      leadBrand
        ? `Use the visual restraint and cultural position adjacent to ${leadBrand} as a reference point, without copying its identity.`
        : "Use a restrained editorial system built from the strongest Qloo brand signals.",
      leadMusic
        ? `Let ${leadMusic} inform the campaign's energy, pacing and soundtrack direction.`
        : "Let the highest-affinity music signal shape pacing and atmosphere.",
      leadIntersection
        ? `Make the ${leadIntersection.domains[0]} × ${leadIntersection.domains[1]} co-signal visible in the campaign rather than presenting each cultural signal separately.`
        : "Keep the interface and campaign language editorial, specific and locally grounded.",
    ],
    partnershipIdeas: intersections.length
      ? intersections.map(
          (intersection) =>
            `Explore a partnership concept around ${intersection.signals[0].name} × ${intersection.signals[1].name}: ${intersection.opportunity}`,
        )
      : leaders
          .slice(0, 4)
          .map(
            (entity) =>
              `Explore a collaboration, activation or adjacency with ${entity.name}. Validate commercial fit before outreach.`,
          ),
    contentIdeas: [
      "Create a short-form cultural itinerary built from the highest-affinity places and destinations.",
      "Publish a recurring 'Cultural Signal' series that reveals one cross-domain Qloo co-signal at a time.",
      "Pair local stories with Qloo-backed music, brand or film references to make the campaign feel culturally coherent.",
    ],
    experienceIdeas: [
      leadIntersection
        ? leadIntersection.opportunity
        : leadPlace
          ? `Build a guest or customer experience around the local-place signal represented by ${leadPlace}.`
          : "Translate the strongest local-place signal into a physical guest experience.",
      "Create one limited cultural activation that combines at least two independent Qloo domains.",
      "Measure which cultural themes produce the strongest click, save, inquiry or booking response.",
    ],
  };
}
