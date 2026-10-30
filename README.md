# Taste

**The same hotel. Your version.**

Taste is a personalized hospitality experience engine powered by Qloo.

The hotel is already chosen. The guest gives Taste three things they love and the kind of stay they want. Taste resolves those references through Qloo, explores adjacent cultural affinities, then translates the results into concrete changes the property can make before arrival.

## Demo

Guest 01:
- Bad Bunny
- A24
- Soho House
- Nightlife

Guest 02:
- Sade
- Studio Ghibli
- Muji
- Rest

Both guests stay at Casa Forma in Guadalajara. The point of the demo is to show the same property adapting differently for each person.

## Product flow

Guest taste  
→ Qloo entity resolution  
→ Qloo taste tags  
→ cross-domain insights  
→ Taste experience synthesis  
→ guest stay  
→ hotel preparation card

## Guest-facing output

Taste creates:
- room direction
- arrival soundtrack direction
- welcome beverage or bite direction
- dinner recommendation
- after-dark recommendation
- next-day local discovery
- one unexpected cultural recommendation

## Staff-facing output

The hotel receives a practical preparation card across:
- ROOM
- F&B
- MEDIA
- LOCAL

The card also includes a confidence level and an inspectable Qloo evidence layer.

## Why Qloo is necessary

Without Qloo, three declared preferences become an LLM vibe guess.

With Qloo, Taste can resolve those references into structured cultural relationships across artists, places, brands, film, destinations and taste tags. Those relationships are what allow the hotel experience to change in a grounded way.

## Qloo integration

Hackathon API base:

`https://hackathon.api.qloo.com`

Taste uses:
- `/search` for entity resolution
- `/v2/insights` for cross-domain recommendations
- `signal.interests.entities` for combined guest taste
- `feature.explainability=true` for evidence
- `urn:tag` analysis for cultural profile tags

The Qloo API key remains server-side.

## Product integrity

- Missing evidence stays missing.
- Unresolved interests are not silently replaced.
- Qloo recommendations remain inspectable.
- The system does not claim causation from affinity.
- Hotel actions are explicitly framed as Taste's operational translation of Qloo-backed signals.

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
