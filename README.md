# Taste

**The overlap is the opportunity.**

Live demo: https://taste-os-psi.vercel.app

Taste helps brands, hotels, restaurants, agencies, and experience-led businesses understand what actually moves an audience across culture.

A user enters a business brief, target audience, location, objective, and a few known cultural signals. Taste resolves those signals to Qloo entities, explores related taste across multiple domains, identifies cross-category intersections, and translates the evidence into campaign direction, partnerships, content, and real-world experiences.

## Core principle

**Qloo maps the taste. Taste finds the overlap.**

Without Qloo, the product would be forced to guess cultural fit from a prompt. With Qloo, recommendations are grounded in structured taste relationships.

## What it does

1. Resolves human-readable cultural references to Qloo entities.
2. Plans which cultural domains matter most for the business brief.
3. Queries Qloo Insights across music, local places, brands, film, and travel.
4. Requests Qloo explainability and preserves the evidence trail.
5. Runs a Qloo taste-tag analysis for the combined seed profile.
6. Finds cross-domain cultural intersections.
7. Converts those intersections into business opportunities.
8. Shows the user why each signal surfaced and how it informed the strategy.

## Example

A boutique hotel in Guadalajara can enter:

- Target audience: design-conscious American travelers ages 28-40
- Objective: increase direct bookings and cultural relevance
- Known signals: A24, Bad Bunny, Soho House

Taste then maps adjacent music, local places, brands, film, and travel signals, identifies useful intersections, and creates a strategic direction grounded in Qloo data.

## Agent workflow

Business brief  
→ domain planning  
→ Qloo entity resolution  
→ Qloo taste analysis  
→ cross-domain Insights  
→ explainability parsing  
→ cultural intersections  
→ strategy synthesis

The agent is intentionally bounded. It may choose which domains to explore and translate evidence into strategy, but it does not fabricate Qloo entities, affinities, or unresolved evidence.

## Qloo integration

Hackathon API base:

`https://hackathon.api.qloo.com`

Taste uses:

- `/search` for entity resolution
- `/v2/insights` for cross-domain recommendations
- `signal.interests.entities` to ground requests in resolved Qloo entities
- `feature.explainability=true` to retain supporting evidence
- `urn:tag` taste analysis for Cultural DNA

The Qloo API key is used server-side only and is never sent to the browser.

## Product integrity

- Missing evidence stays missing.
- Unresolved cultural seeds are not silently replaced.
- Domain failures do not become fake recommendations.
- Co-signals are described as intersections, not causation.
- Qloo evidence remains inspectable through the product UI and agent trace.

## Demo presets

The live app includes three demo briefs:

- Casa Forma: boutique hospitality
- NOIR//FORM: independent fashion
- LUNA SOCIAL: restaurant and nightlife

These help demonstrate that the agent changes its cultural exploration and strategy based on business context.

## Tech stack

- Next.js
- React
- TypeScript
- Zod
- Qloo API
- Vercel
- GitHub

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add `QLOO_API_KEY`
4. Run `npm run dev`

## Project documentation

- `docs/architecture.md`
- `docs/qloo-integration.md`
- `docs/judging-strategy.md`

## License

MIT
