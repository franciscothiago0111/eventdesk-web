# eventdesk-web

Frontend for eventdesk — an organizer console for managing events, registrations, and live attendee check-in. Built with Next.js (App Router), TanStack Query, Zustand, React Hook Form + Zod, and Socket.io.

Pairs with [eventdesk-api](../eventdesk-api) (NestJS). See [docs/frontend-plan.md](../docs/frontend-plan.md) and [docs/build-plan.md](../docs/build-plan.md) for the full design and execution log.

## Live check-in dashboard

![Dashboard with live check-in count and trend chart](./docs/dashboard-screenshot.png)

The dashboard updates in real time as attendees are checked in — no manual refresh. The "Live check-ins" tile and the trend chart both react to `checkin.recorded` events pushed over a Socket.io room scoped to the active event; the registrations page's per-row status badge updates the same way. Screenshot above is from a live run against the real API + Postgres/Redis stack: an organizer account, one published event, five registrations, and five check-ins recorded while the dashboard was open.

## Features

- **Auth** — register/login against `eventdesk-api`, session held in a Zustand store (`persist` to `localStorage`; see `src/core/lib/token-storage.ts` for the MVP tradeoffs of that choice)
- **Events** — create, edit, publish, close, list, view detail (capacity + status)
- **Registrations** — list per event, CSV export, live check-in status badge
- **Dashboard** — total events, active event capacity, live check-in count + trend chart
- **Realtime** — Socket.io client joins a per-event room and merges incoming check-ins into the TanStack Query cache, deduped by check-in ID

## Getting started

### Prerequisites
- Node.js + Yarn
- [eventdesk-api](../eventdesk-api) running locally (see its README) — this app has no backend of its own

### 1. Environment

```bash
cp .env.example .env
```

`.env.example` documents `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`, both defaulting to `http://localhost:3001` to match the API's default port.

### 2. Install & run

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visits redirect to `/login`. There's no in-app registration UI yet — create an organizer via the API directly first: `POST http://localhost:3001/auth/register` with `{ name, email, password }` (documented in the API's Swagger UI at `/docs`), then log in through the web UI with those credentials.

## Deployment

Not yet deployed — `eventdesk-web` → Vercel, pointed at a deployed `eventdesk-api`, is tracked as a separate Phase 8 item in [docs/build-plan.md](../docs/build-plan.md). This section will link to the live instance once that lands.

## Testing

```bash
yarn test        # Vitest — schema, hook (MSW-mocked), and component tests
yarn test:e2e     # Playwright — full happy path against live dev servers (API + web)
yarn lint
yarn build
```

## Tech stack

Next.js (App Router) · TypeScript · TanStack Query · Zustand · React Hook Form + Zod · Axios · Socket.io client · Tailwind · Recharts · Vitest + Testing Library · Playwright

## Project structure

```
src/
├── app/
│   ├── (auth)/login/           public route group
│   └── (protected)/            gated by ProtectedShell, redirects to /login without a session
│       ├── dashboard/
│       └── events/[id]/registrations/
├── core/
│   ├── api/                     axios instance, envelope-unwrapping interceptor
│   ├── config/                  typed NEXT_PUBLIC_* env
│   ├── hooks/                   use-auth (Zustand), use-csv-download
│   ├── providers/                React Query provider + Toaster
│   ├── realtime/                 socket-provider (module-level singleton), use-live-checkins
│   └── services/                 auth.service
├── components/ui/               hand-rolled component set (Button, Table, Modal, etc.)
└── shared/types/                types mirroring the API's presenters (event, registration, check-in)
```
# eventdesk-web
