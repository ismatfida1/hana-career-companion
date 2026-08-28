# Hana Career Companion — API and Integration Requirements

## Current implementation checkpoint

The supplied project is a Vite/React/TypeScript application with an Express/tRPC backend, Drizzle persistence, Manus OAuth scaffolding, and learner-owned database tables. Type checking, tests, and production build all pass after the latest change.

The Opportunities screen now reads from the existing typed `opportunities.list` procedure, falls back to demo records when the database is empty, calculates remaining days from stored deadlines, and exposes each stored `officialUrl` as an “Official source” link.

## APIs required to run the core product

| Integration | Required? | What Hana uses it for | Configuration currently expected |
| --- | --- | --- | --- |
| **Manus OAuth** | Yes for accounts | Sign-in, session identity, and learner-owned data access | `VITE_APP_ID`, `OAUTH_SERVER_URL`, `JWT_SECRET`; the OAuth callback is already scaffolded |
| **MySQL/TiDB-compatible database** | Yes for persistence | Profiles, missions, projects, memories, opportunities, saved applications, roadmap states, chats, achievements, settings, and portfolio drafts | `DATABASE_URL`; run the included Drizzle migrations |
| **Built-in Forge / LLM service** | Yes for real Hana behavior | Contextual chat, explanation-style switching, roadmap adaptation, project guidance, opportunity matching, and evidence-based draft generation | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`; calls must remain server-side through `server/_core/llm.ts` |
| **Object storage** | Recommended; required for user uploads | Audio uploads, portfolio attachments, and future learner evidence files | Use the scaffolded S3/storage proxy configuration; the current project already contains storage helpers but does not yet expose the full upload workflow |

## APIs needed for planned features

| Integration | Priority | Why it is needed | Notes |
| --- | --- | --- | --- |
| **Opportunity source API or curated ingestion job** | High | The current records are database-backed, but a trustworthy, current Opportunity Center needs an ingestion source, official URL verification, deadline refresh, and deduplication | We need to choose either a small curated admin workflow or specific public sources. I would not scrape arbitrary sites without confirming their terms and update mechanism |
| **Speech-to-text endpoint** | Medium | Voice input for Ask Hana and mission reflections | The helper expects an OpenAI-compatible `v1/audio/transcriptions` endpoint behind the built-in service; audio first needs to be uploaded to storage |
| **Image generation service** | Low / design-only | Regenerating or revising the Phase 1 bright/dark world scenes and companion states | The project already has a server-side image helper. No third-party image API is needed if the built-in image service is used |
| **Notification delivery** | Medium | Optional reminders, deadline alerts, and “gentle nudge” notifications | The project contains a server notification helper. We need the desired delivery channel and opt-in behavior before exposing it to learners |
| **GitHub API** | Optional | Verify repositories, read project evidence, and connect demonstrated skills to portfolio records | Needs OAuth scope and a clear privacy boundary; not required for the first usable release |
| **Calendar API** | Optional | Turn deadlines or study plans into calendar events | Not needed for the core learning loop |

## What I need from you before wiring the remaining APIs

1. **AI provider decision.** Confirm that Hana should use the built-in server-side LLM service, or provide a different provider and model requirement. The current product needs a real `ai.chat` procedure; the visible chat UI is still demo behavior and should be replaced with a protected server mutation that applies memory controls and learner context.

2. **Database/deployment configuration.** Provide or connect the production MySQL/TiDB database and confirm that learner data should be persisted across devices. Without `DATABASE_URL`, the app can render its fallback UI but cannot save learner records.

3. **Opportunity data strategy.** Choose between a manually curated opportunity catalog and one or more approved opportunity APIs. If API-driven, provide the source names, API keys if required, geographic scope, categories, and refresh frequency. The app should store official URLs and verification timestamps rather than presenting unverified listings.

4. **Voice scope.** Confirm whether voice input is part of the first release. If yes, I will add the protected upload/transcription procedure and the browser `MediaRecorder` flow. If no, the existing helper can remain dormant.

5. **Notifications scope.** Confirm whether Hana should send email, in-app, or platform notifications. This determines whether we need an external email provider, a browser notification permission flow, or only the existing platform notification path.

6. **Phase 1 visual approval.** The code references the revised bright and dark world assets under `/manus-storage/`, but the TODO still marks the final asset swap and desktop/mobile checkpoint as incomplete. I need approval of the final scene direction before replacing those live backgrounds.

## Recommended first API pass

The smallest useful production pass is **Manus OAuth + MySQL/TiDB + built-in LLM + storage**. I would then implement the protected chat procedure, persist conversations and memory decisions, connect the existing profile/roadmap/project queries to the screens, and keep opportunities curated in the database until a reliable source API is selected. Voice, notifications, GitHub, and calendar integrations can remain opt-in extensions.

## Existing environment variables

```text
VITE_APP_ID
JWT_SECRET
DATABASE_URL
OAUTH_SERVER_URL
OWNER_OPEN_ID
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
```

`OWNER_OPEN_ID` is used for owner/admin behavior in the scaffold. It is not a separate third-party API credential.

## Immediate implementation gaps unrelated to credentials

The backend currently exposes read procedures for most learner records and a profile-save mutation, but it does not yet expose the complete write surface implied by the UI. The next implementation pass should add protected mutations for chat messages/conversations, mission progress, project checkpoints, saved-opportunity status, settings, and portfolio drafts. This is application work rather than a new external API requirement.

The current chat screen is also locally scripted rather than connected to an AI procedure. That is the main blocker between the polished prototype and a real Hana companion.

## Decision summary

If you provide only the core configuration, I can continue without additional third-party API keys by using the built-in AI, the scaffolded OAuth, and the managed database/storage integrations. The only external product decision that materially changes architecture is the **opportunity-source strategy**; GitHub, calendar, voice, and outbound notifications are optional.

**Author:** Manus AI

