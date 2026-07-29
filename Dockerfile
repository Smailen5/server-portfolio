# ==================================================
# Stage 1: Builder (compila TypeScript)
# ==================================================
FROM node:24-alpine AS builder

# Imposta directory di lavoro
WORKDIR /app

# Abilita pnpm via corepack
RUN corepack enable

# Copia SOLO file dipendenze (per caching)
COPY package.json pnpm-lock.yaml ./

# Installa TUTTE le dipendenze (dev + prod)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copia source code
COPY src/ ./src/
COPY tsconfig.json ./

# Compila TypeScript -> genera dist/
RUN pnpm build

# ==================================================
# Stage 2: Production (solo runtime)
# ==================================================
FROM node:24-alpine

# Installa dipendenze di sistema per sharp
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Abilita pnpm
RUN corepack enable

# Copia file dipendenze
COPY package.json pnpm-lock.yaml ./

# Installa SOLO dipendenze produzione
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copia build output dallo stage builder
COPY --from=builder /app/dist/ ./dist/

# Crea cartella per screenshots
RUN mkdir -p public/screenshots

# Crea cartella per i logs
RUN mkdir -p logs

# Documenta porta (non fa forwarding)
EXPOSE 3000

# Comando eseguito all'avvio del container
CMD ["node", "dist/index.js"]