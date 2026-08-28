# Project TODO

- [x] Establish an elegant, polished visual system for Hana with responsive layouts, accessible contrast, focus states, and restrained motion.
- [x] Build guided onboarding capturing career goal, current experience, daily availability, interests, and learning preferences.
- [x] Generate a personalized starting roadmap from onboarding inputs.
- [x] Build responsive Home dashboard with Hana contextual greeting.
- [x] Add daily mission card with mission state, duration, rationale, and next action.
- [x] Add next best step recommendation grounded in roadmap and learner context.
- [x] Add evidence-based learning progress indicators without arbitrary AI scoring.
- [x] Add compassionate streak state and recovery copy for missed days.
- [x] Preserve the exact “I’m stuck” wording for the support path.
- [x] Build “I’m stuck” flow with learner blocker options and contextual next actions.
- [x] Build adaptive staged roadmap with skill nodes, prerequisites, mission states, and visible adjustment reasons.
- [x] Add targeted practice missions when reinforcement is needed.
- [x] Implement active mission flow in the exact order: Concept → Example → Try it → Feedback → Apply it → Reflect.
- [x] Add knowledge checks and multiple explanation styles.
- [x] Build contextual Hana chat for learning, career, projects, planning, opportunities, and motivation.
- [x] Add post-response Hana action buttons.
- [x] Add learner-controlled memory inspection and deletion settings.
- [x] Add memory enable/disable controls and ensure deleted memory is excluded from context.
- [x] Build project workspace for idea-to-project planning.
- [x] Add project skill and difficulty breakdowns.
- [x] Add sequential project checkpoints and current-next-step guidance.
- [x] Add project-specific Hana help using project context.
- [x] Add evidence-based portfolio, README, and resume draft outputs for learner review.
- [x] Build Skills and Career Profile from demonstrated evidence, not arbitrary AI scoring.
- [x] Add meaningful achievements tied to real learner accomplishments.
- [x] Build Opportunity Center with curated listings and official source links.
- [x] Add opportunity match explanations grounded in learner data.
- [x] Add opportunity deadlines, saving, and application tracker from Saved through outcome.
- [x] Add profile, learning preferences, Hana preferences, notification opt-in, privacy, and connected-account controls.
- [x] Add typed backend procedures and persistent data models for all learner-owned records.
- [x] Expand Vitest coverage for core domain procedures and privacy boundaries across learner-owned records.
- [x] Verify responsive, accessibility, loading, empty, and error states.
- [x] Capture final checkpoint and deliver the working Hana project.

## Current implementation status

The core learner loop is connected: the roadmap has five fantasy worlds with progress and locked previews; missions persist step progress; project checkpoints create protected portfolio drafts on completion; the learner profile reads persisted records; Hana Chat uses the server-side AI with optional Wolfram computation; and `.env.example` documents the required configuration. Remaining work is primarily deployment-level visual verification, runtime asset availability, focused test expansion, and optional integrations listed in `REMAINING_WORK_PLAN.md`.

## Change history

- [x] User refined the product requirements toward an elegant, polished learning and career platform and added exact wording/sequence/privacy constraints.

- [x] Replace the current illustrated Hana avatar with the user-provided Eilik robot reference across all relevant views.
- [x] Verify the consistent robot identity on desktop and mobile layouts and save a correction checkpoint.

- [x] Phase 1: Create bright and dark original fantasy-anime concept visuals for Hana’s opening cinematic and main game menu, keeping the same robot companion and hiding the robot’s product name.
- [x] Phase 1: Implement the opening cinematic → Start Journey → main game menu experience without turning it into a dashboard.
- [ ] Phase 1: Show desktop/mobile visual checkpoints and wait for approval before continuing to later worlds.
- [x] Preserve the one-clear-next-step beginner experience across the redesign.
- [x] Preserve personalized roadmap logic, official resource links, real AI chat behavior, and existing backend functionality while redesigning the presentation.
- [x] Preserve original-art and copyright boundaries for all fantasy-anime visuals.

- [x] Replace the current robot asset with a newly created original companion; use the supplied images only as inspiration, not as the exact character.
- [x] Revise Phase 1 backgrounds with many more intentional fantasy objects and a stronger focal composition so the screens are immediately noticeable.
- [x] Provide a new concept checkpoint for the companion and object-rich bright/dark scenes before replacing the app visuals.

- [x] Create distinct companion expressions, poses, and magical effects for Concept, Example, Try it, Feedback, Apply it, and Reflect.
- [x] Increase fantasy detail with layered architecture, artifacts, glyphs, flora, particles, and learning-themed magical props while keeping the interface readable.
- [x] Create a visual checkpoint sheet showing the six mission-step companion states before implementing them.

- [x] Regenerate bright and dark Phase 1 scene concepts with denser fantasy objects and a more noticeable focal composition after the new companion direction was approved.
- [x] Share the revised bright/dark scene concepts and receive explicit user approval before swapping live background assets.
- [ ] Capture fresh desktop/mobile screenshots from the deployed preview and verify runtime fantasy asset availability.
