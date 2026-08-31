# Hana Implementation Checkpoint

## Status

The learner-product TODO is implemented in the current `main` codebase. This checkpoint records the implementation boundary so future changes do not regress the learner loop or privacy guarantees.

## Implemented learner loop

- Guided onboarding persists career goal, career path, experience, daily availability, interests, learning style, and memory preference.
- Learner-aware roadmap and staged mission progression are persisted.
- Active missions use the fixed order: Concept -> Example -> Try it -> Feedback -> Apply it -> Reflect.
- Home exposes contextual Hana guidance, daily mission state, next-step guidance, progress evidence, recovery language, and the exact `I'm stuck` support path.
- Roadmap includes locked previews, prerequisites, mission states, adaptation reasons, and reinforcement/practice concepts.
- Hana Chat receives learner profile, active project/mission context, and only non-deleted saved memory when memory is enabled.
- Memory is learner-controlled; deleted memory is excluded from Hana context.
- Projects persist checkpoints, skills, difficulty, status, and progress. Confirmed project completion can create portfolio evidence and an achievement without fabricating learner evidence.
- Portfolio/README/resume drafts are persisted as learner-owned drafts for review.
- Opportunities expose official source URLs and persisted Saved -> Planning -> Applied -> Accepted/Rejected states.
- Settings persist Hana preferences, explanation style, notification/voice controls, and memory enablement.
- Learner-owned procedures are protected by authenticated, user-scoped tRPC procedures.
- Vitest coverage includes authentication boundaries, invalid write payloads, scoped learner collections, and empty authenticated states.

## Visual implementation

Phase 1 uses the cinematic fantasy opening/menu system with bright and dark modes, responsive mobile layout, Hana companion states, restrained motion, focus-visible states, and reduced-motion handling. Runtime asset availability remains deployment-dependent because the scene/companion files are served from `/manus-storage/`.

## Verification commands

Run before release:

```text
pnpm check
pnpm test
pnpm build
```

For Cloudflare static output:

```text
pnpm build:cloudflare
```

The final remaining verification is deployment-level browser checking of the real preview, especially `/manus-storage/` assets at desktop and 390x844 mobile sizes. No deployment result is claimed by this repository checkpoint itself.
