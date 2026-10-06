# Coding Conventions — StudySwap (Group D)

Applies to all code in this repo. JavaScript only — no TypeScript, no build/transpile step.

## Language & Runtime

- **JavaScript only** (ES2021+ features OK: optional chaining, nullish coalescing, etc.)
- **CommonJS** modules (`require` / `module.exports`) on the server — matches Express/Cordova tooling with zero config
- Node.js **24** (enforced: `engines` in package.json + `.nvmrc` + `engine-strict` in `.npmrc`)
- **npm only** (>= 11) — never yarn or pnpm; lockfile is `package-lock.json`

## Formatting

- 2-space indentation
- Semicolons: yes
- Quotes: single quotes
- `const` by default; `let` only when reassigning; never `var`
- camelCase for variables/functions; PascalCase for classes/constructors; UPPER_SNAKE for constants
- Max line length ~100 chars (soft limit)
- Trailing newline at end of every file

## Naming Files

- kebab-case for all files: `user-router.js`, `auth-middleware.js`, `listing-model.js`
- Express routers live in `server/src/routers/`, middleware in `server/src/middleware/`, models in `server/src/models/`
- Client scripts in `client/www/js/`, styles in `client/www/css/`

## Server Patterns

### Exports
Each router/middleware file exports its ready-to-mount value:

```js
// server/src/routers/user-router.js
const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        // ...
    } catch (err) {
        next(err);
    }
});

module.exports = router;
```

### Async error handling
Wrap `await` in try/catch and `next(err)` — never leave unhandled rejections. Central error handler (`error-handler.js`) turns them into JSON.

### Authentication (Passport)
Auth goes through Passport strategies defined in `server/src/config/passport.js`:

- **`passport-local`** — email + password check for `/api/users/login`. Called with a custom callback so failures keep our JSON error shape (Passport's default 401 body would break the client contract).
- **`passport-jwt`** — Bearer token verification. The strategy loads the user from the DB and **strips `passwordHash`** (`.select('-passwordHash')`), so `req.user` is always safe to serialize.
- Protect a route with `passport.authenticate('jwt', { session: false })` or the `authenticate` wrapper in `middleware/authenticate.js` (which keeps our exact 401 JSON bodies).
- Tokens are still **signed with `jsonwebtoken`** in the router — Passport verifies, it doesn't sign.
- Always pass `{ session: false }` — we are stateless (JWT in Authorization header), no sessions.

### Error response shape (consistent everywhere)
```json
{ "error": { "message": "Something went wrong", "status": 400 } }
```

### Success response shape
```json
{ "data": { } }
```

### Secrets & config
- All config through env vars via `src/config/env.js` — never `process.env` scattered through code, never hardcoded credentials
- `.env` is gitignored; `.env.example` documents required vars

## Client Patterns

- jQuery + vanilla JS; no frameworks
- One JS file per page/feature in `client/www/js/`, loaded via `<script>` at end of body
- All server calls via `fetch` over HTTPS; API base URL from a single config constant
- Store JWT in `localStorage` under key `studyswap_token`; attach as `Authorization: Bearer <token>`
- jQuery Mobile multi-page structure (`data-role="page"` divs) in `index.html`

## Git

### Commit messages
- Format: `type: short summary` — types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- ≤ 72 chars, lowercase start, no period
- Examples: `feat: add user router with signup and login`, `docs: add user stories`

### Branches
Per `docs/workflow.md`: `feat/<issue#>-<slug>`, `docs/<issue#>-<slug>`, `chore/<issue#>-<slug>` — always branched off latest `dev`.

## PR Self-Check (before requesting review from @nauijohn)

- [ ] PR title: `[BE] #N summary` with correct category tag
- [ ] Description uses the template in `docs/workflow.md`
- [ ] Issue linked (`Closes #N` / `Refs #N`)
- [ ] No `.env`, certs, `node_modules/`, or Cordova build output committed
- [ ] JS only, follows this document
- [ ] You can explain every line you wrote
