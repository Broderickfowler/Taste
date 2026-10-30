export type CulturalDomain =
  | "music"
  | "dining"
  | "brands"
  | "film"
  | "local";

export type StayIntent = "Rest" | "Explore" | "Romance" | "Nightlife" | "Food";

export type HotelCapability =
  | "Lighting"
  | "Welcome amenity"
  | "In-room audio"
  | "In-room streaming"
  | "Concierge"
  | "Restaurant reservations"
  | "Transport"
  | "Room service"
  | "Spa";

export type GuestConstraints = {
  dietary: string;
  avoid: string;
  budget: "Flexible" | "Value" | "Premium";
  arrivalTime: string;
  checkoutTime: string;
};

export type GuestBrief = {
  propertyName: string;
  location: string;
  neighborhood: string;
  stayIntent: StayIntent;
  interests: string[];
  capabilities: HotelCapability[];
  constraints: GuestConstraints;
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

export type InterpretedInterest = {
  input: string;
  resolvedName: string;
  resolvedType: string;
  id: string;
};

export type LocationContext = {
  requested: string;
  resolvedName: string;
  resolvedId: string | null;
  strictBoundary: boolean;
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

export type ItineraryItem = {
  time: string;
  title: string;
  detail: string;
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
  itinerary: ItineraryItem[];
  confidence: "High" | "Medium";
};

export type TasteAgentResult = {
  guest: GuestBrief;
  interpretedInterests: InterpretedInterest[];
  locationContext: LocationContext;
  resolvedSeeds: QlooEntity[];
  unresolvedSeeds: string[];
  tasteTags: QlooTasteTag[];
  domains: DomainResult[];
  experience: HospitalityExperience;
  trace: AgentTraceStep[];
};
