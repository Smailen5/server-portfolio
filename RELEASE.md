# Processo di Release

## Fine Giornata di Sviluppo

1. **Commit delle modifiche**

   ```bash
   git add .
   git commit -m "feat: descrizione delle modifiche"
   ```

2. **Creazione nuova versione**

   ```bash
   pnpm release
   # Questo comando:
   # - Incrementa la versione in package.json
   # - Crea il changelog
   # - Crea il tag in locale
   # - Fa il commit delle modifiche
   ```

## Giorno Successivo

1. **Verifica funzionalità**

   - Test manuali delle nuove feature
   - Verifica che tutto funzioni correttamente
   - Controllo errori nel server

2. **Se tutto ok, procedi con il merge**

   ```bash
   git checkout main
   git merge develop  # o il branch su cui stavi lavorando
   ```

3. **Push in ordine**

   ```bash
   # 1. Prima pushi il main
   git push origin main

   # 2. Poi pushi il tag
   git push origin v1.1.0  # usa il numero di versione corretto
   ```

## Comandi Utili

- **Verifica tag locali**

  ```bash
  git tag -l
  ```

- **Verifica tag remoti**

  ```bash
  git ls-remote --tags origin
  ```

- **Eliminare un tag locale**

  ```bash
  git tag -d v1.1.0
  ```

- **Eliminare un tag remoto**

  ```bash
  git push origin --delete v1.1.0
  ```

- **Rollback a una versione precedente**
  ```bash
  git checkout v1.1.0
  ```

## Note Importanti

- I tag vengono creati in locale da standard-version
- I tag vanno pushati manualmente su GitHub
- L'ordine corretto è: push main -> push tag
- Mantieni sempre una versione stabile su main
- Usa i branch per lo sviluppo di nuove feature
- Testa sempre prima di fare il merge su main
