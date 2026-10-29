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

export type QlooEntity = {
  id: string;
  name: string;
  type?: string;
  affinity?: number | null;
  description?: string | null;
  image?: string | null;
  tags: string[];
  explainability?: unknown;
  raw?: unknown;
};

export type DomainResult = {
  domain: CulturalDomain;
  entityType: string;
  rationale: string;
  entities: QlooEntity[];
};

export type AgentTraceStep = {
  stage: string;
  detail: string;
  status: "complete" | "warning";
};

export type TasteStrategy = {
  culturalDNA: string[];
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
  domains: DomainResult[];
  strategy: TasteStrategy;
  trace: AgentTraceStep[];
};
