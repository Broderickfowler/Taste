import type { CulturalDomain, GuestBrief } from "@/lib/types";

type DomainPlan = {
  domain: CulturalDomain;
  entityType: string;
  rationale: string;
};

const DOMAIN_CONFIG: Record<CulturalDomain, Omit<DomainPlan, "domain">> = {
  music: {
    entityType: "urn:entity:artist",
    rationale: "Music shapes arrival energy, soundtrack direction and the emotional tempo of the stay.",
  },
  dining: {
    entityType: "urn:entity:place",
    rationale: "Local places turn guest taste into specific food, drink and neighborhood recommendations.",
  },
  brands: {
    entityType: "urn:entity:brand",
    rationale: "Brand affinities help translate taste into room mood, service style and visual restraint.",
  },
  film: {
    entityType: "urn:entity:movie",
    rationale: "Film affinities provide a cinematic language for atmosphere, pacing and in-room recommendations.",
  },
  local: {
    entityType: "urn:entity:place",
    rationale: "Local inventory turns the hotel location into nearby culturally relevant places and experiences.",
  },
};

export function planDomains(guest: GuestBrief): DomainPlan[] {
  const intent = guest.stayIntent.toLowerCase();

  const priority: CulturalDomain[] =
    intent === "food"
      ? ["dining", "local", "brands", "music", "film"]
      : intent === "nightlife"
        ? ["music", "dining", "local", "brands", "film"]
        : intent === "rest"
          ? ["brands", "film", "music", "local", "dining"]
          : intent === "romance"
            ? ["dining", "music", "local", "film", "brands"]
            : ["local", "dining", "brands", "music", "film"];

  return priority.map((domain) => ({
    domain,
    ...DOMAIN_CONFIG[domain],
  }));
}
