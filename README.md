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


## If Taste wins: next steps

Winning the Qloo Agentic Hackathon would give Taste the opportunity to move from a strong working prototype into a more complete hospitality product.

The first priority would not be adding more features. It would be improving the quality, clarity, and polish of the experience that already exists.

### 1. Improve the UI and product experience

The current interface proves the core concept, but the next version should feel like a finished hospitality product rather than a hackathon build.

The next UI pass would focus on:

- stronger visual hierarchy across the full guest journey
- a more refined responsive layout for mobile and tablet
- more deliberate hotel photography and image selection
- better loading, empty, and error states
- clearer interaction states for building and regenerating a stay
- a more polished Hotel Prep experience for staff
- improved accessibility and keyboard navigation
- a reusable component and design-token system
- stronger differentiation between guest-facing recommendations and technical evidence

The goal is to make Taste feel native to the hospitality industry: calm, premium, useful, and easy to understand in seconds.

### 2. Improve semantic filtering of Qloo data

Qloo returns rich taxonomy and affinity data, but not every raw tag should become guest-facing copy.

A production version of Taste would add a semantic presentation layer that separates:

- evidence used internally for reasoning
- operational recommendations shown to hotel staff
- language appropriate to show directly to the guest

Sensitive identity-related tags, ownership descriptors, overly specific taxonomy labels, and other metadata would remain in the evidence layer when relevant rather than being surfaced as assumptions about the guest.

Taste should use Qloo to understand cultural relationships without turning taxonomy into identity claims.

### 3. Improve local recommendation quality

The next version would strengthen the location layer by adding:

- neighborhood-level location resolution
- distance and travel-time ranking from the hotel
- category validation for restaurants, bars, galleries, shops, and attractions
- opening-hours awareness
- better separation between dining and non-dining local inventory
- stronger fallback logic when a narrow Qloo filter produces few results

The goal is for the same taste profile to produce genuinely different local experiences in Brooklyn, Guadalajara, London, Tokyo, or any other market.

### 4. Add hotel capability awareness

Hotels differ dramatically in what they can actually personalize.

A future version would let properties define capabilities such as:

- lighting controls
- welcome amenities
- room service
- concierge
- restaurant reservations
- transportation
- in-room audio
- streaming
- spa and wellness

Taste would then recommend only actions the property can realistically execute.

### 5. Add guest constraints and feedback

The next stage would include optional guest context such as:

- dietary requirements
- allergies
- accessibility needs
- budget
- arrival and checkout time
- things the guest wants to avoid

Taste could also learn from simple feedback such as:

- Loved this
- Not for me

That would allow the stay to improve during the trip rather than remaining a one-time recommendation.

### 6. Integrate with hotel systems

The longer-term product opportunity is to connect Taste to existing hospitality infrastructure.

Potential integrations include:

- property-management systems
- CRM and guest-profile platforms
- concierge tools
- reservation systems
- restaurant and F&B systems
- messaging platforms
- music and entertainment services

Instead of generating a preparation card manually, Taste could eventually trigger approved actions automatically before arrival.

### 7. Build a measurable hospitality feedback loop

A production version should be able to answer whether personalization actually improves the stay.

Future measurement could include:

- guest engagement with recommendations
- acceptance or rejection of suggested experiences
- restaurant or activity bookings
- repeat-stay preference retention
- guest satisfaction
- staff adoption
- operational effort required per personalized stay

The long-term goal is to understand which culturally informed interventions create measurable value for both the guest and the property.

## Product principle going forward

Taste should never turn raw cultural data directly into assumptions about a person.

The product should maintain a clear separation:

Qloo evidence  
→ Taste interpretation  
→ hotel action

The cultural graph informs the experience.

It does not define the guest.
