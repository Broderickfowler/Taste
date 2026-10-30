import { getInsights, getTasteTags, searchEntity } from "@/lib/qloo/client";
import { extractSeedContributions } from "@/lib/qloo/explainability";
import { planDomains } from "@/lib/agent/planner";
import { synthesizeExperience } from "@/lib/agent/synthesize";
import type {
  AgentTraceStep,
  DomainResult,
  GuestBrief,
  QlooEntity,
  QlooTasteTag,
  TasteAgentResult,
} from "@/lib/types";

export async function runTasteAgent(
  guest: GuestBrief,
): Promise<TasteAgentResult> {
  const trace: AgentTraceStep[] = [];
  const resolvedSeeds: QlooEntity[] = [];
  const unresolvedSeeds: string[] = [];

  trace.push({
    stage: "PLAN",
    detail: "Building a " + guest.stayIntent.toLowerCase() + " stay for " + guest.propertyName + " in " + guest.location + ".",
    status: "complete",
  });

  for (const interest of guest.interests) {
    try {
      const entity = await searchEntity(interest);
      if (entity) {
        resolvedSeeds.push(entity);
        trace.push({
          stage: "RESOLVE",
          detail: 'Resolved "' + interest + '" to Qloo entity ' + entity.name + " (" + entity.id + ").",
          status: "complete",
        });
      } else {
        unresolvedSeeds.push(interest);
        trace.push({
          stage: "RESOLVE",
          detail: 'Qloo returned no usable entity for "' + interest + '". It was not guessed or replaced.',
          status: "warning",
        });
      }
    } catch (error) {
      unresolvedSeeds.push(interest);
      trace.push({
        stage: "RESOLVE",
        detail: 'Could not resolve "' + interest + '": ' + (error instanceof Error ? error.message : "unknown error"),
        status: "warning",
      });
    }
  }

  if (resolvedSeeds.length === 0) {
    throw new Error(
      "None of the supplied interests resolved to Qloo entities. Add at least one recognizable cultural interest.",
    );
  }

  const seedIds = resolvedSeeds.map((entity) => entity.id);
  const domainPlans = planDomains(guest);
  const domains: DomainResult[] = [];

  let tasteTags: QlooTasteTag[] = [];
  try {
    tasteTags = await getTasteTags(seedIds, 12);
    trace.push({
      stage: "PROFILE",
      detail: "Received " + tasteTags.length + " Qloo taste tags for the combined guest profile.",
      status: tasteTags.length ? "complete" : "warning",
    });
  } catch (error) {
    trace.push({
      stage: "PROFILE",
      detail: "Taste-tag analysis unavailable: " + (error instanceof Error ? error.message : "Qloo request failed"),
      status: "warning",
    });
  }

  for (const plan of domainPlans) {
    try {
      const entities = (await getInsights({
        entityType: plan.entityType,
        seedIds,
        location: guest.location,
        tags:
          plan.domain === "dining"
            ? "restaurant"
            : plan.domain === "local"
              ? "attraction"
              : undefined,
        take: 8,
      })).map((entity) => ({
        ...entity,
        drivers: extractSeedContributions(entity.explainability, resolvedSeeds),
      }));

      domains.push({
        domain: plan.domain,
        entityType: plan.entityType,
        rationale: plan.rationale,
        entities,
      });

      trace.push({
        stage: "ADAPT",
        detail: plan.domain + ": received " + entities.length + " Qloo recommendations to shape the stay.",
        status: entities.length ? "complete" : "warning",
      });
    } catch (error) {
      domains.push({
        domain: plan.domain,
        entityType: plan.entityType,
        rationale: plan.rationale,
        entities: [],
      });

      trace.push({
        stage: "ADAPT",
        detail: plan.domain + ": " + (error instanceof Error ? error.message : "Qloo request failed"),
        status: "warning",
      });
    }
  }

  const experience = synthesizeExperience(guest, domains, tasteTags);

  trace.push({
    stage: "OPERATE",
    detail:
      "Translated Qloo-backed affinities into guest-facing stay moments and a staff preparation card while preserving the evidence trail.",
    status: "complete",
  });

  return {
    guest,
    resolvedSeeds,
    unresolvedSeeds,
    tasteTags,
    domains,
    experience,
    trace,
  };
}
