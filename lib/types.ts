export type CulturalDomain =
  | "music"
  | "dining"
  | "brands"
  | "film"
  | "local";

export type StayIntent =
  | "Rest"
  | "Explore"
  | "Romance"
  | "Nightlife"
  | "Food"
  | "Celebrate"
  | "Business";

export type TripPurpose = "Leisure" | "Business" | "Celebration" | "Mixed";

export type BudgetTier = "$" | "$$" | "$$$" | "$$$$";

export type PreferenceCategory =
  | "Live Music"
  | "Fine Dining"
  | "Local Food"
  | "Art"
  | "Architecture"
  | "Shopping"
  | "Spa"
  | "Wellness"
  | "Nightlife"
  | "Walking Distance"
  | "Guided Tours"
  | "In-room Services"
  | "Design"
  | "Nature";

export type InterestKind =
  | "Artist"
  | "Film"
  | "Brand"
  | "Restaurant"
  | "Cuisine"
  | "Activity"
  | "Other";

export type GuestBrief = {
  guestName?: string;
  propertyName: string;
  location: string;
  stayIntent: StayIntent;
  tripPurpose: TripPurpose;
  budgetTier: BudgetTier;
  partySize: number;
  adults: number;
  children: number;
  preferences: PreferenceCategory[];
  interests: string[];
  interestKinds: InterestKind[];
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

export type AgentTraceStep = {
  stage: string;
  detail: string;
  status: "complete" | "warning";
};

export type ExperienceMoment = {
  title: string;
  action: string;
  rationale: string;
  evidence: string[];
};

export type StaffPrepSection = {
  area: "ROOM" | "F&B" | "MEDIA" | "LOCAL";
  actions: string[];
};

export type HospitalityExperience = {
  profile: string;
  headline: string;
  room: ExperienceMoment;
  arrival: ExperienceMoment;
  welcome: ExperienceMoment;
  dinner: ExperienceMoment;
  after: ExperienceMoment;
  tomorrow: ExperienceMoment;
  unexpected: ExperienceMoment;
  staffPrep: StaffPrepSection[];
  confidence: "High" | "Medium";
};

export type TasteAgentResult = {
  guest: GuestBrief;
  resolvedSeeds: QlooEntity[];
  unresolvedSeeds: string[];
  tasteTags: QlooTasteTag[];
  domains: DomainResult[];
  experience: HospitalityExperience;
  trace: AgentTraceStep[];
};
