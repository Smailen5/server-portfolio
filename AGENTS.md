# AGENTS.md — server-portfolio

## Comandi
| Azione | Comando |
|--------|---------|
| Avvio sviluppo | `pnpm dev` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Avvio produzione | `pnpm start` |

## File di contesto
- **GitHub Project Board** — fonte primaria per il lavoro pianificato. Query: `gh api graphql` su project "Portfolio" (id `PVT_kwHOB5CQhs4AO4_O`). Controllare status e data pianificata prima di leggere NOTE/PLAN. **Solo lettura** — le modifiche al board le fa Smailen.
- `CONVENTION.md` — convenzioni complete (commit, PR, issue, template, lingua). **Leggere all'inizio di ogni sessione.**
- `.opencode/notes/NOTE*.md` — memoria di lavoro, storico, contesto del progetto. Leggere per verificare allineamento col board.
- `.opencode/plans/PLAN*.md` — piani di implementazione dettagliati
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
- Il commit locale DEVE passare commitlint in pre-commit (header max 42 caratteri, body-leading-blank)
- Il titolo PR (commit finale dopo squash merge) DEVE passare la CI `validate-pr-title` (header max 72 caratteri, body-leading-blank)

## Architettura
- **Stack**: Express + TypeScript + Mongoose (MongoDB), pnpm
- **Entrypoint**: `src/index.ts` → Express app con route: `/api/projects`, `/api/github`, `/api/users`
- **Auth**: doppio layer — API key (`x-api-key`) + JWT (`Authorization: Bearer`)
- **Database**: MongoDB via Mongoose (modelli in `src/models/`)
- **GitHub sync**: Octokit per leggere repo `Smailen5/Frontend-mentor-challenge` da `packages/`
- **Logs**: Winston + Morgan in `logs/`

## CI/CD (GitHub Actions)
- **CI**: su ogni PR a `main` → job `lint-build-test` (lint + build + test) + job `validate-pr-title`
- **Release-please**: su push a `main` → crea/aggiorna release PR, genera tag e changelog
- Config release-please: `release-type: node`, `include-component-in-tag: false` (usa tag `vX.Y.Z`), `changelog-sections` completo
- `.github/ISSUE_TEMPLATE/` — template obbligatori per issue (usare `<tipo>.yaml`)

## Husky (v9)
- **commit-msg**: commitlint
- **pre-push**: `pnpm lint` + `pnpm build`
- Nessun boilerplate v4 nei file hook

## Struttura del Progetto
- **src/**: Codice sorgente principale
  - `models/`: Modelli Mongoose per MongoDB (User, Projects)
  - `services/`: Servizi di business logic (SyncService, SchedulerService, ProjectService, ImageService, GitHubService)
  - `controllers/`: Logica delle richieste HTTP (healthcheck, github, projects, users)
  - `routes/`: Definizione delle rotte API
  - `middleware/`: Middleware per auth, cors, error handling e rate limiting
  - `utils/`: Funzioni di utilità (octokit, cache)
  - `config/`: Configurazione dell'applicazione (env, logger, initMongo)
- **public/**: Directory per le immagini dei progetti
- **logs/**: File di log generati dall'applicazione

## Comandi e Workflow
1. **Lint**: `pnpm lint` - Esegue ESLint sul codice sorgente
2. **Build**: `pnpm build` - Compila TypeScript in JavaScript nella directory dist/
3. **Test**: `pnpm test` - Esegue i test unitari con Vitest
4. **Dev**: `pnpm dev` - Avvia il server in modalità sviluppo con nodemon

## Strumenti e Tecnologie
- Express.js 5.x per l'API REST
- TypeScript 6.x per type checking
- Mongoose 9.x per MongoDB
- Octokit per interazione GitHub API
- Winston + Morgan per logging
- Husky + commitlint per controllo dei commit
- Vitest per testing unitario
- ESLint + Prettier per linting e formattazione

## Configurazione Ambiente
Le variabili d'ambiente richieste:
- `SERVER_API_KEY` - Chiave API per autenticazione
- `JWT_SECRET` - Segreto per JWT
- `DB_CONNECTION` - Connessione MongoDB
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` - Credenziali amministrative
- `GITHUB_TOKEN` - Token per accesso a GitHub API

## Sicurezza
- Protezione CORS con middleware personalizzato
- Rate limiting per limitare le richieste
- Helmet per configurazione di sicurezza HTTP
- Middleware di autenticazione JWT e API key
- Validazione dei dati in ingresso con express-validator

## Sincronizzazione Automatica
- Il server sincronizza automaticamente i progetti GitHub all'avvio
- La sincronizzazione avviene ogni ora (configurabile tramite `SYNC_CRON`)
- I screenshot vengono scaricati e convertiti automaticamente per il portfolio
