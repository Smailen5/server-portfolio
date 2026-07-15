# CONVENTION.md — Convenzioni del progetto

Questo file è il riferimento per le convenzioni di lavoro.
L'agente deve leggerlo all'inizio di ogni sessione.

---

## File di contesto (gitignorati)

| Pattern | Scopo |
|---------|-------|
| `.opencode/notes/NOTE*.md` | Memoria di lavoro, storico, contesto del progetto |
| `.opencode/plans/PLAN*.md` | Piani di implementazione (temporanei, da eliminare dopo l'esecuzione) |
| `CONVENTION.md` | Questo file |

---

## Issue — procedura obbligatoria

PRIMA di creare una issue:
1. **Leggi il template corretto:** `ls .github/ISSUE_TEMPLATE/` per vedere i tipi disponibili
2. **Leggi il contenuto del template selezionato:** `cat .github/ISSUE_TEMPLATE/<tipo>.yaml` (es. `test.yaml`, `feat.yaml`)
3. **Compila** la issue seguendo ESATTAMENTE la struttura del template
4. Titolo: `<tipo>: <descrizione in italiano>`
5. **Label obbligatorie:**
   - **Tipo** — uguale al prefisso del titolo (`feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `ci`, `perf`, `build`)
   - **Priorità** — `priority: high`, `priority: medium`, `priority: low`
6. **Label opzionale:** `quick win` per issue molto semplici (5-10 min)
7. Crea con `bash -c 'gh issue create --repo Smailen5/server-portfolio --title "..." --label "<tipo>,priority: <livello>" --body-file <tmpfile>'`
8. **Non cancellare issue** — modifica con `gh issue edit`

---

## PR — procedura obbligatoria

PRIMA di creare una PR:
1. **Leggi il template:** `cat .github/pull_request_template.md`
2. **Compila** la PR seguendo ESATTAMENTE la struttura del template
3. Titolo: conventional commit + italiano, **max 72 caratteri totali** (il CI rifiuta titoli piu' lunghi; verifica con `echo ${#TITLE}` prima di creare la PR)
4. `Closes #numero` nel body
5. **Label:** aggiungere la label corrispondente al tipo (`feat`, `fix`, `chore`, ecc.) scelta dal titolo
6. Crea con `bash -c 'gh pr create --repo Smailen5/server-portfolio --base main --title "..." --label "<tipo>" --body-file <tmpfile>'`
7. **Una PR = una issue** — mai aprire PR duplicate
8. **Mai chiudere PR** — fixa il branch e pusha

---

## Titoli di issue, commit e PR

I tre elementi hanno scopi diversi e quindi contenuti diversi.

| Elemento | Scopo | Limite | Esempio |
|----------|-------|--------|---------|
| **Issue** | Descrive il problema o il lavoro da fare | libero | `chore: configura prefissi repo e cartella screenshots` |
| **Commit locale** | Descrive l'unità logica della modifica (atomica) | 42 caratteri | `chore: aggiunge variabili prefissi repo` |
| **PR** | Descrive cosa è stato fatto; finisce nel changelog di release-please | 72 caratteri | `chore: aggiunge variabili prefissi repo e middleware screenshots` |

### Regole per il titolo della PR

1. Deve iniziare con un prefisso conventional commit valido (`feat:`, `fix:`, `chore:`, ecc.).
2. Deve descrivere **cosa è stato fatto**, non il problema da risolvere.
3. Deve essere **più specifico del titolo issue**: usare nomi di variabili, funzioni, endpoint o file quando rilevante.
4. Deve rispettare il limite di 72 caratteri (enforced dal CI `validate-pr-title`).

### Esempi

| Tipo | Titolo issue | Titolo PR |
|------|--------------|-----------|
| chore | configura prefissi repo | aggiunge variabili prefissi repo e middleware screenshots |
| fix | auth non gestisce token scaduto | aggiunge redirect a /login quando JWT è scaduto |
| feat | supporto immagini multiple | aggiunge schema images[] e endpoint PUT upload multiplo |

---

## Commit

### 1. Commit locali (durante lo sviluppo)
- Header: `<tipo>: <testo in italiano>` — **max 42 caratteri totali** (enforced da commitlint in pre-commit)
- Corpo (se presente): riga vuota dopo header, a capo a 72, **in lista puntata** (`-`) per facilitare la revisione
- Verbo al **presente indicativo 3a persona singolare** — mai participio o infinito
- **Linus test**: "If applied, this commit will **soggetto**" deve avere senso
- Mai `git add .` o `git commit -am`
- Commit atomici

### 2. Titolo PR (diventa il commit su main dopo squash merge)
- Header: `<tipo>: <testo in italiano>` — **max 72 caratteri totali** (enforced da CI `validate-pr-title`)
- Deve essere abbastanza descrittivo per il changelog generato da release-please
- Stesse regole di lingua e conventional commit dei commit locali

---

## Label — catalogo completo

Repo personale (unico contributor). Le label servono a filtrare rapidamente per tipo e urgenza.

### Tipo (coincide col prefisso conventional commit)

| Label | Colore | Quando usarla |
|-------|--------|---------------|
| `feat` | `#2d9e4e` verde | Nuova funzionalità |
| `fix` | `#b60205` rosso | Correzione bug o errore |
| `chore` | `#5319e7` viola | Manutenzione, configurazione, CI |
| `refactor` | `#fbca04` giallo | Refactoring senza cambio funzionalità |
| `test` | `#0e8a16` verde chiaro | Test e copertura |
| `docs` | `#0075ca` blu | Documentazione |
| `ci` | `#0b6c99` blu scuro | CI/CD e automazione |
| `perf` | `#d93f0b` arancione | Performance |
| `build` | `#555555` grigio | Build, dipendenze, tooling |

### Priorità

| Label | Colore | Quando usarla |
|-------|--------|---------------|
| `priority: high` | `#b60205` rosso | Da fare subito |
| `priority: medium` | `#fbca04` arancione | Da fare nei prossimi giorni |
| `priority: low` | `#0e8a16` verde | Quando si ha tempo |

### Speciali

| Label | Colore | Quando usarla |
|-------|--------|---------------|
| `quick win` | `#1d76db` azzurro | Issue semplice (5-10 min), per allenamento |
| `bug` | `#d73a4a` rosso | Issue aperta da GitHub template bug |
| `duplicate` | `#cfd3d7` grigio | Issue duplicata |

### Regole

- Ogni issue DEVE avere **un label tipo** + **un label priorità**
- Issue veloci → aggiungere anche `quick win`
- `bug` e `fix` sono equivalenti: usare `fix` quando si crea una issue nuova
- Le PR dovrebbero avere almeno il **label tipo** (coincide col prefisso conventional commit)

---

## Lingua

- Documentazione, commit, PR, issue: **ITALIANO** (obbligatorio)
- Codice sorgente: **INGLESE**
- `.env.example` contiene placeholder, mai segreti veri

---

## Riferimenti

- `~/.config/opencode/AGENTS.md` — direttive globali agente
- `AGENTS.md` in-repo — comandi, architettura, CI/CD
- `.github/pull_request_template.md` — template PR
- `.github/ISSUE_TEMPLATE/` — template issue
