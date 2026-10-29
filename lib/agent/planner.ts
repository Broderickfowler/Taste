import type { BusinessBrief, CulturalDomain } from "@/lib/types";

type DomainPlan = {
  domain: CulturalDomain;
  entityType: string;
  rationale: string;
};

const DOMAIN_CONFIG: Record<CulturalDomain, Omit<DomainPlan, "domain">> = {
  music: {
    entityType: "urn:entity:artist",
    rationale: "Music reveals atmosphere, identity, event and creator adjacency.",
  },
  dining: {
    entityType: "urn:entity:place",
    rationale: "Local places reveal neighborhood lifestyle, venue and partnership opportunities.",
  },
  brands: {
    entityType: "urn:entity:brand",
    rationale: "Brands expose aesthetic, status and collaboration signals.",
  },
  film: {
    entityType: "urn:entity:movie",
    rationale: "Film helps translate taste into visual language and storytelling.",
  },
  travel: {
    entityType: "urn:entity:destination",
    rationale: "Destinations reveal the travel contexts this audience is drawn toward.",
  },
};

export function planDomains(brief: BusinessBrief): DomainPlan[] {
  const text = `${brief.businessType} ${brief.goal}`.toLowerCase();

  const priority: CulturalDomain[] =
    /hotel|hospitality|resort|travel|tourism/.test(text)
      ? ["dining", "travel", "music", "brands", "film"]
      : /restaurant|food|bar|cafe/.test(text)
        ? ["dining", "music", "brands", "travel", "film"]
        : /fashion|apparel|beauty|retail/.test(text)
          ? ["brands", "music", "film", "dining", "travel"]
          : ["brands", "music", "dining", "film", "travel"];

  return priority.map((domain) => ({
    domain,
    ...DOMAIN_CONFIG[domain],
  }));
}
