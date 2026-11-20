# Coy – Discover tab

Swipe-based discovery built with Next.js (pages router) + API routes + a JSON-file DB.

## Run
    npm install
    npm run dev   # http://localhost:3000

## API
- `GET /api/feed` – profiles not yet swiped on
- `POST /api/swipe` `{ profileId, direction: "like" | "pass" }` -> `{ match, profile? }`
- `GET /api/matches` – mutual matches only
- `POST /api/reset` – demo helper, restores seed data

## Privacy
Seeded profiles that already liked the user have a private `likedMe` flag in `data/db.json`.
It is stripped by `publicProfile()` and never sent to the client. A match is created only
when the user likes a profile whose `likedMe` is true (mutual like).

## Persistence
Swipes and matches are stored in `data/db.json` (auto-created on first request).
A swiped profile is filtered out of `/feed` server-side, so it can never reappear, even after reload.
