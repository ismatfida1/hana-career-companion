# Hana Career Companion — Deployment Guide

## Overview

This guide documents how Hana handles runtime assets, optional services, and production configuration. The app is designed to gracefully degrade when optional services are unavailable.

---

## Storage & Assets (`/manus-storage/`)

### How It Works

Hana uses a `/manus-storage/` proxy to serve dynamic assets managed by Forge storage. When configured:

1. **Configuration Required:**
   - `BUILT_IN_FORGE_API_URL`: Your Forge storage service endpoint
   - `BUILT_IN_FORGE_API_KEY`: Authentication token for Forge API

2. **Request Flow:**
   ```
   Browser → /manus-storage/{key} 
   → Server proxy (storageProxy.ts) 
   → Forge API presign endpoint 
   → 307 redirect to signed download URL
   → Browser downloads asset
   ```

3. **Asset Paths Used:**
   - Mission step backgrounds: `hana-mission-*.png` (Concept, Example, Try, Feedback, Apply, Reflect)
   - Companion images: `hana-new-companion-concept_*.png`
   - World backgrounds: `hana-phase1-bright-world-*.png`, `hana-phase1-dark-world-*.png`
   - Roadmap/Projects/Chat vision illustrations: Hosted externally via CDN

### When Storage Is Not Configured

If `BUILT_IN_FORGE_API_URL` or `BUILT_IN_FORGE_API_KEY` are missing:

- **Server Response:** `/manus-storage/*` requests return HTTP 500 with message "Storage proxy not configured"
- **Client Behavior:** Images fail gracefully via:
  1. CSS `background-image` fallback (secondary gradient in `.game-entry-bright` etc.)
  2. `<img>` tags with `onerror` attribute (falls back to hardcoded Phase 1 asset)
  3. UI remains fully functional and readable

- **Visual Result:** Learners see:
  - Simplified mission backgrounds (CSS gradients only)
  - Static Phase 1 Hana companion image
  - World entry screens without Forge-managed illustrations
  - All interactive features remain available

**This is the expected local development behavior.**

### Production Deployment

For production, **either**:

1. **Configure Forge storage** (recommended):
   ```bash
   BUILT_IN_FORGE_API_URL=https://your-forge-instance.com
   BUILT_IN_FORGE_API_KEY=your-api-key
   ```
   Assets load dynamically from Forge and update without code changes.

2. **Pre-render with CDN** (alternative):
   Run `npm run build`, host assets on a CDN, update asset URLs in code to CDN paths.
   No Forge configuration needed; assets are static.

---

## Analytics (`VITE_ANALYTICS_ENDPOINT`)

### How It Works

Analytics are injected into the client via `client/index.html` as an external script:

```html
<script defer src="%VITE_ANALYTICS_ENDPOINT%/umami" 
        data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
```

### When Analytics Are Not Configured

If `VITE_ANALYTICS_ENDPOINT` is empty or missing:

- **Template Variable:** `%VITE_ANALYTICS_ENDPOINT%` is not substituted
- **Browser Behavior:** Script source becomes `/%VITE_ANALYTICS_ENDPOINT%/umami`
- **Console Warning:** `Failed to load resource: GET /%VITE_ANALYTICS_ENDPOINT%/umami 404`
- **User Impact:** No errors; analytics simply don't load. App works normally.

### Console Warnings

When analytics are not configured, you'll see:
```
[error] Failed to load resource: 404 (Not Found)
[error] Refused to execute script … because its MIME type ('text/html') is not executable
```

**This is expected and safe to ignore in development.** No user data is lost; the app continues normally.

### Production Configuration

For production analytics:

```bash
VITE_ANALYTICS_ENDPOINT=https://your-umami-instance.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

If using a different analytics platform:
1. Update `client/index.html` to match the new platform's script format
2. Set `VITE_ANALYTICS_ENDPOINT` to your endpoint
3. Rebuild with `npm run build`

---

## Optional Services Graceful Degradation

### Wolfram|Alpha (`WOLFRAM_APP_ID`)

- **When Configured:** Chat can answer computational and math questions
- **When Missing:** Chat responds with simplified explanations; computational features unavailable
- **User Experience:** Full chat functionality remains; less technical depth

### Forge AI (`BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`)

- **When Configured:** LLM-powered chat, portfolio generation, personalized help
- **When Missing:** Chat uses template responses; portfolio drafts are static templates
- **User Experience:** Learning path functions normally; AI features unavailable

### Database (`DATABASE_URL`)

- **When Configured:** Learner profiles, projects, portfolio drafts persist to database
- **When Missing:** App uses demo data; learner data is lost on page refresh
- **User Experience:** UI appears fully functional locally; no persistence

### OAuth Authentication (`OAUTH_SERVER_URL`, `VITE_APP_ID`)

- **When Configured:** User sign-in, session management, account linking
- **When Missing:** App loads but all protected routes return 401; demo data shown instead
- **User Experience:** Roadmap, projects, chat visible but show demo data

---

## Local Development Setup

For a working local development environment:

```bash
# Minimal setup (demo data only):
npm install
npm run dev
# App runs with all demo data; no persistence

# With database persistence:
DATABASE_URL="mysql://user:pass@localhost/hana" npm run dev
# Learner data persists; auth still shows demo

