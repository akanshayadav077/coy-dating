# Coy Discover

A swipe-based **Discover** tab for Coy, built as a standalone app. Swipe right to like, left to pass. A match only happens when both people have liked each other, and one-sided likes are never revealed.

The **Home** tab is a blank placeholder, as the assignment asks.

On top of the required Discover feature, the app has a **demo** login, first-name onboarding and a Settings page (see [Demo login, onboarding and settings](#demo-login-onboarding-and-settings)). They use no external services.

## Features

- Demo login (phone, then OTP), first-name onboarding, and a Settings page with a gear icon in the header

- Swipe deck with drag gestures (touch and mouse) plus Like / Pass buttons and ← / → keyboard shortcuts
- LIKE / PASS stamps, tilt, fly-out and spring-back animations; the next card is visible behind the current one
- Swiped profiles never come back, even after a reload
- "It's a match!" celebration with both photos
- Matches page with a responsive grid and an empty state
- Loading, error and "all caught up" states; a failed swipe returns the card with an error message
- Responsive layouts: bottom tab bar (phone), top bar (tablet), sidebar with a details panel (desktop)
- Photo fallback: skeleton while loading, initials tile if an image fails
- Respects `prefers-reduced-motion`

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18, JavaScript (JSX), CSS3 (CSS Modules), React Router, Vite |
| Backend | Node.js, Express 5 |
| Data | JSON file (`backend/data/db.json`) |
| Tests | `node:test` (backend), Vitest + React Testing Library (frontend) |

Single logged-in user (`u_000`), no external auth.

## Getting started

Requires Node.js 20 or newer.

```bash
# Terminal 1: API on http://localhost:4000
cd backend
npm install
npm start

# Terminal 2: app on http://localhost:5173
cd frontend
npm install
npm run dev
```

Optional: copy `.env.example` to `.env` in either folder to change the API port, CORS origin or `VITE_API_BASE_URL`.

To restore the demo data: `cd backend && npm run reset-data`.

**Seed vs runtime data:** `backend/data/db.seed.json` is the committed starting data and is never written to. The first server start copies it to `backend/data/db.json` (git-ignored), which holds swipes, matches and account changes. Restarting the server keeps `db.json`; only `npm run reset-data` replaces it.

**Photos:** profile photos come from `randomuser.me`. Run `cd backend && npm run check-photos` to confirm every URL loads from your network.

To check that every profile photo loads (needs internet): `cd backend && npm run check-photos`.

**Seed vs runtime data:** `backend/data/db.seed.json` is the committed starting data and is never written to. The first server start copies it to `backend/data/db.json` (git-ignored), which holds your swipes and matches. Restarting the server keeps them; only `npm run reset-data` restores the seed.

**Logging in:** enter any valid-looking number (for India: 10 digits starting with 6 to 9), tick the terms box, press **Send code**, then enter the demo code **`123456`**. Then enter your first name.

**Demo tip:** 8 of the 30 profiles have already liked you (Aarav is the first card), so a match appears quickly.

## Tests

```bash
cd backend && npm test     # API, matching rules, account, persistence
cd frontend && npm test    # swipe logic, login flow, OTP input, validation, UI pieces
```

## Project structure

```
backend/
  data/db.seed.json        you (u_000) + 30 profiles, 8 seeded likes
  scripts/resetData.js     restore db.json from the seed
  src/
    app.js                 builds the Express app and wires the layers
    server.js              starts the HTTP listener
    config/                port, CORS origin, current user, limits
    routes/                URL to controller mapping
    controllers/           HTTP in, HTTP out; no business rules (feed, swipe, matches, me, account)
    services/              feed, swipe and match rules
    repositories/          collection access over the JSON store
      jsonStore.js         atomic, serialized reads and writes
    middleware/            validation, 404, central error handler
  tests/                   api.test.js, account.test.js, helpers.js
frontend/src/
  services/api.js          the only place that calls fetch
  services/demoAuth.js     demo OTP check and session flag (no UI)
  context/                 AccountContext: login state and account actions
  hooks/                   useSwipeGesture, useDiscoverDeck, useAsyncData
  pages/                   Home, Discover, Matches, Login, Onboarding, Settings
  components/shared/       Navbar, ProfileCard, ProfilePhoto, Button, states
  components/discover/     SwipeDeck, SwipeCard, SwipeActions, MatchModal
  components/matches/      MatchCard
  components/auth/         PhoneInput, CountryCodeSelector, OTPInput, OnboardingForm
  components/settings/     SettingsCard, SettingsRow, ToggleSwitch, InviteCard, modals
  utils/                   swipe decision, relative time, constants
  styles/                  design tokens and base styles
```

## API

Errors always look like `{ "error": { "code": "ALREADY_SWIPED", "message": "..." } }`.

### `GET /feed?limit=20`

Profiles the user has not swiped on yet (never includes the user). `limit` is optional, an integer from 1 to 50 (default 20).

```json
{ "profiles": [ { "id": "u_001", "name": "Aarav Sharma", "age": 23, "city": "Delhi",
  "college": "Delhi University", "bio": "...", "interests": ["Travel"], "photoUrl": "https://..." } ],
  "remaining": 20 }
```

### `POST /swipe`

```json
{ "targetId": "u_001", "action": "like" }
```

`action` is `like` or `pass`. Returns **201** with `{ "match": null }`, or when both users liked each other:

```json
{ "match": { "id": "m_...", "createdAt": "2026-11-17T10:00:00.000Z", "profile": { "id": "u_001", "name": "Aarav Sharma" } } }
```

| Status | Code | When |
|---|---|---|
| 400 | `INVALID_TARGET_ID`, `INVALID_ACTION`, `INVALID_TARGET` | bad body, or swiping on yourself |
| 404 | `PROFILE_NOT_FOUND` | unknown `targetId` |
| 409 | `ALREADY_SWIPED` | the profile was swiped before |

### `GET /matches`

```json
{ "matches": [ { "id": "m_...", "createdAt": "...", "profile": { "id": "u_001", "name": "Aarav Sharma" } } ], "total": 1 }
```

Newest first.

### `GET /me`

The current user, used for the match screen. Not part of the required API. Uses the onboarding first name when one is set.

### Account endpoints (demo extras)

| Method and path | Body | Result |
|---|---|---|
| `POST /account/login` | `{ "phone": "+91 9876543210" }` | the account. Same number returns the existing account; a different number starts a fresh one |
| `GET /account` | none | `{ phone, firstName, email, alertsEnabled, referralCode }` |
| `PATCH /account` | any of `firstName`, `email`, `alertsEnabled` | the updated account. `401 NOT_LOGGED_IN` before login, `400` for `INVALID_FIRST_NAME`, `INVALID_EMAIL`, `INVALID_ALERTS`, `INVALID_ACCOUNT_UPDATE` |
| `DELETE /account` | none | `204`. Clears the account, your swipes and your matches. Sample profiles and seeded likes stay |

None of these endpoints can reveal who liked the user.

## How matching works

1. Seeded users who already like you are stored in the separate `likes` collection (never returned by any endpoint) (other people toward you).
2. Every swipe you make is stored in `swipes`. `/feed` excludes anyone in `swipes`, so a profile cannot reappear.
3. A like creates a match only if a seeded like from that person exists. The swipe and the match are written in one serialized, atomic transaction, so duplicates and races cannot create two matches.
4. Privacy: the API has no endpoint that lists likes. A pass, a one-sided like, and a like on someone who never liked you all return the identical `{ "match": null }`.
5. `db.json` is written to a temp file and renamed, so it cannot be left half-written.

## Demo login, onboarding and settings

These screens exist to show the full product flow. They are **demo only**:

- **OTP:** the code is always `123456` (`frontend/src/services/demoAuth.js`). No SMS is sent and the UI says so. There is no Firebase or any other auth provider.
- **Session:** a flag in `localStorage` marks the browser as logged in. The backend does not enforce sessions, matching the assignment's "single logged-in user".
- **First name:** saved to the account and shown to matches (`/me`). It is never shown before a mutual like.
- **Phone:** shown masked in Settings (only the last 3 digits).
- **Email:** validated and stored, never verified, and no email is sent.
- **Alerts:** the toggle is saved, but no real notifications exist in the demo.
- **Invite link:** the referral code is random and generated at login. The link `/i/<code>` just opens the login screen with a note. Nothing is tracked or rewarded.
- **Delete account:** after a confirmation, clears the demo account, swipes and matches so the demo can be replayed.
- **Terms and Privacy Policy** are placeholders (no pages).
- Paid extra slots, adding crushes and the home-screen prompt from the real Coy app are intentionally not built.

## Design decisions

- **Layers:** routes, controllers, services, repositories, JSON store. Services know nothing about Express, and the store is the only code that touches the file.
- **Dependency injection:** `createApp({ dataFile })` builds everything, so tests run against a temp file on a random port.
- **Optimistic swipe:** the card animates out while the request is in flight, and returns with an error message if the request fails.
- **Auth stays out of the UI:** components call `useAccount()`; the OTP rule and session flag live in `services/demoAuth.js`.
- **One swipe rule:** stamps, thresholds (120px or a fast flick) and tilt come from one unit-tested `decideSwipe` function.

## Screenshots

Add captures to `docs/screenshots/` after running the app locally:

| Phone | Desktop |
|---|---|
| ![Discover on phone](docs/screenshots/discover-mobile.png) | ![Discover on desktop](docs/screenshots/discover-desktop.png) |
| ![Match screen](docs/screenshots/match.png) | ![Matches](docs/screenshots/matches.png) |
| ![Login](docs/screenshots/login.png) | ![Settings](docs/screenshots/settings.png) |

## Feature suggestions

Part A of the assignment is in [docs/FEATURE_SUGGESTIONS.md](docs/FEATURE_SUGGESTIONS.md).
