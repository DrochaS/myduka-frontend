# PR review — MyDuka inventory app (full stack)

**Frontend branch:** `feat/myduka-inventory-app`  
**Backend branch:** `feat/myduka-inventory-api`  
**Against:** MyDuka problem statement (auth, clerk/admin/merchant, charts, Flask, React+Redux, tests)

## Verdict
**Approve with follow-ups** — core product flows are implemented end-to-end for demo/local use. Harden before production (real SMTP, Postgres migrations in CI, stronger invite rate limits).

## Checklist

| Area | Result | Notes |
|------|--------|-------|
| Spec coverage | Pass | Roles, stock, supply, payments, charts mapped in `docs/SPEC-COVERAGE.md` |
| React + Redux Toolkit | Pass | Store + auth/inventory/request/analytics slices |
| Flask + JWT | Pass | Invite tokens, role decorators, inventory routes |
| Charts (line + bar) | Pass | Chart.js wrappers on admin/merchant analytics |
| FE tests (Jest-style) | Pass | Vitest 19 tests |
| BE tests (minitest-style) | Pass | pytest 16 tests |
| PostgreSQL | Pass w/ note | `DATABASE_URL`; SQLite used in pytest |
| Figma | Out of repo | Mobile-friendly UI shipped; Figma file not in git |
| Security | Nits | Dev secrets in `.env.example`; ensure prod secrets rotated |

## Strengths
- Clear role separation across API and UI
- Chart.js series shaped for dashboards
- Invite flow with expiry-friendly tokens
- Deactivate vs delete for clerks/admins

## Follow-ups
1. Wire real Flask-Mail + HTML invite template
2. Alembic migrations for Postgres in deploy pipeline
3. E2E (Playwright) for invite → clerk stock → admin approve
4. Attach Figma mobile wireframe link in README
5. Code-split large frontend bundle (>500kb warning)

## Suggested test plan for reviewers
- [ ] `cd myduka-backend && pytest`
- [ ] `cd myduka-frontend && npm test && npm run build`
- [ ] Login as merchant → invite admin → accept invite
- [ ] Admin adds clerk → clerk posts stock + supply request
- [ ] Admin approves request + marks payment paid
- [ ] Confirm line/bar charts render on admin & merchant dashboards