# Full feature setup:
VITE_APP_ID=your-app-id \
OAUTH_SERVER_URL=http://localhost:3001/oauth \
DATABASE_URL="mysql://..." \
JWT_SECRET=your-secret \
WOLFRAM_APP_ID=your-wolfram-id \
npm run dev
# All features available
```

---

## Desktop & Mobile Layout Verification

### Desktop Layout

The app is optimized for **1920px+ desktop viewports**. Verify:

- Roadmap: Full-width illustrated map with right-side preview panel
- Projects: Two-column layout with featured project and checkpoint controls on right
- Opportunities: Full-width card grid with save/details actions
- Chat: Two-column layout with chat panel and memory sidebar

### Mobile Layout

The app is optimized for **320px–768px mobile viewports**. Verify:

- All views stack vertically (single column)
- Bottom navigation bar shows all main sections
- Full-screen illustrations display without overlap
- Touch targets are ≥44px (accessible tap size)
- Keyboard navigation works with Tab key
- Reduced motion respected: set `prefers-reduced-motion: reduce` in OS settings

### Responsive Breakpoints

- `md:` (768px+): Two-column layouts, expanded spacing
- `lg:` (1024px+): Sidebar layouts, premium spacing
- `xl:` (1280px+): Maximum layout optimization

---

## Keyboard Navigation & Accessibility

All views support:

- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons and clickable sections
- **Escape:** Close modals and dialogs (on supported elements)
- **Arrow Keys:** Navigate roadmap hotspots and menus

Test keyboard navigation by:
1. Disabling mouse/trackpad
2. Using only Tab and Enter to interact
3. All main paths should be completable

---

## Reduced Motion Support

For users who enable `prefers-reduced-motion: reduce`:

1. Animations are disabled:
   - No scroll-smooth behavior
   - No hover animations
   - No fade transitions
   
2. This setting is detected by media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     /* animations disabled */
   }
   ```

Test by:
- macOS: System Preferences → Accessibility → Display → Reduce motion
- Windows: Settings → Ease of Access → Display → Show animations
- Verify app remains fully functional with smooth animations disabled

---

## Loading, Empty, and Error States

### Loading States

Currently implemented:
- Query loading states shown as skeleton or greyed content
- Mission step loading shows placeholder layout
- No loading spinners (intentional design choice)

### Empty States

- **No Projects:** "No projects started yet" message with call-to-action
- **No Opportunities:** Shows why Hana hasn't surfaced matches yet
- **Empty Chat:** Shows welcome message and example prompts
- **Empty Profile:** Shows onboarding helper and profile setup action

### Error States

- **Auth Error (401):** Shows demo data fallback; user can still explore
- **Database Error:** Chat and queries gracefully degrade; app remains usable
- **Forge/Storage Error:** Assets fail gracefully; UI remains visible

---

## Environment Configuration Checklist

### Minimal (Demo-only local dev)
- [ ] `NODE_ENV=development`
- [ ] No other env vars needed

### Local Full-Featured
- [ ] Database: `DATABASE_URL`
- [ ] Auth: `VITE_APP_ID`, `OAUTH_SERVER_URL`, `JWT_SECRET`
- [ ] AI: `WOLFRAM_APP_ID` (optional)

### Staging/Preview Deployment
- [ ] All local env vars
- [ ] Storage: `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`
- [ ] Analytics: `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`

### Production Deployment
- [ ] All staging env vars
- [ ] `NODE_ENV=production`
- [ ] `OWNER_OPEN_ID` for admin operations
- [ ] Verified all secrets are secure (use .env.local, not .env)
- [ ] Database backed up and replicated
- [ ] CDN configured for asset delivery (if not using Forge storage)

---

## Troubleshooting

### Images Not Loading

**Problem:** See broken image icons in browser
- Check if `BUILT_IN_FORGE_API_URL` is configured
- If not configured, this is expected (CSS fallback shows gradient)
- If configured, verify API key and network connectivity
- Check browser console for 401/403/500 errors

### Analytics Script 404

**Problem:** Console shows "Failed to load resource: %VITE_ANALYTICS_ENDPOINT%/umami 404"
- This is expected when `VITE_ANALYTICS_ENDPOINT` is not set
- Ignore safely in development
- Configure `VITE_ANALYTICS_ENDPOINT` for production

### Protected Routes Show 401

**Problem:** All pages show "Unauthorized" or demo data
- OAuth is not configured
- This is expected in local development
- Ensure `OAUTH_SERVER_URL` and `VITE_APP_ID` are set for auth

### Database Queries Return Empty

**Problem:** Projects/profile appear empty despite having data
- `DATABASE_URL` may not be configured
- App uses demo data fallback when database unavailable
- Verify MySQL connection string and database is running
- Check server console for connection errors

---

## Deployment Platforms

### Vercel / Edge Functions
- Environment variables must be set in deployment dashboard
- Storage proxy works with serverless setup
- Cold starts may affect first Forge storage request

### Docker / Container
- Mount `.env` file or inject via environment
- Ensure `DATABASE_URL` points to MySQL container or managed service
- Storage proxy requires network access to Forge API

### Traditional VPS / Node.js
- Install Node 18+ and MySQL
- Use `.env` file with all secrets
- Run `npm install && npm run build && npm start`
- Systemd service can auto-restart on failure

---

## Support & Next Steps

For issues related to:
- **Asset delivery:** Contact Forge/storage provider
- **Database:** Check MySQL configuration and connectivity
- **Authentication:** Verify OAuth server URL and app registration
- **Analytics:** Check analytics platform dashboard
- **Production deployment:** Refer to your platform's documentation

---

**Last Updated:** 2026-08-29  
**Status:** Production Ready  
**Tested Configurations:** Local dev (demo), local dev (full), Docker staging
