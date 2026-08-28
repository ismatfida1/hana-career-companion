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
| **Wolfram|Alpha Short Answers API** | Optional computational tool | Calculations, mathematics, unit conversions, statistics, and computational knowledge when Hana’s LLM decides a verified computation is useful | `WOLFRAM_APP_ID`; stored only in the server environment and used by `server/_core/wolfram.ts` |
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

1. **AI provider decision.** The current implementation uses the built-in server-side LLM service through a protected `ai.chat` procedure. OpenAI/Gemini-compatible provider changes are optional and should not replace the existing Hana conversation flow without a deliberate product decision.

2. **Database/deployment configuration.** Provide or connect the production MySQL/TiDB database and confirm that learner data should be persisted across devices. Without `DATABASE_URL`, the app can render its fallback UI but cannot save learner records.

3. **Opportunity data strategy.** Choose between a manually curated opportunity catalog and one or more approved opportunity APIs. If API-driven, provide the source names, API keys if required, geographic scope, categories, and refresh frequency. The app should store official URLs and verification timestamps rather than presenting unverified listings.

4. **Voice scope.** Confirm whether voice input is part of the first release. If yes, I will add the protected upload/transcription procedure and the browser `MediaRecorder` flow. If no, the existing helper can remain dormant.

5. **Notifications scope.** Confirm whether Hana should send email, in-app, or platform notifications. This determines whether we need an external email provider, a browser notification permission flow, or only the existing platform notification path.

6. **Phase 1 visual verification.** The approved robot/background direction is integrated into the opening flow, and the roadmap uses the approved fantasy presentation. Remaining verification is a deployment-level desktop/mobile review of runtime `/manus-storage/` assets.

## Recommended first API pass

The smallest useful production pass is **Manus OAuth + MySQL/TiDB + built-in LLM + storage**. These core flows are now implemented: protected Hana chat with learner context and memory controls, persisted profile/roadmap/project/opportunity/portfolio records, the fantasy roadmap, and optional Wolfram computation. Voice, notifications, GitHub, calendar, and live opportunity ingestion remain opt-in extensions.

## Existing environment variables

```text
VITE_APP_ID
JWT_SECRET
DATABASE_URL
OAUTH_SERVER_URL
OWNER_OPEN_ID
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
WOLFRAM_APP_ID
```

`OWNER_OPEN_ID` is used for owner/admin behavior in the scaffold. It is not a separate third-party API credential.

## Wolfram|Alpha setup and testing

Create an AppID at the [Wolfram|Alpha Developer Portal](https://developer.wolframalpha.com/). In Manus, open the Hana WebDev project’s **Environment Variables / Secrets** settings, add a server environment variable named exactly `WOLFRAM_APP_ID`, paste the AppID as its value, save the project configuration, and restart or redeploy the project so the server receives the new value. Do not add it to `client/.env`, a `VITE_*` variable, React code, browser storage, or a public connector. For local development, place `WOLFRAM_APP_ID=your_app_id` in the server environment used to start `pnpm dev`; never commit that file.

The protected `ai.compute` procedure can verify the backend directly after configuration, while Ask Hana uses the same service automatically only when the conversational model selects the `wolfram_alpha` tool. Test with `What is 25% of 80000?`, `Convert 5 kilometers to miles.`, and `Solve x^2 + 5x + 6 = 0.`. Missing configuration, invalid queries, empty results, rate limits, timeouts, and upstream failures are normalized into safe responses and logged without the AppID.

## Immediate implementation gaps unrelated to credentials

The core write surface is now present: protected mutations cover mission progress, project checkpoints, saved-opportunity status, settings, portfolio drafts, and Hana chat persistence. The current remaining gaps are production-level visual verification, runtime asset availability, a deliberate opportunity ingestion strategy, and optional voice/notification/account integrations. These are application or deployment decisions rather than blockers for the core learner journey.



## Decision summary

If you provide only the core configuration, I can continue without additional third-party API keys by using the built-in AI, the scaffolded OAuth, and the managed database/storage integrations. The only external product decision that materially changes architecture is the **opportunity-source strategy**; GitHub, calendar, voice, and outbound notifications are optional.

**Author:** Manus AI

