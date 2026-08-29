# Hana Career Path & Skill Discovery Architecture

## Goal

Let a learner choose a clear technical direction without forcing them through a giant catalog. Hana should show one focused roadmap while keeping deeper career and skill alternatives discoverable on demand.

## Learner experience

1. Choose a direction: the first screen highlights Computer Science, AI/ML, and Cybersecurity because they are broad entry points.
2. Explore more: a search field and "Explore all paths" reveal additional major technical directions only when requested.
3. Make it my path: the selected path is saved to the learner profile and becomes the context Hana uses for recommendations.
4. Follow five stages: each path has exactly five high-level stages so the learner always sees the next meaningful destination rather than dozens of simultaneous tasks.
5. Explore skills on demand: each stage stays compact; the skill library is separate and searchable.
6. Use alternatives: each catalogue skill has a recommended resource plus an alternative resource, so a learner is not locked to one course or provider.
7. Change direction: related paths are shown after the focused roadmap so a learner can switch without restarting the product.

## Supported career directions

- Computer Science
- Software Engineering
- AI & Machine Learning
- Data Science
- Cybersecurity
- Web & Full-Stack Development
- Mobile Development
- Cloud, DevOps & SRE
- Systems & Embedded
- Game Development
- UI/UX & Product Engineering
- QA, Testing & Reliability

This is a curated major-career catalog, not a claim to enumerate every possible job title in technology. New paths can be added to the same registry without changing the learner flow.

## Roadmap model

Every path follows the same interaction pattern:

- Stage 1: foundations needed for the direction
- Stage 2: core technical problem solving
- Stage 3: applied building
- Stage 4: engineering, systems, or production practice
- Stage 5: portfolio and professional specialization

The actual skills and outcomes change by career. The interaction pattern remains stable so Hana does not become overwhelming.

## Resource model

Every catalogue skill stores:

- a skill name
- a beginner-friendly summary
- at least two HTTPS learning resources
- a recommended resource and an alternative resource

The UI shows these resources only after the learner opens a skill. Existing `resourceLibrary.ts` remains the mission-level resource system; `careerCatalog.ts` is the career-discovery layer.

## Persistence

`learner_profiles.careerPath` stores the selected direction. The backend validates it against the supported path identifiers before persistence. Existing profile fields remain intact, so changing direction does not erase learner history.

Hana Chat receives the selected career path in learner context and is instructed to keep recommendations aligned with that direction unless the learner explicitly asks to explore another.

## Safety against overload

- Show 3 featured career choices first.
- Keep the complete path list hidden behind "Explore all paths".
- Show 5 roadmap stages, not dozens of nodes.
- Expand stage details only on selection.
- Keep the skill explorer separate from the roadmap.
- Show two resources per skill, not a wall of links.
- Provide related directions only after the learner has a chosen path.

## Extension rule

When adding a new career, add one `CareerPath` record with five stages and skills. Do not add a new top-level screen or navigation item unless the learner flow genuinely requires it.
