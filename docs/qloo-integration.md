# Qloo Integration

TASTE//OS uses Qloo as the cultural intelligence layer, not as a decorative API call.

## Environment

Hackathon base URL:

`https://hackathon.api.qloo.com`

Authentication:

`X-Api-Key: <server-side secret>`

The API key is read only on the server and is never exposed to the browser.

## Entity resolution

`GET /search`

Key parameters:

- `query`
- `types` when a category is known
- `take`

TASTE//OS uses entity resolution to convert human-readable interests into Qloo entity IDs.

## Recommendation intelligence

`GET /v2/insights`

Key parameters:

- `filter.type`
- `signal.interests.entities`
- `filter.exclude.entities`
- `filter.location.query` for place and destination exploration
- `feature.explainability=true`
- `take`

The same seed profile is explored across multiple Qloo entity categories. That is what allows the product to find cross-category cultural relationships rather than returning a single recommendation list.

## Why the product depends on Qloo

Without Qloo, TASTE//OS would have to guess what an audience likes from a language model prompt. With Qloo, the strategy is grounded in structured cultural affinity data and real entity relationships.

The language and strategy layer can interpret the evidence, but it does not create the affinity itself.
