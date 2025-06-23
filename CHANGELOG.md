# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
