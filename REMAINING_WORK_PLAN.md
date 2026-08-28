# Hana Career Companion — Remaining Work Plan

Audited against the latest `main` branch after the user’s recent updates. The existing foundation is broad and functional: onboarding, learner-aware roadmap, six-step Hana missions, projects, opportunities, chat, privacy controls, portfolio drafts, Wolfram|Alpha tool support, responsive navigation, and protected learner procedures are present.

## Priority 0 — Finish the learner loop

1. Make the learner profile fully data-backed. Replace remaining static project, opportunity, skill, and achievement counts with persisted queries and clear empty states.
2. Connect project checkpoint completion to portfolio evidence creation or update, with a visible success state and no fabricated evidence.
3. Keep roadmap, mission, project, and portfolio contexts synchronized after mutations through typed query invalidation or refetching.

## Priority 1 — Make the fantasy roadmap feel complete

1. Keep the five approved worlds visible on the simple vertical glowing path: Origin Village, Code Forge, Weblands, Cloudspire, and Summit of Builders.
2. Keep locked worlds useful through previews containing teaching goals, a three-step learning path, a final project, and an unlock requirement.
3. Preserve the three-second clarity rule: one current action, concise copy, and detail only after selection.
4. Replace stale TODO wording about unapproved visual assets with an accurate record of the approved composite and current runtime asset dependencies.

## Priority 2 — Production readiness

1. Add `.env.example` entries for all required server and client configuration, including `WOLFRAM_APP_ID` as a server-only variable.
2. Resolve or document runtime-loaded `/manus-storage/` assets and analytics placeholder warnings for the target deployment.
3. Add focused tests for roadmap state derivation, project-to-portfolio transitions, query invalidation, locked preview behavior, and protected mutations.
4. Verify desktop/mobile layout, keyboard navigation, reduced-motion behavior, loading, empty, and error states in the deployed preview.

## Priority 3 — Optional integrations

GitHub repository evidence, email notifications, calendar integration, and live opportunity ingestion should remain optional until the core learner loop is stable. They require explicit privacy and account-linking decisions and should not block the main roadmap experience.

## Recommended next implementation

Start with the learner profile and portfolio evidence loop because it turns the existing roadmap and project actions into durable career proof without requiring a new external API. Then update stale documentation and complete focused regression coverage before expanding the visual worlds.
