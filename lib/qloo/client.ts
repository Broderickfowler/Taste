import type { QlooEntity } from "@/lib/types";

const QLOO_BASE_URL =
  process.env.QLOO_BASE_URL?.replace(/\/$/, "") ||
  "https://hackathon.api.qloo.com";

function requireKey() {
  const key = process.env.QLOO_API_KEY;
  if (!key) {
    throw new Error("QLOO_API_KEY is not configured.");
  }
  return key;
}

async function qlooFetch(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
  attempt = 0,
): Promise<any> {
  const url = new URL(path, QLOO_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": requireKey(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) =>
      setTimeout(resolve, 700 * Math.pow(2, attempt)),
    );
    return qlooFetch(path, params, attempt + 1);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Qloo request failed with HTTP ${response.status}`;
    throw new Error(String(message));
  }

  return payload;
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function extractEntityCandidates(payload: any): any[] {
  const candidates = [
    payload?.results?.entities,
    payload?.results,
    payload?.data?.results?.entities,
    payload?.data?.results,
    payload?.entities,
    payload?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function tagNames(raw: any): string[] {
  const tags = [
    ...asArray(raw?.tags),
    ...asArray(raw?.properties?.tags),
    ...asArray(raw?.query?.tags),
  ];

  return tags
    .map((tag) =>
      typeof tag === "string"
        ? tag
        : tag?.name || tag?.label || tag?.value || tag?.id,
    )
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeEntity(raw: any): QlooEntity | null {
  const id =
    raw?.entity_id ||
    raw?.id ||
    raw?.entity?.id ||
    raw?.entity?.entity_id ||
    raw?.uuid;
  const name =
    raw?.name ||
    raw?.entity?.name ||
    raw?.properties?.name ||
    raw?.title;

  if (!id || !name) return null;

  const affinity =
    raw?.query?.affinity ??
    raw?.affinity ??
    raw?.score ??
    raw?.entity?.query?.affinity ??
    null;

  return {
    id: String(id),
    name: String(name),
    type:
      raw?.type ||
      raw?.entity?.type ||
      raw?.entity_type ||
      raw?.properties?.type,
    affinity: typeof affinity === "number" ? affinity : null,
    description:
      raw?.description ||
      raw?.properties?.description ||
      raw?.entity?.description ||
      null,
    image:
      raw?.properties?.image?.url ||
      raw?.image?.url ||
      raw?.image ||
      raw?.entity?.properties?.image?.url ||
      null,
    tags: tagNames(raw),
    explainability:
      raw?.query?.explainability ||
      raw?.explainability ||
      raw?.entity?.query?.explainability,
    raw,
  };
}

export async function searchEntity(
  query: string,
  type?: string,
): Promise<QlooEntity | null> {
  const payload = await qlooFetch("/search", {
    query,
    types: type,
    take: 5,
  });

  const normalized = extractEntityCandidates(payload)
    .map(normalizeEntity)
    .filter((entity): entity is QlooEntity => Boolean(entity));

  if (!normalized.length && type) {
    const fallback = await qlooFetch("/search", {
      query,
      take: 5,
    });
    return (
      extractEntityCandidates(fallback)
        .map(normalizeEntity)
        .find((entity): entity is QlooEntity => Boolean(entity)) || null
    );
  }

  return normalized[0] || null;
}

export async function getInsights(args: {
  entityType: string;
  seedIds: string[];
  location?: string;
  take?: number;
}): Promise<QlooEntity[]> {
  const payload = await qlooFetch("/v2/insights", {
    "filter.type": args.entityType,
    "signal.interests.entities": args.seedIds.join(","),
    "filter.exclude.entities": args.seedIds.join(","),
    "feature.explainability": true,
    "filter.location.query":
      args.entityType === "urn:entity:place" ||
      args.entityType === "urn:entity:destination"
        ? args.location
        : undefined,
    take: args.take ?? 8,
  });

  return extractEntityCandidates(payload)
    .map(normalizeEntity)
    .filter((entity): entity is QlooEntity => Boolean(entity));
}

export async function qlooHealthcheck() {
  const payload = await qlooFetch("/search", {
    query: "Beyonce",
    types: "urn:entity:artist",
    take: 1,
  });

  return {
    configured: true,
    reachable: true,
    sampleCount: extractEntityCandidates(payload).length,
  };
}
