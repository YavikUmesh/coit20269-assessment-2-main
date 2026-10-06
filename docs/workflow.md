# Team Workflow — StudySwap (Group D)

How we work on this project. Everyone follows this — it keeps our GitHub history clean (which is graded) and makes sure the lead reviews everything before it lands.

## Branching Model

```
main          ← stable, graded state. Only lead merges into it. Never commit directly.
  └── dev     ← integration branch. Features merge here via PR first.
        └── feat/<issue#>-<slug>   ← your working branch, one per issue
```

- **`main`** — always working/deployable. Updated only when a feature set is stable.
- **`dev`** — where all work lands first. PRs target `dev`, not `main`.
- **Feature branches** — created from `dev`, named `feat/<issue#>-<short-slug>`, e.g. `feat/11-user-auth-router`.

## Rules

1. **Never push directly to `main` or `dev`.** All changes go through a PR.
2. **One branch per issue.** Branch off the latest `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/11-user-auth-router
   ```
3. **Commit early, commit often.** Small commits with meaningful messages — "complete history" is a graded criterion (2 marks). No giant single commits at the end.
4. **PR title format:** `[BE] #11 User auth router (sign-up/login/logout)` — category tag, issue number, plain-English summary.
5. **Every PR must request review from @nauijohn (lead).** No self-merging.
6. **Link the issue** in the PR description (`Closes #11` when fully done, `Refs #11` if partial).
7. **Keep PRs small.** One feature per PR. If a task is big, split it.
8. **Pull `dev` before starting anything** and before opening a PR — avoid merge conflicts.
9. **Secrets never enter the repo.** `.env` is gitignored; use `.env.example` as the template. Same for Atlas credentials and JWT secrets.
10. **JavaScript only** — no TypeScript, no frameworks beyond what's specified (jQuery, jQuery Mobile, Express, Cordova).

## PR Checklist (what the lead checks before approving)

- [ ] PR title has category tag + issue number
- [ ] Description explains what was done and why
- [ ] Linked issue referenced
- [ ] Branch is up to date with `dev` (no conflicts)
- [ ] Code is JavaScript only, follows existing style
- [ ] No hardcoded credentials or secrets
- [ ] You can explain your own code — the tutor questions individuals during the presentation

## PR Description Template

```markdown
## What
<!-- 1–3 sentences: what this PR does -->

## Why
<!-- Which issue it solves and any context -->

## How
<!-- Key implementation choices (e.g. "JWT stored in localStorage, bcrypt hashing") -->

## Testing
<!-- How you verified it works (manual test steps, screenshots if UI) -->

## Issues
Closes #<issue-number>
```

## Review & Merge Flow

```
1. Assignee creates feature branch from dev
2. Assignee pushes work + opens PR → base: dev
3. Assignee requests review from @nauijohn
4. Lead reviews — approve, or request changes
5. If changes requested: fix on same branch, push, re-request review
6. Lead merges (squash) into dev and closes the issue
7. Periodically (end of each milestone) lead merges dev → main via PR
```

## Task Ownership (see docs/task-distribution.md)

| Member | Scope |
|---|---|
| @nauijohn (Lead) | Lead/infra/docs + hard BE & FE tasks (#1–#8, #10–#12, #15–#18) |
| @Yavik | Atlas setup (#9), Render deployment (#13) |
| @Linh | jQuery Mobile app shell (#14) |

Yavik and Linh: even on guided tasks, make sure you understand the code you ship — you'll be asked about it in Week 12.
