# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/Smailen5/server-portfolio/compare/server-portfolio-v2.0.0...server-portfolio-v3.0.0) (2026-06-10)


### ⚠ BREAKING CHANGES

* Il database è stato migrato da SQLite a MongoDB Atlas. Tutti i modelli e le query sono stati aggiornati per usare Mongoose invece di Sequelize. Le API mantengono la stessa interfaccia ma l'architettura del database è completamente cambiata.

### Features

* :sparkles: aggiunge cors ([455925f](https://github.com/Smailen5/server-portfolio/commit/455925f515f1051e9cbb6ab5c70f47ffdc8df569))
* :tada: inizializzato progetto ([6af4f91](https://github.com/Smailen5/server-portfolio/commit/6af4f91441043fae99c8e938f903286f6ca30ea8))
* :tada: inizio progetto ([a54bf8a](https://github.com/Smailen5/server-portfolio/commit/a54bf8ac4598325ff7f351d3f781687c3d1dec63))
* ✨ aggiunge la classe DbConnection per la connessione a MongoDB ([af3979e](https://github.com/Smailen5/server-portfolio/commit/af3979e29ea0a8403a34e7f4b8e4b3666417722e))
* ✨ aggiunge logica di inizializzazione per MongoDB ([825fb7c](https://github.com/Smailen5/server-portfolio/commit/825fb7c40ab66b24f200b6d49078f85914f65629))
* ✨ aggiunge modello Project per la gestione dei progetti in MongoDB ([73aca7c](https://github.com/Smailen5/server-portfolio/commit/73aca7cf45156b486372721ead47cc0a34fd4125))
* ✨ aggiunge modello User per la gestione degli utenti in MongoDB ([b2f9fcd](https://github.com/Smailen5/server-portfolio/commit/b2f9fcd06c82b6fbe57e752296e8b927a0a7cc26))
* ✨ migra da SQLite a MongoDB ([9de7814](https://github.com/Smailen5/server-portfolio/commit/9de781495f5eccb2d8cd0600e396371adc7f240b))
* ✨ modifica l'inizializzazione del database e aggiunge il logger ([0a71973](https://github.com/Smailen5/server-portfolio/commit/0a71973b4b250d4708d57da0897c50c77ae6b8d4))
* ✨ ordina i progetti per data di creazione ([e64900d](https://github.com/Smailen5/server-portfolio/commit/e64900d0bfffa16750eb52887c17f5c3dc79c6e9))


### Bug Fixes

* :bug: fix routes ([200c5f0](https://github.com/Smailen5/server-portfolio/commit/200c5f036ccefdbb388c69538a3e51bc8ad80963))
* 🐛 aggiorna il campo "updated_at" in getRepos ([35cd810](https://github.com/Smailen5/server-portfolio/commit/35cd810d6f8d1e44b2d1f986cef3faedba17aa7c))
* 🐛 corregge il tipo di porta nel server ([88df076](https://github.com/Smailen5/server-portfolio/commit/88df076a632baf06c91ee669d1ae6ada95f5b6f8))
* 🐛 migliora la gestione degli errori ([f8edbc0](https://github.com/Smailen5/server-portfolio/commit/f8edbc03a2496c3e17eeba1b25d156c902d69b05))
* 🐛 modifica i tipi di campo in GitHubContent ([2e5a9d7](https://github.com/Smailen5/server-portfolio/commit/2e5a9d7afc217b71d89066a42f1249b4f1f3371d))
* 🔧 aggiorna la logica di autenticazione degli utenti ([b8b312e](https://github.com/Smailen5/server-portfolio/commit/b8b312e35e4e085bf5d77750e6acc1614079db91))
* 🔧 aggiorna la logica di sincronizzazione dei progetti in syncRepos ([2975b06](https://github.com/Smailen5/server-portfolio/commit/2975b065a6ca15f0bce2dc1730d6b53a9fca9075))
* 🔧 aggiorna le importazioni e la logica di accesso ai progetti ([f1da3e7](https://github.com/Smailen5/server-portfolio/commit/f1da3e74aa61271a2a300fd851f2fd0788f9823c))
* 🔧 aggiorna lo script di commit-msg per utilizzare bash ([9253735](https://github.com/Smailen5/server-portfolio/commit/9253735c913c896ff1985b8e22ee56ec6cc6158e))
* 🔧 aggiorna ricerca utente con sintassi MongoDB ([bec7939](https://github.com/Smailen5/server-portfolio/commit/bec793912ae51dc6214f7f4eef3d14b250be7ae6))
* 🔧 aggiunge logica per la creazione dell'utente amministratore ([63bd793](https://github.com/Smailen5/server-portfolio/commit/63bd793d871cc7fc6b9427b6ab6fc1a1e19ba195))
* 🔧 aggiunge nome all'utente amministratore durante la creazione ([b1beaa3](https://github.com/Smailen5/server-portfolio/commit/b1beaa3125d9a98e3c14afede5cb62a8cc60cf85))
* 🔧 commenta la connessione a MongoDB e aggiorna l'inizializzazione ([0c5f371](https://github.com/Smailen5/server-portfolio/commit/0c5f371b52ab3e207917a416308c5ab3fcaa9768))
* 🔧 corregge l'importazione del modello User ([f58faea](https://github.com/Smailen5/server-portfolio/commit/f58faeabb5691050db92991c462a029ceff561d2))
* 🔧 semplifica la query per ottenere tutti i progetti ([2dbe51e](https://github.com/Smailen5/server-portfolio/commit/2dbe51e39e03403ac49531dbe6dd5b54ead63f07))
* 🔧 semplifica la ricerca dell'utente nella logica di autenticazione ([41e3497](https://github.com/Smailen5/server-portfolio/commit/41e3497157614d8734d202525f3b423c27b0103d))
* 🔧 sostituisce la logica di connessione a MongoDB con Mongoose ([6d9e1b8](https://github.com/Smailen5/server-portfolio/commit/6d9e1b8755ff0991bfcc3473ddfd6ff6fe42caa1))


### Documentation

* :see_no_evil: aggiorna gitignore ([57fd221](https://github.com/Smailen5/server-portfolio/commit/57fd221e576641c3452fff3c0f37e313295977d0))
* 📝 aggiorna il readme con la sezione Licenza ([b0b8ab1](https://github.com/Smailen5/server-portfolio/commit/b0b8ab1673873d4e6aaf09e66532ef1eeb21fdfb))
* 📝 aggiunge il documento di processo di release ([95be633](https://github.com/Smailen5/server-portfolio/commit/95be63324308ebe578d1d49e7caee381de5488f8))


### Chores

* ➕ aggiunge la dipendenza "mongodb" nel file package.json ([c653478](https://github.com/Smailen5/server-portfolio/commit/c6534782423499633a850ad1321174ec2707f986))
* ➕ aggiunge la dipendenza "mongoose" nel file package.json ([9f33ac4](https://github.com/Smailen5/server-portfolio/commit/9f33ac42621945cc18c618645e3ba9a45745be86))
* ➕ aggiunge la variabile di ambiente "dbConnection" nel file env ([7179546](https://github.com/Smailen5/server-portfolio/commit/71795466ad61588b4c047b3b61bdd4bc80c41cb5))
* ➕ aggiunge standard-version come dipendenza nel file package.json ([3c11450](https://github.com/Smailen5/server-portfolio/commit/3c11450a839aa5e2939df658de1baa35be2464b2))
* 📃 aggiunge script di rilascio nel file package.json ([3e0853e](https://github.com/Smailen5/server-portfolio/commit/3e0853ee159f60a752bd02b06cc3fe990487f553))
* 📦 aggiorna pnpm-lock.yaml con nuove dipendenze ([9f93f79](https://github.com/Smailen5/server-portfolio/commit/9f93f7994c5af1d2c3427b83ca9297365ae38e1b))
* 📦 aggiorna pnpm-lock.yaml con nuove dipendenze e versioni ([348ee26](https://github.com/Smailen5/server-portfolio/commit/348ee2674da3a9a864e6b7681b6f3507b7e5f689))
* 📦 aggiorna pnpm-lock.yaml con nuove dipendenze e versioni ([f539053](https://github.com/Smailen5/server-portfolio/commit/f539053e1720a532af0a66bbf3844288b41c2a8d))
* 🔥 rimuove esportazioni obsolete nel file di configurazione ([350e07f](https://github.com/Smailen5/server-portfolio/commit/350e07fdd47f6766c8940875ce4e8827c695f560))
* 🔥 rimuove i modelli e le configurazioni obsolete per Sequelize ([e6a8632](https://github.com/Smailen5/server-portfolio/commit/e6a8632ee9ca9f9017a977ad162676c8a58f1dd3))
* 🔧 aggiorna configurazione TypeScript ([87fe039](https://github.com/Smailen5/server-portfolio/commit/87fe0399d76c894767f466bf79f5bfa8cf58fb62))
* 🔧 aggiorna il campo "main" in package.json ([b1569e2](https://github.com/Smailen5/server-portfolio/commit/b1569e2d59ae6eba486d3fd86dcfe368b117c7c7))
* 🔧 aggiorna la lunghezza massima delle righe del messaggio ([967126c](https://github.com/Smailen5/server-portfolio/commit/967126cf6b620fcd09ff452a12ebbe7afdf5be57))
* 🔧 aggiorna la versione di octokit ([8209316](https://github.com/Smailen5/server-portfolio/commit/8209316270f8726d9fece5bf5e5c6456fd7fcfa8))
* 🔧 aggiorna le dipendenze nel file package.json e pnpm-lock.yaml ([4c95d7c](https://github.com/Smailen5/server-portfolio/commit/4c95d7c5c2a7360ef7988bddb7bcb56246c9aeb7))
* 🔧 aggiunge comandi di build e avvio nel file package.json ([ad7d25c](https://github.com/Smailen5/server-portfolio/commit/ad7d25cd53d32a5403b0ccacc4c344ae5a619045))
* 🔧 aggiunge configurazione per Commitlint ([4766b08](https://github.com/Smailen5/server-portfolio/commit/4766b08c9e3a33a8a6a9cb7c4837e77ce52692a6))
* 🔧 aggiunge Husky e Commitlint per la gestione dei commit ([b2fc826](https://github.com/Smailen5/server-portfolio/commit/b2fc826fcae93334db830ff73b75c0f62cfebb18))
* 🔧 aggiunge la proprietà 'private' a package.json ([2fa5772](https://github.com/Smailen5/server-portfolio/commit/2fa57725da0d0dae3ee0c3ded95ef96f8fbb702c))
* 🔧 modifica la configurazione del logger per l'ambiente sviluppo ([c4dfec9](https://github.com/Smailen5/server-portfolio/commit/c4dfec968cd4cb016d90dc35191851f83a634a3e))
* 🗑️ rimuove dipendenze obsolete dal pnpm-lock.yaml ([2ba0243](https://github.com/Smailen5/server-portfolio/commit/2ba02432a9723d82ea6b6bccf1dc7b96b93346f8))
* 🗑️ rimuove importazione non utilizzata in initDb.ts ([218725d](https://github.com/Smailen5/server-portfolio/commit/218725dcb3de497c8d72c42e66ae23ce7e5b8698))
* 🗑️ rimuove la migrazione ([77f16f7](https://github.com/Smailen5/server-portfolio/commit/77f16f7c87a09f8aed77b1e8b3e3a1454cece750))
* 🗑️ rimuove le dipendenze "sequelize" e "sqlite3" dal package ([8c1c0e7](https://github.com/Smailen5/server-portfolio/commit/8c1c0e738167ca973754c570af3b0d512f2c018a))
* 🧹 aggiorna il comando "prepare" in package.json per Husky ([06c6c6b](https://github.com/Smailen5/server-portfolio/commit/06c6c6b53419bde8b9bba8e4c0ca7f1f0e9c539e))
* 🧹 aggiorna la configurazione di Husky e Commitlint ([3409340](https://github.com/Smailen5/server-portfolio/commit/34093400a81c922ab8a59755b09566e9d084542f))
* **release:** 1.1.0 ([6d3f617](https://github.com/Smailen5/server-portfolio/commit/6d3f617d4552d444fb40a838ffd02efa271ca0a4))
* **release:** 2.0.0 ([80b20aa](https://github.com/Smailen5/server-portfolio/commit/80b20aa23a0aa081df60f5803de85d7fc22d7cbc))
* sostituisce standard-version con release-please ([#7](https://github.com/Smailen5/server-portfolio/issues/7)) ([b3e3497](https://github.com/Smailen5/server-portfolio/commit/b3e3497630da818727aea54cd3aed39412f143c1))
* ultima PR da DEV prima del nuovo workflow su main ([#6](https://github.com/Smailen5/server-portfolio/issues/6)) ([fbeb57d](https://github.com/Smailen5/server-portfolio/commit/fbeb57d630d6586b0807008bc42aa31c07a4a603))


### Refactoring

* :construction: aggiorna Middleware ([c5f8ab3](https://github.com/Smailen5/server-portfolio/commit/c5f8ab382645a1e06de4fb88f0ca2d11897abcdd))
* :fire: rimuove codice ([63fc85b](https://github.com/Smailen5/server-portfolio/commit/63fc85b4ecfb30b1f70b8da782c738c68098669d))
* corregge errore battitura ([186e86f](https://github.com/Smailen5/server-portfolio/commit/186e86f3be472f74f447a09e116a3611d6062594))


### Build

* :construction: aggiugne crea progetto ([f81332d](https://github.com/Smailen5/server-portfolio/commit/f81332d5d16470d1679bb997421ffef35bb93cef))
* :construction: aggiugne route ([2bc4619](https://github.com/Smailen5/server-portfolio/commit/2bc4619170f95545c0b55ed1d744353bcd28f79b))
* :construction: aggiunge schema ([5afedcd](https://github.com/Smailen5/server-portfolio/commit/5afedcd4aaa0cf1c17741d0f6e143372b9e8a00a))
* :construction: aggiunge server ([85250cc](https://github.com/Smailen5/server-portfolio/commit/85250cc209c4c3bb39f0e30eaca1b618677a7a10))
* :construction: fix bug ([8802449](https://github.com/Smailen5/server-portfolio/commit/8802449a7818d3014a1e25d110021f5e7a501bdf))
* :construction: test server ([131152b](https://github.com/Smailen5/server-portfolio/commit/131152bca76a0e29444d816abc684dce0c373cd5))
* :see_no_evil: aggiorna gitignore ([7e72548](https://github.com/Smailen5/server-portfolio/commit/7e725486285c4980146c61135597a47db0fc3321))
* :see_no_evil: aggiunge gitignore ([2c33326](https://github.com/Smailen5/server-portfolio/commit/2c33326dd2adcf82e3247f3c8ef4f3614f6e24ee))
* :seedling: aggiunge server.js ([402b717](https://github.com/Smailen5/server-portfolio/commit/402b717d720ef8fd943a8182ac05bc3328a37e83))
* :seedling: crea file project.js ([f078ba8](https://github.com/Smailen5/server-portfolio/commit/f078ba842adc99bf96554a24d626def08c2bc093))
* :truck: aggiunge update e delete ([0a06089](https://github.com/Smailen5/server-portfolio/commit/0a06089e278d92f1a5b0d345fdb0844425d533b5))
* :truck: crea route ([c4251ff](https://github.com/Smailen5/server-portfolio/commit/c4251ff98c90f702e9ca7d2d64c69668ec33b540))
* :truck: sposta uri ([0cc6f95](https://github.com/Smailen5/server-portfolio/commit/0cc6f95030ef60fc31b10ee5fbae457d516d2a7e))

## [2.0.0](https://github.com/Smailen5/server-portfolio/compare/v1.1.0...v2.0.0) (2025-06-23)


### ⚠ BREAKING CHANGES

* Il database è stato migrato da SQLite a MongoDB Atlas.
Tutti i modelli e le query sono stati aggiornati per usare Mongoose invece di Sequelize.
Le API mantengono la stessa interfaccia ma l'architettura del database è completamente cambiata.

### Features

* ✨ aggiunge la classe DbConnection per la connessione a MongoDB ([af3979e](https://github.com/Smailen5/server-portfolio/commit/af3979e29ea0a8403a34e7f4b8e4b3666417722e))
* ✨ aggiunge logica di inizializzazione per MongoDB ([825fb7c](https://github.com/Smailen5/server-portfolio/commit/825fb7c40ab66b24f200b6d49078f85914f65629))
* ✨ aggiunge modello Project per la gestione dei progetti in MongoDB ([73aca7c](https://github.com/Smailen5/server-portfolio/commit/73aca7cf45156b486372721ead47cc0a34fd4125))
* ✨ aggiunge modello User per la gestione degli utenti in MongoDB ([b2f9fcd](https://github.com/Smailen5/server-portfolio/commit/b2f9fcd06c82b6fbe57e752296e8b927a0a7cc26))
* ✨ migra da SQLite a MongoDB ([9de7814](https://github.com/Smailen5/server-portfolio/commit/9de781495f5eccb2d8cd0600e396371adc7f240b))
* ✨ modifica l'inizializzazione del database e aggiunge il logger ([0a71973](https://github.com/Smailen5/server-portfolio/commit/0a71973b4b250d4708d57da0897c50c77ae6b8d4))


### Bug Fixes

* 🔧 aggiorna la logica di autenticazione degli utenti ([b8b312e](https://github.com/Smailen5/server-portfolio/commit/b8b312e35e4e085bf5d77750e6acc1614079db91))
* 🔧 aggiorna la logica di sincronizzazione dei progetti in syncRepos ([2975b06](https://github.com/Smailen5/server-portfolio/commit/2975b065a6ca15f0bce2dc1730d6b53a9fca9075))
* 🔧 aggiorna le importazioni e la logica di accesso ai progetti ([f1da3e7](https://github.com/Smailen5/server-portfolio/commit/f1da3e74aa61271a2a300fd851f2fd0788f9823c))
* 🔧 aggiorna lo script di commit-msg per utilizzare bash ([9253735](https://github.com/Smailen5/server-portfolio/commit/9253735c913c896ff1985b8e22ee56ec6cc6158e))
* 🔧 aggiorna ricerca utente con sintassi MongoDB ([bec7939](https://github.com/Smailen5/server-portfolio/commit/bec793912ae51dc6214f7f4eef3d14b250be7ae6))
* 🔧 aggiunge logica per la creazione dell'utente amministratore ([63bd793](https://github.com/Smailen5/server-portfolio/commit/63bd793d871cc7fc6b9427b6ab6fc1a1e19ba195))
* 🔧 aggiunge nome all'utente amministratore durante la creazione ([b1beaa3](https://github.com/Smailen5/server-portfolio/commit/b1beaa3125d9a98e3c14afede5cb62a8cc60cf85))
* 🔧 commenta la connessione a MongoDB e aggiorna l'inizializzazione ([0c5f371](https://github.com/Smailen5/server-portfolio/commit/0c5f371b52ab3e207917a416308c5ab3fcaa9768))
* 🔧 corregge l'importazione del modello User ([f58faea](https://github.com/Smailen5/server-portfolio/commit/f58faeabb5691050db92991c462a029ceff561d2))
* 🔧 semplifica la query per ottenere tutti i progetti ([2dbe51e](https://github.com/Smailen5/server-portfolio/commit/2dbe51e39e03403ac49531dbe6dd5b54ead63f07))
* 🔧 semplifica la ricerca dell'utente nella logica di autenticazione ([41e3497](https://github.com/Smailen5/server-portfolio/commit/41e3497157614d8734d202525f3b423c27b0103d))
* 🔧 sostituisce la logica di connessione a MongoDB con Mongoose ([6d9e1b8](https://github.com/Smailen5/server-portfolio/commit/6d9e1b8755ff0991bfcc3473ddfd6ff6fe42caa1))

## 1.1.0 (2025-06-13)


### Features

* :sparkles: aggiunge cors ([455925f](https://github.com/Smailen5/server-portfolio/commit/455925f515f1051e9cbb6ab5c70f47ffdc8df569))
* :tada: inizializzato progetto ([6af4f91](https://github.com/Smailen5/server-portfolio/commit/6af4f91441043fae99c8e938f903286f6ca30ea8))
* :tada: inizio progetto ([a54bf8a](https://github.com/Smailen5/server-portfolio/commit/a54bf8ac4598325ff7f351d3f781687c3d1dec63))
* ✨ ordina i progetti per data di creazione ([e64900d](https://github.com/Smailen5/server-portfolio/commit/e64900d0bfffa16750eb52887c17f5c3dc79c6e9))


### Bug Fixes

* :bug: fix routes ([200c5f0](https://github.com/Smailen5/server-portfolio/commit/200c5f036ccefdbb388c69538a3e51bc8ad80963))
* 🐛 aggiorna il campo "updated_at" in getRepos ([35cd810](https://github.com/Smailen5/server-portfolio/commit/35cd810d6f8d1e44b2d1f986cef3faedba17aa7c))
* 🐛 corregge il tipo di porta nel server ([88df076](https://github.com/Smailen5/server-portfolio/commit/88df076a632baf06c91ee669d1ae6ada95f5b6f8))
* 🐛 migliora la gestione degli errori ([f8edbc0](https://github.com/Smailen5/server-portfolio/commit/f8edbc03a2496c3e17eeba1b25d156c902d69b05))
* 🐛 modifica i tipi di campo in GitHubContent ([2e5a9d7](https://github.com/Smailen5/server-portfolio/commit/2e5a9d7afc217b71d89066a42f1249b4f1f3371d))
