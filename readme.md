# Portfolio Server API

Server backend per la gestione dei progetti del portfolio.

## API Endpoints

### Progetti

#### GET /api/projects

Recupera tutti i progetti dal database.

**Risposta**

```json
{
  "projects": [
    {
      "id": 1,
      "name": "nome-progetto",
      "description": "descrizione del progetto",
      "image": "url-immagine",
      "technologies": ["tech1", "tech2"],
      "readme": "contenuto markdown del readme",
      "createdAt": "2024-03-20T...",
      "updatedAt": "2024-03-20T..."
    }
  ]
}
```

#### GET /api/projects/:id

Recupera un singolo progetto per ID dal database.

**Risposta**

```json
{
  "id": 1,
  "name": "nome-progetto",
  "description": "descrizione del progetto",
  "image": "url-immagine",
  "technologies": ["tech1", "tech2"],
  "readme": "contenuto markdown del readme",
  "createdAt": "2024-03-20T...",
  "updatedAt": "2024-03-20T..."
}
```

### Sincronizzazione GitHub

#### PUT /api/github/sync

Sincronizza i progetti dal repository GitHub con il database.

**Headers richiesti**

```
x-auth-token: your_secret_auth_token
```

**Risposta**

```json
{
  "message": "Sincronizzati X progetti con successo",
  "totalProjects": 33,
  "syncedProjects": 33,
  "errors": [],
  "projects": ["nome-progetto-1", "nome-progetto-2"]
}
```

## Gestione degli Errori

Le API restituiscono i seguenti codici di stato:

- 200: Successo
- 400: Richiesta non valida
- 401: Non autorizzato
- 404: Risorsa non trovata
- 500: Errore del server

In caso di errore, la risposta avrà questo formato:

```json
{
  "message": "Messaggio di errore",
  "errors": ["Dettaglio errore 1", "Dettaglio errore 2"]
}
```

## Sviluppo

Per avviare il server in modalità sviluppo:

```bash
pnpm run dev
```

Per la produzione:

```bash
pnpm start
```
