# KINGBOT Platform

A single Node.js service (no framework, no build step) that serves the KINGBOT
marketing site, dashboard, and a small JSON API backed by SQLite.

## What's actually implemented

- Signup / login with hashed passwords and token-based sessions (SQLite)
- Per-user demo balance, plan, and demo/live mode switch
- Bot fleet: create bots, start/pause them, persisted per user
- Simulated broker "connect" flow (stores a connection record; no real broker API calls)
- Simulated AI support reply (canned response, no external AI API call)
- Analytics endpoint with a fixed demo win rate / PnL, real bot & broker counts
- Static marketing pages (home, pricing, strategies, legal) all linked together
  through one consistent nav, with a mobile hamburger menu and scroll animations

Broker connectivity and the AI assistant are intentionally simple placeholders —
wiring them to a real broker API (MT5/OANDA/Binance) or a real LLM is future work,
not something this codebase currently does.

## Run locally

```bash
npm install
npm start
```

Then visit `http://127.0.0.1:3000/`.

Run the test suite with:

```bash
npm test
```

## Configuration

All configuration is optional; sensible defaults are used if unset.

| Variable        | Default             | Purpose                          |
| --------------- | -------------------- | --------------------------------- |
| `PORT`          | `3000`               | Port the server listens on        |
| `HOST`          | `0.0.0.0`            | Interface the server binds to     |
| `DATABASE_PATH` | `./kingbot.sqlite`   | Path to the SQLite database file  |

Copy `.env.example` to `.env` if you use a process manager that loads it; the
server itself does not read `.env` files automatically (no framework code
depends on one, and none is required to run it).

## Deploying on Render

### Option A — Blueprint (`render.yaml`)

This repo includes a `render.yaml` that provisions a web service with a 1 GB
persistent disk mounted at `/data`, so the SQLite database survives deploys
and restarts. Persistent disks require a paid instance type (`starter` or
above) — Render's free tier does not support attaching a disk.

1. Push this repo to GitHub/GitLab.
2. In Render, choose **New > Blueprint** and point it at the repo.
3. Render reads `render.yaml` and creates the service automatically.

### Option B — Manual web service (works on the free tier)

1. In Render, choose **New > Web Service** and connect the repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Leave `DATABASE_PATH` unset. On the free tier the SQLite file lives on the
   service's ephemeral disk, which means **data resets on every deploy or
   restart** — fine for a demo, not for real user data.

Either way, Render sets `PORT` automatically; the app already reads it.

## Project structure

```
server.js       HTTP server + JSON API routes
storage.js      SQLite schema and data access
app.js          Shared front-end behavior (nav, auth-aware button, animations)
styles.css      Shared styling for every page
*.html          Marketing site, auth pages, dashboard, analytics
legal/*.html    Privacy, terms, risk disclosure
tests/          node:test suite for storage.js
```
