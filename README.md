# TASTE//OS

TASTE//OS is a Qloo-powered cultural intelligence agent for brands, hospitality, restaurants, agencies, and experience-led businesses.

It converts a business brief into a Qloo-grounded cultural profile, cross-domain affinity map, campaign concept, partnership opportunities, creative direction, and experience ideas.

## Core principle

**Qloo determines affinity. TASTE//OS turns affinity into strategy.**

## Hackathon focus

The first demo is intentionally narrow: a boutique hotel in Guadalajara targeting design-conscious American travelers ages 28-40.

## Architecture

Business brief → agent plan → Qloo entity resolution → cross-domain insights → normalized evidence → cultural intersections → strategy synthesis → explainable recommendations.

## Safety and integrity

- Qloo API calls are server-side only.
- The API key is never exposed to the browser.
- Unresolved entities remain unresolved.
- The app never invents Qloo evidence.
- Qloo-backed recommendations retain source entity ids and explainability data.

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add your Qloo key to `.env.local`
4. Run `npm run dev`

## License

MIT
