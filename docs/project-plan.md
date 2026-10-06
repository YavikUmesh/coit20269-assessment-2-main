# StudySwap — Project Plan (Group D)

COIT20269 Assignment 2 — due Exam Week Monday 11:45pm

## Team & Roles

| Member | ID | Primary ownership |
|---|---|---|
| Yavik Umesh Dayaram | 12315332 | Backend — Express API, auth, Atlas, Render deployment |
| Thi My Linh Huynh | 12291057 | Frontend — jQuery Mobile UI, Cordova build/plugins |
| John Anthony Hosenilla Naui | 12308835 | Docs, testing & presentation — user stories, slides, vulnerability analysis |

All members commit to GitHub throughout (version control is worth 2 marks — commit regularly with meaningful messages).

## Milestones

### Weeks 8–9 — Foundation
- [ ] Finalise user stories and high-level requirements
- [ ] Repo structure (`client/`, `server/`, `docs/`)
- [ ] MongoDB Atlas cluster + connection from server
- [ ] Express skeleton: HTTPS, CORS, JWT auth, User router (sign-up / login / logout)
- [ ] Deploy to Render early (keep it deployed from here on)

### Weeks 9–10 — Core Features
- [ ] Listing model + router (create / read / update / delete)
- [ ] Client pages: browse, listing detail, create/edit, profile
- [ ] Wire client → API (all four HTTP verbs used)
- [ ] Cordova project wraps client; camera plugin for listing photos
- [ ] Test on physical Android device

### Week 11 — Polish & Testing
- [ ] UI/aesthetics polish (jQuery Mobile themes, navigation flow)
- [ ] Functional testing + screenshots for slides
- [ ] Vulnerability analysis per Week 11 tutorial handout (identify & report, no fixes required)
- [ ] README/setup docs finalised

### Week 12 — Presentation & Submission
- [ ] PowerPoint: motivation, user requirements, architecture diagram, test results, vulnerability results
- [ ] Live demo rehearsal (device/emulator)
- [ ] Package zip: slides + all code
- [ ] Each member uploads same copy to Moodle

## Mark-Critical Checklist

- [ ] HTTPS enforced on server
- [ ] No hardcoded credentials (env vars only)
- [ ] Express Routers split into separate files
- [ ] CORS + auth middleware present
- [ ] ≥3 HTTP request types (GET/POST/PUT/DELETE) in user interactions
- [ ] Login, logout, sign-up all working
- [ ] MongoDB Atlas used for persistent data
- [ ] Server deployed online (Render)
- [ ] Cordova app runs on emulator/smart device
- [ ] Complete commit history in GitHub

## Data Model (initial)

- **User** — name, email (unique), passwordHash, campus, createdAt
- **Listing** — title, description, price, category, photo, seller (ref User), status (active/sold), createdAt
