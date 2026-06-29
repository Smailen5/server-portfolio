# AGENTS.md — server-portfolio

## Comandi
| Azione | Comando |
|--------|---------|
| Avvio sviluppo | `pnpm dev` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Avvio produzione | `pnpm start` |

## File di contesto
- `CONVENTION.md` — convenzioni complete (commit, PR, issue, template, lingua). **Leggere all'inizio di ogni sessione.**
- `NOTE*.md` — memoria di lavoro, storico, contesto del progetto
- `PLAN*.md` — piani di implementazione dettagliati
- `.github/pull_request_template.md` — template obbligatorio per PR
- `.github/ISSUE_TEMPLATE/` — template obbligatori per issue (usare `<tipo>.yaml`)

## Git workflow
- **Branch**: sempre da `main`, nome `<tipo>/<descrizione>` (`feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`)
- **Mai commit su main** — solo PR con merge via GitHub
- **Mai chiudere PR** — se un errore, fixa il branch e force-push
- **Mai eliminare rami remoti** a meno che non sia espressamente richiesto
- **Mai toccare** branch `release-please--branches--main--*` o relative PR (gestite automaticamente)
- Pulire i rami locali dopo il merge con `git cleanup` (alias configurato)
- Il merge su GitHub usa rebase, quindi `git branch -D` locale è sicuro anche se il branch non risulta fully merged

## Commit e PR
Vedi `CONVENTION.md` per le regole complete su commit, PR, issue, lingua e template.
- Il commit DEVE passare commitlint in pre-commit e CI (header max 42 caratteri, body-leading-blank)

## Architettura
- **Stack**: Express + TypeScript + Mongoose (MongoDB), pnpm
- **Entrypoint**: `src/index.ts` → Express app con route: `/api/projects`, `/api/github`, `/api/users`
- **Auth**: doppio layer — API key (`x-api-key`) + JWT (`Authorization: Bearer`)
- **Database**: MongoDB via Mongoose (modelli in `src/models/`)
- **GitHub sync**: Octokit per leggere repo `Smailen5/Frontend-mentor-challenge` da `packages/`
- **Logs**: Winston + Morgan in `logs/`

## CI/CD (GitHub Actions)
- **CI**: su ogni PR a `main` → lint + build + validazione titolo PR
- **Release-please**: su push a `main` → crea/aggiorna release PR, genera tag e changelog
- Config release-please: `release-type: node`, `include-component-in-tag: false` (usa tag `vX.Y.Z`), `changelog-sections` completo

## Husky (v9)
- **commit-msg**: commitlint
- **pre-push**: `pnpm lint` + `pnpm build`
- Nessun boilerplate v4 nei file hook
