# Portfolio Server API

![Release](https://img.shields.io/github/v/release/Smailen5/server-portfolio)
![Last commit](https://img.shields.io/github/last-commit/Smailen5/server-portfolio)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6)
![Test](https://img.shields.io/badge/tests-vitest-6e7687)

Backend del mio portfolio personale: un'API REST che espone i progetti, li mantiene sincronizzati con GitHub in automatico e li serve al sito con standard di produzione.

## Punti di forza

### Sicurezza
- Autenticazione a due livelli: **API key** (`x-api-key`) + **JWT** (`Authorization: Bearer`)
- Header protetti con **Helmet** e politiche CORS configurate
- **Rate limiting** su tutte le richieste e protezione dedicata sul login
- Validazione rigida dell'input con `express-validator`, niente dati non verificati
- Password hashate con `bcrypt`, variabili sensibili solo via `.env`

### Qualità del codice
- **TypeScript strict** con tipizzazione completa di modelli, servizi e middleware
- **Test con Vitest** (unit e integrazione) con coverage
- **ESLint + Prettier** per stile e best practice
- **Commit convenzionali** con commitlint e hook Husky
- **CI su GitHub Actions**: lint + build + test su ogni pull request

### Architettura
- Pattern a livelli: `routes` → `controllers` → `services` → `models`
- Logging strutturato con **Winston** + **Morgan** su file
- **Sincronizzazione automatica** con GitHub: i nuovi progetti entrano nel portfolio da soli

## Stack

| Area | Tecnologie |
|------|------------|
| Runtime | Node.js, TypeScript |
| Framework | Express 5 |
| Database | MongoDB con Mongoose |
| Autenticazione | API key + JWT (jsonwebtoken, bcrypt) |
| Integrazione | Octokit (GitHub API) |
| Sicurezza | Helmet, express-rate-limit, CORS |
| Qualità | Vitest, ESLint, Prettier, commitlint, Husky |
| Operazioni | Docker, pnpm |

## Struttura del progetto

```
src/
├── config/       # Configurazione, logging, connessione MongoDB
├── controllers/  # Gestione delle richieste HTTP
├── middleware/   # Auth, validazione, rate limiting, gestione errori
├── models/       # Modelli Mongoose
├── routes/       # Definizione delle rotte
├── services/     # Logica di business (sync GitHub, immagini, progetti)
├── types/        # Tipi condivisi
└── utils/        # Utility (cache, client Octokit)
```

## Avvio rapido

```bash
# 1. Installa le dipendenze
pnpm install

# 2. Configura le variabili d'ambiente
cp .env.example .env

# 3. Avvia in sviluppo
pnpm dev
```

Il server è in ascolto su `http://localhost:3000` (o sulla porta configurata).

## Comandi utili

```bash
pnpm dev            # Avvio in sviluppo (hot reload)
pnpm lint           # Controllo stile e best practice
pnpm build          # Compilazione TypeScript
pnpm start          # Avvio in produzione (richiede la build)
pnpm test           # Esecuzione dei test
pnpm test:coverage  # Esecuzione dei test con report di coverage
```

## Documentazione

- [Documentazione tecnica](docs/README.md) — setup completo, endpoint e autenticazione
- [Creare nuovi progetti](docs/creare-progetti.md) — come aggiungere progetti al portfolio

## Licenza

Questo progetto è distribuito con licenza [MIT](LICENSE).