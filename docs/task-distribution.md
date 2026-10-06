# Task Distribution — Group D (StudySwap)

All code is **JavaScript only** (no TypeScript) — Node.js/Express on the server, jQuery/JS on the client.

## Roles

| Member | Role | Focus |
|---|---|---|
| John Anthony Hosenilla Naui (Lead) | Lead + BE/FE heavy lifting | Coordination, docs, hard backend & frontend tasks, testing, presentation |
| Yavik Umesh Dayaram | Backend support | Atlas setup, Render deployment |
| Thi My Linh Huynh | Frontend support | jQuery Mobile app shell, UI polish |

> Reassignment note: the harder BE/FE tasks were moved to John so the riskiest graded components (HTTPS/auth middleware, CRUD, Cordova build) sit with the most experienced member. Yavik and Linh own the supporting tasks and must review/understand them — the tutor assesses individual understanding at the presentation.

## Task Board

### Lead / Infra / hard BE+FE — John (assignee: @nauijohn)
- `[INFRA][LEAD]` Set up repo structure (`client/`, `server/`, `docs/`) and README (#1)
- `[INFRA][LEAD]` Define coding conventions, branch/commit workflow, JS-only policy (#2)
- `[LEAD]` Coordinate milestones, review PRs, track mark-critical checklist (#3)
- `[DOCS][LEAD]` User stories & high-level user requirements (#4)
- `[DOCS][LEAD]` Presentation slides (motivation, requirements, architecture, tests, vulnerabilities) (#5)
- `[DOCS][LEAD]` Preliminary testing — screenshots for slides (#6)
- `[DOCS][LEAD]` Vulnerability analysis per Week 11 handout (#7)
- `[LEAD]` Final packaging & submission (zip, Moodle upload reminder for all members) (#8)
- `[BE]` Express skeleton: HTTPS, CORS middleware, JWT auth middleware, Routers structure (#10)
- `[BE]` User router: sign-up / login / logout — bcrypt + JWT (#11)
- `[BE]` Listing router: full CRUD — GET/POST/PUT/DELETE (#12)
- `[FE]` Auth screens: sign-up, login, logout wired to API (#15)
- `[FE]` Browse listings + listing detail pages (GET) (#16)
- `[FE]` Create / edit / delete listing pages (POST / PUT / DELETE) (#17)
- `[FE]` Cordova build: camera plugin + Android device testing (#18)

### Backend support — Yavik
- `[BE]` MongoDB Atlas cluster + connection config (env vars, no hardcoded credentials) (#9)
- `[BE]` Deploy Express server to Render (HTTPS via platform TLS) (#13)

### Frontend support — Linh
- `[FE]` jQuery Mobile app shell: pages, navigation, theme/CSS (#14)

## Workflow

1. Each task = a GitHub issue with a `[BE]` / `[FE]` / `[DOCS]` / `[INFRA]` / `[LEAD]` label
2. Branch per issue (`feat/12-listing-router`), PR reviewed by lead, then merge
3. Commit early and often — complete history is graded (2 marks)
4. Docs live in `docs/`; no project code until scaffolding issue is done
