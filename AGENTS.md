# AGENTS.md — server-portfolio

## Comandi

| Azione | Comando |
| -------- | --------- |
| Avvio sviluppo | `pnpm dev` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Test | `pnpm test` |
| Test singolo file | `pnpm vitest run tests/integration/users.test.ts` |
| Test con coverage | `pnpm test:coverage` |
| Typecheck | `pnpm typecheck` |
| Avvio produzione | `pnpm start` |
| Docker (app + mongo) | `docker compose up --build` |

## File di contesto

- `CONVENTION.md` — convenzioni complete (commit, PR, issue, template, lingua). **Leggere all'inizio di ogni sessione.**
- `.opencode/notes/NOTE*.md` — memoria di lavoro, storico, contesto del progetto.
- `.opencode/plans/PLAN*.md` — piani di implementazione dettagliati.
- `.github/pull_request_template.md` — template obbligatorio per PR.
- `.github/ISSUE_TEMPLATE/` — template obbligatori per issue (usare `<tipo>.yaml`).

## Git workflow

- **Branch**: sempre da `main`, nome `<tipo>/<descrizione>` (`feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`)
- **Mai commit su main** — solo PR con merge via GitHub
- **Mai chiudere PR** — se un errore, fixa il branch e force-push
- **Mai eliminare rami remoti** a meno che non sia espressamente richiesto
- **Mai toccare** branch `release-please--branches--main--*` o relative PR (gestite automaticamente)
- Pulire i rami locali dopo il merge con `git cleanup` (alias configurato)

## Commit e PR

Vedi `CONVENTION.md` per le regole complete su commit, PR, issue, lingua e template.

- Il commit locale DEVE passare commitlint in pre-commit (header max 42 caratteri, body-leading-blank)
- Il titolo PR (commit finale dopo squash merge) DEVE passare la CI `validate-pr-title` (header max 72 caratteri, body-leading-blank)

## Architettura

- **Stack**: Express 5 + TypeScript 6 + Mongoose 9 (MongoDB), pnpm, ESM (`"type": "module"`)
- **Entrypoint**: `src/index.ts` → Express app con route: `/api/projects`, `/api/github`, `/api/users`, `/healthcheck`
- **Auth**: doppio layer — API key (`x-api-key`) + JWT (`Authorization: Bearer`)
- **GitHub sync**: Octokit per sincronizzare repo da `Smailen5/Frontend-mentor-challenge`; sync iniziale all'avvio + cron ogni ora (`SYNC_CRON`)
- **Deploy**: Docker (`Dockerfile` multi-stage) + docker-compose (app + MongoDB 7). Presenza di `.netlify/` indica anche deploy Netlify.

## Gotchas

- **ESM con estensioni `.js`**: tutti gli import relativi nel codice sorgente DEVONO usare l'estensione `.js` (es. `import { foo } from "./bar.js"`), anche se il file sorgente è `.ts`. Il `tsconfig` usa `"module": "node16"`.
- **Coverage obbligatorio in CI**: la CI esegue `pnpm test:coverage` con soglie minime all'80% (lines, branches, functions, statements). Un test che abbassi il coverage sotto l'80% fallisce la CI.
- **Test helper**: `tests/helpers/testApp.ts` espone `createTestApp()` per creare un'istanza Express isolata nei test di integrazione (usa `supertest`).
- **MongoDB richiesto**: lo sviluppo e i test di integrazione richiedono MongoDB locale (`mongodb://localhost:27017/...` in `.env`) oppure `docker compose up`.
- **Husky v9**: hook `commit-msg` (commitlint) e `pre-push` (`pnpm lint` + `pnpm build`). Nessun boilerplate v4 nei file hook.

## CI/CD (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`): su ogni PR a `main` → job `lint-build-test` (lint + build + test:coverage) + job `validate-pr-title`
- **Release-please** (`.github/workflows/release-please.yml`): su push a `main` → crea/aggiorna release PR, genera tag `vX.Y.Z` e changelog
- Config release-please: `release-type: node`, `include-component-in-tag: false`, `changelog-sections` completo (docs, chore, refactor, test visibili nel changelog)
