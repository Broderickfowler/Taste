export type CulturalDomain =
  | "music"
  | "dining"
  | "brands"
  | "film"
  | "travel";

export type BusinessBrief = {
  businessName: string;
  businessType: string;
  location: string;
  audience: string;
  goal: string;
  interests: string[];
};

export type SeedContribution = {
  id: string;
  name: string;
  score: number | null;
};

export type QlooEntity = {
  id: string;
  name: string;
  type?: string;
  affinity?: number | null;
  description?: string | null;
  image?: string | null;
  tags: string[];
  explainability?: unknown;
  drivers?: SeedContribution[];
  raw?: unknown;
};

export type QlooTasteTag = {
  id: string;
  name: string;
  affinity: number | null;
  types: string[];
  raw?: unknown;
};

export type DomainResult = {
  domain: CulturalDomain;
  entityType: string;
  rationale: string;
  entities: QlooEntity[];
};

export type IntersectionSignal = {
  id: string;
  name: string;
  affinity: number | null;
  drivers: SeedContribution[];
};

export type CulturalIntersection = {
  id: string;
  domains: [CulturalDomain, CulturalDomain];
  signals: [IntersectionSignal, IntersectionSignal];
  sharedContext: string[];
  evidence: string;
  opportunity: string;
  explainabilityAvailable: boolean;
};

export type AgentTraceStep = {
  stage: string;
  detail: string;
  status: "complete" | "warning";
};

export type TasteStrategy = {
  culturalDNA: string[];
  intersections: CulturalIntersection[];
  campaignConcept: {
    name: string;
    premise: string;
  };
  creativeDirection: string[];
  partnershipIdeas: string[];
  contentIdeas: string[];
  experienceIdeas: string[];
};

export type TasteAgentResult = {
  brief: BusinessBrief;
  resolvedSeeds: QlooEntity[];
  unresolvedSeeds: string[];
  tasteTags: QlooTasteTag[];
  domains: DomainResult[];
  strategy: TasteStrategy;
  trace: AgentTraceStep[];
};
