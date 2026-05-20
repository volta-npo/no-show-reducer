# Quality Plan: No-Show Reducer

## Definition of production-ready

- Local-first app runs from `index.html` with no build step.
- Rubric weights sum to 100 and are tested.
- JSON and Markdown exports work offline.
- Print view is usable as a handoff packet.
- Data stays in browser localStorage unless exported by the user.
- Review gates make student, mentor, and owner approval explicit.

## Primary metric

`appointments protected by reminder workflows`

## SaaS readiness gates

- SaaS console exports account CSV and executive Markdown briefs locally.
- Account health, activation, playbook readiness, and automation coverage are calculated from workspace state.
- Every automation remains human-reviewed and mapped to product safety checks.


## TypeScript strictness migration

- Keep the current generated-artifact policy intact while new modules add test coverage first.
- Move newly added SaaS modules toward explicit contracts before flipping repo-wide `strict` to `true`.
- Prioritize `src/saas-blueprint.ts`, `src/saas-core.ts`, `src/v3-core.ts`, and `src/domain-core.ts` for typed interfaces in the next hardening pass.
- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run certify` before any strictness escalation.


## Expanded SaaS readiness gates

- Validate onboarding completion, role ownership, integration readiness, support queue severity, audit evidence, and expansion readiness before launch.
- Treat unresolved high-severity support items as launch risk even when account health is high.
- Verify generated account CSV and operations CSV exports for customer-success handoff.
- Keep human review and rollback ownership attached to every automation touching client data or public communications.
