# TASTE//OS Architecture

## Product thesis

Businesses often know a demographic target but do not know the cultural relationships that make that audience respond. TASTE//OS turns a business brief into an evidence-backed cultural strategy.

## Flow

1. User submits business, location, audience, objective and known cultural interests.
2. The planner prioritizes cultural domains for the business context.
3. Known interests are resolved to Qloo entity IDs.
4. Qloo Insights is queried across the selected domains.
5. Explainability is requested with every recommendation call.
6. Results are normalized into a common evidence shape.
7. The strategy layer identifies the highest-signal cultural material.
8. The UI presents cultural DNA, campaign direction, partnerships, content, experiences and an agent trace.

## Core principle

Qloo determines affinity. TASTE//OS turns affinity into strategy.

## Agent behavior

The workflow is intentionally bounded. The agent may choose which domains to explore and translate evidence into a strategy, but it may not invent a Qloo entity, fabricate affinity, or replace an unresolved seed with a guessed alternative.

## Current POC domains

- Music: urn:entity:artist
- Dining / local culture: urn:entity:place
- Brands / fashion: urn:entity:brand
- Film: urn:entity:movie
- Travel: urn:entity:destination

## Failure behavior

- Missing API key: status route reports unconfigured.
- Qloo 429: bounded exponential retry.
- Unresolved interest: preserved as unresolved and shown in the trace.
- Domain failure: that domain becomes empty and the remaining evidence is preserved.
- No resolved seeds: analysis stops rather than generating ungrounded strategy.
