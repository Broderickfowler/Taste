import { getInsights, searchEntity } from "@/lib/qloo/client";
import { planDomains } from "@/lib/agent/planner";
import { synthesizeStrategy } from "@/lib/agent/synthesize";
import type {
  AgentTraceStep,
  BusinessBrief,
  DomainResult,
  QlooEntity,
  TasteAgentResult,
} from "@/lib/types";

export async function runTasteAgent(
  brief: BusinessBrief,
): Promise<TasteAgentResult> {
  const trace: AgentTraceStep[] = [];
  const resolvedSeeds: QlooEntity[] = [];
  const unresolvedSeeds: string[] = [];

  trace.push({
    stage: "PLAN",
    detail: `Selected cultural domains based on a ${brief.businessType} brief and the goal: ${brief.goal}`,
    status: "complete",
  });

  for (const interest of brief.interests) {
    try {
      const entity = await searchEntity(interest);
      if (entity) {
        resolvedSeeds.push(entity);
        trace.push({
          stage: "RESOLVE",
          detail: `Resolved "${interest}" to Qloo entity ${entity.name} (${entity.id}).`,
          status: "complete",
        });
      } else {
        unresolvedSeeds.push(interest);
        trace.push({
          stage: "RESOLVE",
          detail: `Qloo returned no usable entity for "${interest}". It was not guessed or replaced.`,
          status: "warning",
        });
      }
    } catch (error) {
      unresolvedSeeds.push(interest);
      trace.push({
        stage: "RESOLVE",
        detail: `Could not resolve "${interest}": ${error instanceof Error ? error.message : "unknown error"}`,
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
  const domainPlans = planDomains(brief);
  const domains: DomainResult[] = [];

  for (const plan of domainPlans) {
    try {
      const entities = await getInsights({
        entityType: plan.entityType,
        seedIds,
        location: brief.location,
        take: 8,
      });

      domains.push({
        domain: plan.domain,
        entityType: plan.entityType,
        rationale: plan.rationale,
        entities,
      });

      trace.push({
        stage: "EXPLORE",
        detail: `${plan.domain}: received ${entities.length} Qloo recommendations with explainability requested.`,
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
        stage: "EXPLORE",
        detail: `${plan.domain}: ${error instanceof Error ? error.message : "Qloo request failed"}`,
        status: "warning",
      });
    }
  }

  const strategy = synthesizeStrategy(brief, domains);

  trace.push({
    stage: "INTERSECT",
    detail: strategy.intersections.length
      ? `Ranked ${strategy.intersections.length} cross-domain co-signals. Intersections mean independent Qloo recommendations surfaced from the same seed profile, not a claimed causal relationship.`
      : "No cross-domain intersections had enough live Qloo data to display.",
    status: strategy.intersections.length ? "complete" : "warning",
  });

  trace.push({
    stage: "SYNTHESIZE",
    detail:
      "Converted the Qloo-grounded domain results and intersections into one cultural strategy while preserving the underlying evidence.",
    status: "complete",
  });

  return {
    brief,
    resolvedSeeds,
    unresolvedSeeds,
    domains,
    strategy,
    trace,
  };
}
