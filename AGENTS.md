# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Context

- **Project:** StudySwap — student second-hand marketplace (COIT20269 Assignment 2, Group D)
- **Stack:** JavaScript only (no TypeScript). Express/Node.js server, jQuery + jQuery Mobile client, MongoDB Atlas, Cordova hybrid app.
- **Spec:** `docs/Assignment 2 - Mobile Apps Project specification.md`
- **Team workflow:** `docs/workflow.md` — read it before doing anything.

## Worktrees — REQUIRED for tasks

When given a task to implement (code or docs), **always work in a git worktree**, never directly in the main working directory:

- Worktrees live under `.worktrees/` in the project directory: `.worktrees/<branch-name>`
- Example: for branch `feat/11-user-auth-router`, use `.worktrees/feat-11-user-auth-router`
- Create it from the latest `dev` branch:
  ```bash
  git fetch origin
  git worktree add .worktrees/<dir-name> -b <branch-name> origin/dev
  cd .worktrees/<dir-name>
  ```
- Do all work inside the worktree, commit there, push the branch from there
- Remove the worktree after the PR is merged:
  ```bash
  git worktree remove .worktrees/<dir-name>
  ```
- `.worktrees/` is gitignored — never commit its contents from the parent repo

## Branching & PR Rules (summary — full details in docs/workflow.md)

- Branch from `dev`, never commit directly to `main` or `dev`
- Branch naming: `feat/<issue#>-<slug>`, `docs/<issue#>-<slug>`, `chore/<issue#>-<slug>`
- PR title: `[BE] #11 Short summary` (category tags: `[BE]` `[FE]` `[DOCS]` `[INFRA]` `[LEAD]`)
- All PRs target `dev` and request review from @nauijohn
- Link issues in PR description (`Closes #N` / `Refs #N`)

## Code Rules

- JavaScript only — no TypeScript, no build/transpile step
- No hardcoded credentials — secrets via `.env` (see `server/.env.example`); never commit `.env`, certs, or keys
- Server: Express Routers in separate files under `server/src/routers/`, middleware in `server/src/middleware/`
- Client: jQuery Mobile conventions in `client/www/`
- Commit early and often with meaningful messages — complete history is graded

## Do Not

- Do not initialize or scaffold beyond what the current task asks for
- Do not commit `node_modules/`, `.env`, certificates, or Cordova build output (`client/platforms/`, `client/plugins/`)
- Do not push to `main` directly
