import type { QlooEntity, SeedContribution } from "@/lib/types";

const SCORE_KEYS = [
  "score",
  "influence",
  "contribution",
  "weight",
  "affinity",
  "value",
  "normalized_score",
  "normalizedScore",
];

function normalizeId(value: unknown) {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function numericScoreFromObject(node: Record<string, unknown>) {
  for (const key of SCORE_KEYS) {
    const value = node[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function findScore(node: unknown, targetId: string): number | null {
  const target = targetId.toLowerCase();

  if (Array.isArray(node)) {
    for (const item of node) {
      const score = findScore(item, targetId);
      if (score !== null) return score;
    }
    return null;
  }

  if (!node || typeof node !== "object") return null;

  const object = node as Record<string, unknown>;

  for (const [key, value] of Object.entries(object)) {
    if (key.toLowerCase() === target && typeof value === "number") {
      return value;
    }
  }

  const possibleIds = [
    object.id,
    object.entity_id,
    object.entityId,
    (object.entity as Record<string, unknown> | undefined)?.id,
    (object.entity as Record<string, unknown> | undefined)?.entity_id,
  ];

  if (possibleIds.some((value) => normalizeId(value) === target)) {
    const localScore = numericScoreFromObject(object);
    if (localScore !== null) return localScore;
  }

  for (const value of Object.values(object)) {
    const score = findScore(value, targetId);
    if (score !== null) return score;
  }

  return null;
}

export function extractSeedContributions(
  explainability: unknown,
  seeds: QlooEntity[],
): SeedContribution[] {
  if (!explainability) return [];

  let serialized = "";
  try {
    serialized = JSON.stringify(explainability).toLowerCase();
  } catch {
    return [];
  }

  return seeds
    .filter((seed) => serialized.includes(seed.id.toLowerCase()))
    .map((seed) => ({
      id: seed.id,
      name: seed.name,
      score: findScore(explainability, seed.id),
    }))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}
