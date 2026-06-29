# AGENTS.md — server-portfolio

## Comandi
| Azione | Comando |
|--------|---------|
| Avvio sviluppo | `pnpm dev` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Avvio produzione | `pnpm start` |

## Git workflow
- **Branch**: sempre da `main`, nome `<tipo>/<descrizione>` (`feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`)
- **Mai commit su main** — solo PR con merge via GitHub
- **Mai chiudere PR** — se un errore, fixa il branch e force-push
- **Mai eliminare rami remoti** a meno che non sia espressamente richiesto
- **Mai toccare** branch `release-please--branches--main--*` o relative PR (gestite automaticamente)
- Pulire i rami locali dopo il merge con `git cleanup` (alias configurato)
- Il merge su GitHub usa rebase, quindi `git branch -D` locale è sicuro anche se il branch non risulta fully merged

## Commit (ferrei — fallisce in pre-commit e CI)
```
<tipo>: <testo in italiano, max 42 caratteri totali>

<corpo descrittivo se serve, blank line obbligatoria se c'è>
```
- **Linus test**: "If applied, this commit will **<soggetto>**" deve avere senso
- Dopo il prefisso, verbo al **presente indicativo 3a persona singolare** (es. `fix: rimuove`, `feat: aggiunge`, `docs: traduce`)
- **Mai infinito** (`rimuovere`, `aggiungere`) — violazione grave
- **Mai participio passato** (`rimosso`, `aggiunto`) — "will rimosso" non ha senso
- Il commit stesso DEVE passare commitlint: header max 42, body-leading-blank

## PR
- **Titolo**: stesse regole dei commit (conventional + max 42 caratteri)
- **Body**: usa il template in `.github/pull_request_template.md`
- References: `Closes #numero` nel body per chiudere automaticamente le issue
- **Mai** aprire PR duplicate o chiudere PR esistenti

## Architettura
- **Stack**: Express + TypeScript + Mongoose (MongoDB), pnpm
- **Entrypoint**: `src/index.ts` → Express app con route: `/api/projects`, `/api/github`, `/api/users`
- **Auth**: doppio layer — API key (`x-api-key`) + JWT (`Authorization: Bearer`)
- **Database**: MongoDB via Mongoose (modelli in `src/models/`)
- **GitHub sync**: Octokit per leggere repo `Smailen5/Frontend-mentor-challenge` da `packages/`
- **Logs**: Winston + Morgan in `logs/`

## File di contesto
- I file `NOTE*.md` contengono la memoria di lavoro, lo storico e il contesto del progetto
- I file `PLAN*.md` contengono piani di implementazione dettagliati
- `CONVENTION.md` elenca le convenzioni su PR, issue, commit e nomenclatura
- L'agente deve leggerli all'inizio di ogni sessione

## Template — percorsi esatti (leggere PRIMA di creare)
- **Issue**: `.github/ISSUE_TEMPLATE/` elenca i tipi. Leggi `.github/ISSUE_TEMPLATE/<tipo>.yaml` come struttura.
- **PR**: `.github/pull_request_template.md` è la struttura obbligatoria.
- **Regola d'oro**: MAI creare issue o PR senza aver prima letto il template corrispondente.

## Convenzioni repo
- **Commit, PR, issue, documentazione**: ITALIANO (obbligatorio)
- **Codice sorgente (variabili, funzioni, classi, log)**: INGLESE
- `.env.example` contiene placeholder, mai segreti veri
- **Issue**: creare sempre con `gh issue create`, corpo via `--body-file`, template da `.github/ISSUE_TEMPLATE/`
- **PR**: corpo dal template `.github/pull_request_template.md`, titolo conventional commit max 42 caratteri

## CI/CD (GitHub Actions)
- **CI**: su ogni PR a `main` → lint + build + validazione titolo PR
- **Release-please**: su push a `main` → crea/aggiorna release PR, genera tag e changelog
- Config release-please: `release-type: node`, `include-component-in-tag: false` (usa tag `vX.Y.Z`), `changelog-sections` completo

## Husky (v9)
- **commit-msg**: commitlint
- **pre-push**: `pnpm lint` + `pnpm build`
- Nessun boilerplate v4 nei file hook
