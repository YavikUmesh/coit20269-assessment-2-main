# StudySwap — Student Second-Hand Marketplace

COIT20269 Assignment 2 — Mobile Apps Project (Group D)

A three-tier mobile hybrid app for buying and selling second-hand items between students on campus.

## Group D

| Student ID | Name | Campus |
|---|---|---|
| 12315332 | Yavik Umesh Dayaram | MEL |
| 12291057 | Thi My Linh Huynh | MEL |
| 12308835 | John Anthony Hosenilla Naui | MEL |

## Motivation

General-purpose marketplaces (Gumtree, Facebook Marketplace) and student sites (StudentVIP) are not campus-focused: no student verification, no campus pickup context, and scattered/trust-poor experiences. StudySwap targets CQU students who want a trusted, simple way to trade textbooks, furniture, and electronics with fellow students.

## Architecture

```
┌─────────────────────────────┐
│  Cordova Hybrid App         │
│  jQuery Mobile + HTML5/CSS  │
│  (Android smart device)     │
└──────────────┬──────────────┘
               │ HTTPS (JSON API, JWT auth)
┌──────────────▼──────────────┐
│  Express Server (Render)    │
│  Routers per resource       │
│  CORS + auth middleware     │
└──────────────┬──────────────┘
               │ Mongoose
┌──────────────▼──────────────┐
│  MongoDB Atlas (cloud)      │
└─────────────────────────────┘
```

## Tech Stack

- **Client:** jQuery, jQuery Mobile, JavaScript, HTML5, CSS — packaged with Cordova (camera plugin for listing photos)
- **Server:** Node.js 24, Express, Passport (local + JWT strategies), Mongoose, JWT auth, CORS middleware, HTTPS
- **Database:** MongoDB Atlas
- **Deployment:** Render (server), Cordova/Android (app)
- **Version control:** GitHub

## Features

- Sign-up, login, logout (JWT-authenticated)
- Create, browse, edit, and delete listings (GET / POST / PUT / DELETE)
- User profiles
- Camera integration for listing photos

## Repository Structure

```
├── client/     # jQuery Mobile web client + Cordova project
├── server/     # Express API
└── docs/       # Specification, project plan, presentation notes
```

## Setup

### Requirements

- **Node.js 24** (`>=24 <25` — enforced; `server/.nvmrc` provided, run `nvm use`)
- **npm only** (>= 11) — do not use yarn or pnpm; `engine-strict` will reject mismatched environments

### Server (Docker — recommended)

Runs the API with nodemon hot-reload plus a local MongoDB:

```bash
docker compose up --build     # API on http://localhost:3100, MongoDB on 27017
docker compose down -v        # stop and wipe the DB volume
```

`JWT_SECRET` can be overridden via a root `.env` (see `JWT_SECRET` in `docker-compose.yml`); the default is dev-only.

### Server (bare metal)

```bash
cd server
npm install
npm run generate-cert   # one-time: self-signed cert for local HTTPS
npm run dev             # nodemon hot-reload
```

Requires a `.env` file (never committed) with:

```
PORT=3000
MONGODB_URI=<atlas-connection-string>
JWT_SECRET=<secret>
# optional for local HTTPS:
HTTPS_KEY_PATH=certs/dev-key.pem
HTTPS_CERT_PATH=certs/dev-cert.pem
```

### Lint & format

```bash
cd server
npm run lint        # oxlint
npm run fmt         # oxfmt (writes fixes)
npm run fmt:check   # oxfmt (CI-style check)
```

### Client

Open `client/www/index.html` in a browser for development, or build with Cordova:

```bash
cd client
cordova platform add android
cordova run android
```

## License

For assessment purposes only — COIT20269, CQU.
