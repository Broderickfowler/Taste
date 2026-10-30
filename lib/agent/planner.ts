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
  travel: {
    entityType: "urn:entity:destination",
    rationale: "Travel affinities reveal the kinds of places, pace and discovery patterns the guest gravitates toward.",
  },
};

export function planDomains(guest: GuestBrief): DomainPlan[] {
  const intent = guest.stayIntent.toLowerCase();

  const priority: CulturalDomain[] =
    intent === "food"
      ? ["dining", "brands", "music", "film", "travel"]
      : intent === "nightlife"
        ? ["music", "dining", "brands", "film", "travel"]
        : intent === "rest"
          ? ["brands", "film", "music", "dining", "travel"]
          : intent === "romance"
            ? ["dining", "music", "film", "brands", "travel"]
            : ["travel", "dining", "brands", "music", "film"];

  return priority.map((domain) => ({
    domain,
    ...DOMAIN_CONFIG[domain],
  }));
}
