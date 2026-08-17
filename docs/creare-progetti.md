# Creare nuovi progetti

Come aggiungere progetti al portfolio: struttura del repository, chiavi del `package.json` e sincronizzazione automatica.

## Come funziona la sincronizzazione

Il server mantiene i progetti aggiornati in modo **automatico** rispetto ai repository GitHub. La sincronizzazione parte:

1. **all'avvio del server** (sync iniziale);
2. **ogni ora** di default, in base all'espressione cron `SYNC_CRON` nel `.env`.

Per questo, **non serve modificare nulla nel server** quando nasce un nuovo progetto: basta creare il repository con le regole descritte in questa guida e, alla prossima sincronizzazione, il progetto comparirà da solo nel portfolio.

## Regole di base

### 1. Il prefisso nel nome del repository

Il server cerca solo i repository il cui nome **inizia con uno dei prefissi configurati** in `PROJECT_PREFIXES` (valore di default: `fm-`).

Esempi:

- `fm-advice-generator` ✅ incluso
- `fm-product-preview` ✅ incluso
- `personal-landing` ❌ escluso (non ha il prefisso)

Per aggiungere un nuovo prefisso (es. `pm-`, `challenge-`) basta elencarlo nel `.env` separato da virgola:

```bash
PROJECT_PREFIXES=fm-,pm-
```

> La ricerca avviene nell'account collegato al token `GITHUB_TOKEN` (usando l'API autenticata), mentre i file di ogni repo — `package.json`, `README.md`, `screenshots/` — vengono letti dall'account owner configurato nel servizio GitHub (`Smailen5`).

### 2. Struttura richiesta del repository

Ogni repository incluso deve contenere:

```
nome-progetto/
├── package.json     # Metadati lette dal server (vedi sotto)
├── README.md        # Descrizione lunga del progetto
└── screenshots/     # Immagini di anteprima (almeno una)
```

Se manca uno di questi elementi, il progetto viene comunque sincronizzato ma viene segnalato un errore nel risultato della sync.

## Le chiavi del `package.json`

Il server legge il `package.json` alla radice del repository e ne estrae i campi indicati. Questi sono i **metadati principali** del progetto nel portfolio.

```json
{
  "name": "Advice Generator",
  "description": "Sfida Frontend Mentor: generatore di consigli con API esterna",
  "technologies": ["html", "css", "javascript"],
  "version": "1.0.0",
  "createdAt": "2025-06-01T00:00:00.000Z"
}
```

| Chiave | Obbligatoria | Uso nel portfolio |
|--------|--------------|-------------------|
| `name` | No | Nome visualizzato del progetto (se assente, si usa il nome del repository) |
| `description` | No | Testo breve del progetto (se assente, vuota) |
| `technologies` | No | Lista delle tecnologie usate (se assente, vuota) |
| `version` | No | Versione di release del progetto (se assente, vuota) |
| `createdAt` | No | Data di creazione, usata per ordinare i progetti |

Queste chiavi vanno **messe a mano** in ogni repository: non viene usato il comando `npm init` di default.

## Da dove arrivano gli altri valori

| Valore | Fonte |
|--------|-------|
| `name`, `description`, `technologies`, `version`, `createdAt` | `package.json` del repository |
| `readmeContent` | contenuto del file `README.md` alla radice del repository |
| `images` | file presenti nella cartella `screenshots/` del repository (scaricati, convertiti e salvati server-side in `SCREENSHOTS_DIR`) |
| `repoUrl` | URL del repository su GitHub |
| `repoName` | nome del repository |

## Verificare la sincronizzazione

Per forzare una sincronizzazione immediata e controllare lo stato:

1. Ottieni un token JWT con `POST /api/users/login` (vedi [Guida d'uso](guida-uso.md));
2. Chiama `PUT /api/github/sync` con `x-api-key` e `Authorization: Bearer`.

La risposta include il numero di progetti sincronizzati e l'elenco di eventuali errori (es. repository senza `screenshots/` o senza `README.md`).