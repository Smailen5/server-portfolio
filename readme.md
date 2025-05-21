# Portfolio Server API

Server backend per la gestione dei progetti del portfolio.

## API Endpoints

### Autenticazione

#### POST /api/users/login

Autenticazione per l'accesso all'API.

**Risposta**

```json
{
  "token": "token-jwt"
}
```

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

#### POST /api/projects

Crea un nuovo progetto.

**Headers richiesti**

```
x-api-key: token-autenticazione-api
Authorization: Bearer token-jwt
```

**Risposta**

```json
{
  "message": "Progetto creato con successo",
  "project": {
    "id": 1,
    "name": "nome-progetto",
    "description": "descrizione del progetto",
    "image": "url-immagine",
    "technologies": ["tech1", "tech2"],
    "readme": "contenuto markdown del readme",
    "createdAt": "2024-03-20T...",
    "updatedAt": "2024-03-20T..."
  }
}
```

#### PUT /api/projects/:id

Aggiorna un progetto esistente.

**Headers richiesti**

```
x-api-key: token-autenticazione-api
Authorization: Bearer token-jwt
```

**Risposta**

```json
{
  "message": "Progetto aggiornato con successo",
  "project": {
    "id": 1,
    "name": "nome-progetto",
    "description": "descrizione del progetto",
    "image": "url-immagine",
    "technologies": ["tech1", "tech2"],
    "readme": "contenuto markdown del readme",
    "createdAt": "2024-03-20T...",
    "updatedAt": "2024-03-20T..."
  }
}
```

#### DELETE /api/projects/:id

Elimina un progetto esistente.

**Headers richiesti**

```
x-api-key: token-autenticazione-api
Authorization: Bearer token-jwt
```

**Risposta**

```json
{
  "message": "Progetto eliminato con successo"
}
```

### Sincronizzazione GitHub

#### PUT /api/github/sync

Sincronizza i progetti dal repository GitHub con il database.

**Headers richiesti**

```
x-api-key: token-autenticazione-api
Authorization: Bearer token-jwt
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
````

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
pnpm dev
```

Per la produzione:

```bash
pnpm start
```
