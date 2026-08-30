# Hana Release Hardening Checklist

## Product contract
- Preserve the existing fantasy worlds, Hana robot artwork, and game-console visual identity. Do not redesign the art.
- Every route must use the same visual frame and responsive layout system.
- No important artwork may be cropped; use contained media with explicit aspect-ratio and safe responsive bounds.
- Every interactive control must have a working destination or action and a visible game-style Back/Home path.

## Roadmap quests
Every learning step must expose only a concise, curated set of resources with a primary and fallback where possible:
- official university curriculum/course source
- best relevant YouTube resource
- legitimately free/open book or reading
- official documentation
- free online course/practice
- alternative link
Each resource must be clearly labeled as free/open. Do not represent trials, previews, or paid resources as free.
Each step also exposes Small Quest, Grand Quest, and Build With Hana.

## University matching
- Curriculum matching is optional.
- Prefer the university's official curriculum/course page.
- Never automatically alter the learner roadmap.
- If the official curriculum cannot be reliably accessed or parsed, ask the learner to paste the curriculum or upload it.
- Show overlap/gaps and ask for explicit confirmation before applying adjustments.

## Hana
- Use server-side APIs only; never expose provider secrets in client code.
- Preserve conversational history and useful learning context locally for the demo.
- Pass selected career, current step, and recent context to Hana.
- Hana should behave as a tutor/companion: explain, hint, research, plan, and build with the learner rather than dumping answers.
- Current-information questions such as opportunities should use web research and show sources.
- Gracefully fall back if an AI provider is unavailable.

## Opportunities
- Search current opportunities when requested.
- Prefer official organizer pages.
- Default recommendations to legitimately free-entry opportunities.
- Never invent deadlines, eligibility, or availability.
- Show why an opportunity matches the learner and provide a working official link plus alternatives where appropriate.

## Security
- Keep API credentials server-side.
- Validate untrusted input.
- Audit dependencies.
- Detect accidentally committed secrets.
- Do not execute arbitrary user-provided code on the server.
- Use safe external-link handling.
- Protect `main` with GitHub branch rules/PR review outside the application code where repository administration permits.

## Release verification
- Typecheck passes.
- Tests pass.
- Production build passes.
- Security workflow passes.
- Verify desktop and mobile layouts.
- Verify Home -> Roadmap -> Step -> Learn -> Resource -> Back.
- Verify Step -> Small Quest -> Back.
- Verify Step -> Grand Quest -> Back.
- Verify Step -> Build With Hana -> Chat.
- Verify Hana responds through the configured API/fallback.
- Verify curriculum inaccessible -> manual paste/upload prompt.
- Verify Opportunities search -> official link -> Back.
- Verify no overlapping/cropped artwork at narrow widths.
- Keep rollback checkpoints untouched until final acceptance.
