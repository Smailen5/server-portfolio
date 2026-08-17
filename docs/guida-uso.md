# Guida d'uso

Configurazione completa, endpoint disponibili, autenticazione e gestione degli errori del server.

## Indice

1. [Requisiti](#requisiti)
2. [Configurazione](#configurazione)
3. [Avvio](#avvio)
4. [Autenticazione](#autenticazione)
5. [Endpoint](#endpoint)
6. [Gestione degli errori](#gestione-degli-errori)
7. [Rate limiting](#rate-limiting)

---

## Requisiti

- Node.js 18 o superiore
- pnpm (gestione pacchetti)
- MongoDB (locale o remoto)
- Account GitHub con token personale

## Configurazione

Copia `.env.example` in `.env` e completa i valori richiesti.

### Variabili d'ambiente

| Variabile | Obbligatoria | Default | Descrizione |
|-----------|--------------|---------|-------------|
| `NODE_ENV` | Sì | `development` | Ambiente di esecuzione (`development` o `production`) |
| `PORT` | No | `3000` | Porta su cui il server resta in ascolto |
| `GITHUB_TOKEN` | Sì | — | Token GitHub per leggere i repository (evita il rate limit dell'API pubblica) |
| `DB_CONNECTION` | Sì | — | Stringa di connessione MongoDB (es. `mongodb://localhost:27017/portfolio`) |
| `CORS_ORIGIN` | Sì^1^ | — | Dominio di produzione autorizzato per le richieste CORS |
| `CORS_DEV_ORIGIN` | No | — | Dominio di sviluppo autorizzato (es. `http://localhost:5173`) |
| `SERVER_API_KEY` | Sì | — | Chiave API usata per autenticare le richieste esterne |
| `JWT_SECRET` | Sì | — | Segreto usato per firmare i token JWT |
| `LOG_LEVEL` | No | `info` | Livello di logging (`error`, `warn`, `info`, `debug`) |
| `LOG_FILE_PATH` | No | `logs/app.log` | Percorso del file di log applicativo |
| `ERROR_LOG_FILE_PATH` | No | `logs/error.log` | Percorso del file di log errori |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` (15 min) | Finestra temporale del rate limiter |
| `RATE_LIMIT_MAX` | No | `100` | Numero massimo di richieste per finestra |
| `ADMIN_EMAIL` | Sì^2^ | — | Email dell'admin per la creazione del primo utente |
| `ADMIN_PASSWORD` | Sì^2^ | — | Password dell'admin per la creazione del primo utente |
| `PROJECT_PREFIXES` | No | `fm-` | Prefissi dei repository da sincronizzare, separati da virgola |
| `SCREENSHOTS_DIR` | No | `./public/screenshots` | Directory dove salvare gli screenshot dei progetti |
| `SYNC_CRON` | No | `0 * * * *` | Espressione cron per la sincronizzazione automatica (default: ogni ora) |

1: obbligatoria in produzione, facoltativa in sviluppo.
2: usate dal seeder per creare l'utente amministratore iniziale.

## Avvio

```bash
# Sviluppo (hot reload)
pnpm dev

# Produzione
pnpm build
pnpm start
```

## Autenticazione

Il server usa un'autenticazione a due livelli.

### 1. API key

Inviata nell'header `x-api-key`. Serve per associare la richiesta a un client autorizzato.

### 2. Token JWT

Ottenuto dal login e inviato nell'header `Authorization` con prefisso `Bearer`. Ha validità 24 ore.

```text
x-api-key: <SERVER_API_KEY>
Authorization: Bearer <token-jwt>
```

> Le rotte pubbliche (`GET`) non richiedono autenticazione. Le rotte di scrittura richiedono entrambi i livelli.

## Endpoint

### `GET /`

Health check del server.

**Risposta — 200**

```json
{
  "status": "ok"
}
```

### `GET /api/projects`

Recupero di tutti i progetti dal database. Pubblica.

**Risposta — 200**

```json
[
  {
    "name": "nome-progetto",
    "description": "descrizione del progetto",
    "technologies": ["tech1", "tech2"],
    "imagesUrl": ["/screenshots/nome-progetto/uno.webp"],
    "repoUrl": "https://github.com/Smailen5/nome-progetto",
    "version": "1.0.0",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "readmeContent": "contenuto markdown del readme"
  }
]
```

### `GET /api/projects/:id`

Recupero di un singolo progetto per ID (ObjectId MongoDB). Pubblica.

**Risposta — 200**: singolo oggetto progetto, formato identico a quello sopra.

**Risposta — 404**

```json
{
  "message": "Progetto non trovato"
}
```

### `POST /api/projects`

Crea un nuovo progetto. Protetta (richiede API key + JWT).

**Headers**

```text
x-api-key: <SERVER_API_KEY>
Authorization: Bearer <token-jwt>
```

**Body**

```json
{
  "name": "nome-progetto",
  "description": "descrizione del progetto",
  "repoUrl": "https://github.com/Smailen5/nome-progetto",
  "images": ["/screenshots/nome-progetto/uno.webp"],
  "technologies": ["tech1", "tech2"],
  "readme": "contenuto markdown del readme"
}
```

**Risposta — 201**: oggetto progetto creato.

### `PUT /api/projects/:id`

Aggiorna un progetto esistente. Protetta (richiede API key + JWT).

Solo i campi da modificare devono essere presenti nel body (stessi campi di `POST`).

**Risposta — 200**: oggetto progetto aggiornato.

**Risposta — 404**

```json
{
  "message": "Project non trovato"
}
```

### `DELETE /api/projects/:id`

Elimina un progetto esistente. Protetta (richiede API key + JWT).

**Risposta — 200**

```json
{
  "message": "Project eliminato"
}
```

**Risposta — 404**

```json
{
  "message": "Project non trovato"
}
```

### `POST /api/users/login`

Autenticazione per ottenere il token JWT.

**Body**

```json
{
  "email": "email-utente",
  "password": "password-utente"
}
```

**Risposta — 200**

```json
{
  "token": "token-jwt"
}
```

**Risposta — 401**

```json
{
  "message": "Credenziali non valide"
}
```

### `GET /api/github/repos`

Elenco dei repository GitHub che soddisfano i prefissi configurati, con le informazioni dei rispettivi `package.json`. Pubblica. La risposta è memorizzata in cache per 5 minuti.

**Risposta — 200**

```json
[
  {
    "name": "nome-progetto",
    "description": "descrizione dal package.json",
    "url": "https://github.com/Smailen5/nome-progetto",
    "technologies": ["tech1", "tech2"],
    "updated_at": "2025-01-20T10:00:00.000Z"
  }
]
```

### `PUT /api/github/sync`

Avvia la sincronizzazione manuale dei repository con il database. Protetta (richiede API key + JWT).

**Risposta — 200**

```json
{
  "message": "Sincronizzati 33 progetti con successo",
  "totalProjects": 33,
  "syncedProjects": 33,
  "errors": [],
  "projects": ["nome-progetto-1", "nome-progetto-2"]
}
```

> La sincronizzazione avviene anche in automatico: all'avvio del server e secondo l'espressione cron `SYNC_CRON` (default: ogni ora). Vedi [Creare nuovi progetti](creare-progetti.md).

## Gestione degli errori

Le API restituiscono i seguenti codici di stato:

- `200` — Operazione riuscita
- `201` — Risorsa creata
- `400` — Richiesta non valida (validazione fallita)
- `401` — Non autorizzato (API key o JWT mancante o scaduto)
- `404` — Risorsa non trovata
- `500` — Errore del server

In caso di errore, la risposta ha questo formato:

```json
{
  "message": "Messaggio di errore",
  "errors": ["Dettaglio errore 1", "Dettaglio errore 2"]
}
```

## Rate limiting

Tutte le richieste sono limitate dal rate limiter globale (default: 100 richieste per 15 minuti, configurabile con `RATE_LIMIT_WINDOW_MS` e `RATE_LIMIT_MAX`). Il login ha una protezione dedicata con limiti più severi.

Superato il limite, il server risponde con stato `429` (Too Many Requests).