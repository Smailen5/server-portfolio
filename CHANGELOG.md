# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/Smailen5/server-portfolio/compare/v2.0.8...v2.1.0) (2026-07-01)


### Features

* aggiunge cache in-memory getRepos ([#112](https://github.com/Smailen5/server-portfolio/issues/112)) ([5ebe920](https://github.com/Smailen5/server-portfolio/commit/5ebe9208a993c59cd383c56f6a287ef0be4523f0))


### Bug Fixes

* aggiunge graceful shutdown ([#111](https://github.com/Smailen5/server-portfolio/issues/111)) ([68af2bf](https://github.com/Smailen5/server-portfolio/commit/68af2bf5723417709f62ba9bb4fdeb9580d0312d))
* nasconde password nelle query User ([#109](https://github.com/Smailen5/server-portfolio/issues/109)) ([a0b41e1](https://github.com/Smailen5/server-portfolio/commit/a0b41e1db80912671b4a2385976ac2e3e32515e6))
* valida env mancanti all'avvio ([#110](https://github.com/Smailen5/server-portfolio/issues/110)) ([e09fb25](https://github.com/Smailen5/server-portfolio/commit/e09fb254f07391caf6c12368b01f8a8f4055bb36))


### Documentation

* aggiunge Project Board in AGENTS.md ([#107](https://github.com/Smailen5/server-portfolio/issues/107)) ([c83c5ad](https://github.com/Smailen5/server-portfolio/commit/c83c5ada9199e38fec6858bd922bdc88e43e1389))

## [2.0.8](https://github.com/Smailen5/server-portfolio/compare/v2.0.7...v2.0.8) (2026-06-30)


### Documentation

* aggiunge commenti nel test login ([#101](https://github.com/Smailen5/server-portfolio/issues/101)) ([22fa27b](https://github.com/Smailen5/server-portfolio/commit/22fa27be2a75ff01195f5d816bed064b5e9f4c6e))


### Chores

* aggiorna convenzioni progetto ([#97](https://github.com/Smailen5/server-portfolio/issues/97)) ([67a4195](https://github.com/Smailen5/server-portfolio/commit/67a419505b4b40c22b5a0b06ba5a1fed5cd4f89a))


### Refactoring

* estrae runValidation in helper ([#102](https://github.com/Smailen5/server-portfolio/issues/102)) ([0dbe038](https://github.com/Smailen5/server-portfolio/commit/0dbe0387f4861a42931e603eb3520e5ffeb59771))
* separa validatori in file propri ([#92](https://github.com/Smailen5/server-portfolio/issues/92)) ([90bbe1e](https://github.com/Smailen5/server-portfolio/commit/90bbe1e6fe4b53bef810a689aa1e5f9344a811bf))


### Tests

* aggiunge test per validatorsLogin ([#99](https://github.com/Smailen5/server-portfolio/issues/99)) ([0e8a796](https://github.com/Smailen5/server-portfolio/commit/0e8a796287c8b3e889f31c9c176c686549ba4237))
* copre gap nei test dei validatori ([#100](https://github.com/Smailen5/server-portfolio/issues/100)) ([020bbe2](https://github.com/Smailen5/server-portfolio/commit/020bbe24be1156428d0a05fec6699251eb5485bc))

## [2.0.7](https://github.com/Smailen5/server-portfolio/compare/v2.0.6...v2.0.7) (2026-06-26)


### Chores

* aggiorna dipendenze post esm ([#90](https://github.com/Smailen5/server-portfolio/issues/90)) ([1401b9f](https://github.com/Smailen5/server-portfolio/commit/1401b9fca178cddb1a0bdeb57a4b4873a07fc837))
* aggiorna mongoose v9 ([#84](https://github.com/Smailen5/server-portfolio/issues/84)) ([cf31729](https://github.com/Smailen5/server-portfolio/commit/cf31729172308bc80115c7ee03a14ab5d61000d0))


### Refactoring

* converte progetto a ESM ([#89](https://github.com/Smailen5/server-portfolio/issues/89)) ([a2d2cb0](https://github.com/Smailen5/server-portfolio/commit/a2d2cb0044e506cf814c91a3e5b101154403c564))
* estrae GitHubService ([#85](https://github.com/Smailen5/server-portfolio/issues/85)) ([b6ea2c3](https://github.com/Smailen5/server-portfolio/commit/b6ea2c3514dc233b85a40393fedafa40777a78aa))
* estrae ProjectService dai CRUD ([#91](https://github.com/Smailen5/server-portfolio/issues/91)) ([edbeed1](https://github.com/Smailen5/server-portfolio/commit/edbeed1acc0bc924e5dd291b3d294a7cd830ceab))

## [2.0.6](https://github.com/Smailen5/server-portfolio/compare/v2.0.5...v2.0.6) (2026-06-15)


### Chores

* aggiorna express a v5 ([#83](https://github.com/Smailen5/server-portfolio/issues/83)) ([28c2939](https://github.com/Smailen5/server-portfolio/commit/28c2939c90bc606b50f9f44a9e746d29b7baba81))


### Refactoring

* condivide istanza Octokit ([#82](https://github.com/Smailen5/server-portfolio/issues/82)) ([c8de0eb](https://github.com/Smailen5/server-portfolio/commit/c8de0eb2cdb909ad77ab25b20b1c6e948412347b))


### Tests

* rimuove test di esempio ([#80](https://github.com/Smailen5/server-portfolio/issues/80)) ([1170ea2](https://github.com/Smailen5/server-portfolio/commit/1170ea22f2ca74210967b0f9d12acfcd5a1958f1))

## [2.0.5](https://github.com/Smailen5/server-portfolio/compare/v2.0.4...v2.0.5) (2026-06-12)


### Bug Fixes

* crash CI per appLogger ([#77](https://github.com/Smailen5/server-portfolio/issues/77)) ([57a86f4](https://github.com/Smailen5/server-portfolio/commit/57a86f4fe09234090619f5a527d98159ed0a6dc4))


### CI/CD

* ottimizza CI e aggiunge test ([#76](https://github.com/Smailen5/server-portfolio/issues/76)) ([4336675](https://github.com/Smailen5/server-portfolio/commit/43366758bd918704297789d37bdd187b8f6d7ee2))

## [2.0.4](https://github.com/Smailen5/server-portfolio/compare/v2.0.3...v2.0.4) (2026-06-12)


### Chores

* rimuove commenti ([#72](https://github.com/Smailen5/server-portfolio/issues/72)) ([e9cf383](https://github.com/Smailen5/server-portfolio/commit/e9cf383bb364988e491d9cf0042f3b07d1d47ac7))
* rimuove index inutilizzato ([#68](https://github.com/Smailen5/server-portfolio/issues/68)) ([d949c30](https://github.com/Smailen5/server-portfolio/commit/d949c3073b0cb3de44ca21dc6baf1fadee2d208f))
* riordina middleware index ([#73](https://github.com/Smailen5/server-portfolio/issues/73)) ([499efbb](https://github.com/Smailen5/server-portfolio/commit/499efbbf712a3e67bebebc13952d1e4d7317ae2a))


### Tests

* aggiunge test per CRUD progetti ([#69](https://github.com/Smailen5/server-portfolio/issues/69)) ([19031b2](https://github.com/Smailen5/server-portfolio/commit/19031b2de9e71d372391d3ab6922000391e4ffb7))
* controller GitHub ([#71](https://github.com/Smailen5/server-portfolio/issues/71)) ([3c35342](https://github.com/Smailen5/server-portfolio/commit/3c3534299591ce4b268f154d0220860ddc45c547))
* copre autenticazione API key e JWT ([#66](https://github.com/Smailen5/server-portfolio/issues/66)) ([0035ea1](https://github.com/Smailen5/server-portfolio/commit/0035ea1b0409b4419a9ff860c96faa304959ee6b))
* copre validazione richieste ([#65](https://github.com/Smailen5/server-portfolio/issues/65)) ([e9164a7](https://github.com/Smailen5/server-portfolio/commit/e9164a7a0d1dce12acb7072e8bbaa95f0ab0cb42))
* flusso login authController ([#67](https://github.com/Smailen5/server-portfolio/issues/67)) ([534c152](https://github.com/Smailen5/server-portfolio/commit/534c15236f1eb4f9d1ed3c3cef8e5e3aed2bc914))

## [2.0.3](https://github.com/Smailen5/server-portfolio/compare/v2.0.2...v2.0.3) (2026-06-11)


### Bug Fixes

* aggiunge campo link a schema Projects ([#60](https://github.com/Smailen5/server-portfolio/issues/60)) ([8d624ea](https://github.com/Smailen5/server-portfolio/commit/8d624eac6b33df8496de17d4173e0ddb02f24fe7))
* corregge Date.now parentesi schemi ([#61](https://github.com/Smailen5/server-portfolio/issues/61)) ([c8b879e](https://github.com/Smailen5/server-portfolio/commit/c8b879ed00c43cc20968e5e1bec7a2271aa93cc7))
* isInt -&gt; isMongoId nei validatori ([#59](https://github.com/Smailen5/server-portfolio/issues/59)) ([b26b247](https://github.com/Smailen5/server-portfolio/commit/b26b247de3b6fba8b824cef5cfb798212b80641f))
* usa findOneAndUpdate in updateProject ([#62](https://github.com/Smailen5/server-portfolio/issues/62)) ([8872d01](https://github.com/Smailen5/server-portfolio/commit/8872d01e0db65ac0949e262f0a9b42f6e098918a))


### Chores

* aggiunge template chore, build, ci ([#58](https://github.com/Smailen5/server-portfolio/issues/58)) ([8a0735c](https://github.com/Smailen5/server-portfolio/commit/8a0735c26835dc1a47cc7fdae029fc12cee50afb))
* ignora NOTE-prossimi-passi.md ([#33](https://github.com/Smailen5/server-portfolio/issues/33)) ([c75c2f6](https://github.com/Smailen5/server-portfolio/commit/c75c2f675e51715a0593b87796c6650415009eda))
* rimuove @types/sequelize ([#32](https://github.com/Smailen5/server-portfolio/issues/32)) ([bec5e35](https://github.com/Smailen5/server-portfolio/commit/bec5e35b828f2d5bb83e492faabae3edcba22a8f))
* sposta types bcrypt jwt devDeps ([#63](https://github.com/Smailen5/server-portfolio/issues/63)) ([19b2a6e](https://github.com/Smailen5/server-portfolio/commit/19b2a6eb1c246773ccb6ad4a82dc6f2f2ff668f0))


### Tests

* configura vitest e test di esempio ([#64](https://github.com/Smailen5/server-portfolio/issues/64)) ([aa80ff5](https://github.com/Smailen5/server-portfolio/commit/aa80ff5947a5ba2aa07d26ff866aa4c873f4cc42))


### CI/CD

* forza Node 24 per release-please ([#30](https://github.com/Smailen5/server-portfolio/issues/30)) ([c169e45](https://github.com/Smailen5/server-portfolio/commit/c169e45e827022e1874449edc20aa5a955cebb18))

## [2.0.2](https://github.com/Smailen5/server-portfolio/compare/v2.0.1...v2.0.2) (2026-06-10)


### Bug Fixes

* aggiorna tsconfig a module node16 ([#22](https://github.com/Smailen5/server-portfolio/issues/22)) ([65441ef](https://github.com/Smailen5/server-portfolio/commit/65441eff598a6181f112685880f5520b1e6d135c))
* aggiorna workflow a v5 e regex PR ([#28](https://github.com/Smailen5/server-portfolio/issues/28)) ([8f0601c](https://github.com/Smailen5/server-portfolio/commit/8f0601c2fc5aa373c190885c3ea7889351b32b5a))
* rimuove codice che bloccava la build ([#15](https://github.com/Smailen5/server-portfolio/issues/15)) ([03022d1](https://github.com/Smailen5/server-portfolio/commit/03022d16a8ff33774e99a0c8a12886669a2228ae))
* torna a release-please-action v4 ([#29](https://github.com/Smailen5/server-portfolio/issues/29)) ([377d5e3](https://github.com/Smailen5/server-portfolio/commit/377d5e337ee2dab4f0e2554782c6964c19659b50))


### Documentation

* aggiunge .env.example di base ([#19](https://github.com/Smailen5/server-portfolio/issues/19)) ([ee81f15](https://github.com/Smailen5/server-portfolio/commit/ee81f1559249a1ed5711b0f167bd73fa45cea10a))
* aggiunge AGENTS.md con regole repo ([#26](https://github.com/Smailen5/server-portfolio/issues/26)) ([8cad493](https://github.com/Smailen5/server-portfolio/commit/8cad4938580e4b755e18f2f05bdca494c489c17c))
* aggiunge badge al readme ([#23](https://github.com/Smailen5/server-portfolio/issues/23)) ([3a2db99](https://github.com/Smailen5/server-portfolio/commit/3a2db995ccda49952ee5aa2ac39e26a1590fd595))
* aggiunge template issue e PR per il progetto ([#11](https://github.com/Smailen5/server-portfolio/issues/11)) ([70d9715](https://github.com/Smailen5/server-portfolio/commit/70d9715f4b6ac9939b3cca79d04520e9be757681))
* passa da licenza ISC a MIT ([#18](https://github.com/Smailen5/server-portfolio/issues/18)) ([acab30e](https://github.com/Smailen5/server-portfolio/commit/acab30efb74f5814855dfd779c1774ae00c07107))


### Chores

* aggiorna dipendenze minori e patch ([#24](https://github.com/Smailen5/server-portfolio/issues/24)) ([3f93f3a](https://github.com/Smailen5/server-portfolio/commit/3f93f3a8403431ef6da374130390a4749331da0d))
* aggiorna husky e commitlint ([#16](https://github.com/Smailen5/server-portfolio/issues/16)) ([b6887c8](https://github.com/Smailen5/server-portfolio/commit/b6887c887e2211b22485b17b5cd26528a3475c90))
* aggiorna pnpm-lock dopo rimozione standard-version ([#14](https://github.com/Smailen5/server-portfolio/issues/14)) ([8e5229f](https://github.com/Smailen5/server-portfolio/commit/8e5229f3f46eace68738ef9359949389e84b3270))
* allinea gitignore al template ([#17](https://github.com/Smailen5/server-portfolio/issues/17)) ([00366f7](https://github.com/Smailen5/server-portfolio/commit/00366f72dfbf76728ab27786103dba80abdae26b))
* rimuove tecnologie legacy da json ([#27](https://github.com/Smailen5/server-portfolio/issues/27)) ([9960832](https://github.com/Smailen5/server-portfolio/commit/9960832fcaee279c2ff1b2787a91613a8f5f1136))


### CI/CD

* aggiunge build, lint e titolo PR ([#13](https://github.com/Smailen5/server-portfolio/issues/13)) ([841965c](https://github.com/Smailen5/server-portfolio/commit/841965cc4c927d23324a7a22913a6dd409dbeb9f))

## [2.0.1](https://github.com/Smailen5/server-portfolio/compare/v2.0.0...v2.0.1) (2026-06-10)


### Bug Fixes

* allinea tag format ai tag esistenti del repo ([#9](https://github.com/Smailen5/server-portfolio/issues/9)) ([91fc53d](https://github.com/Smailen5/server-portfolio/commit/91fc53de3ccb53c0149ab78d10ed4a5888a8b85a))


### Chores

* 🔧 aggiunge la proprietà 'private' a package.json ([2fa5772](https://github.com/Smailen5/server-portfolio/commit/2fa57725da0d0dae3ee0c3ded95ef96f8fbb702c))
* 🗑️ rimuove la migrazione ([77f16f7](https://github.com/Smailen5/server-portfolio/commit/77f16f7c87a09f8aed77b1e8b3e3a1454cece750))
* sostituisce standard-version con release-please ([#7](https://github.com/Smailen5/server-portfolio/issues/7)) ([b3e3497](https://github.com/Smailen5/server-portfolio/commit/b3e3497630da818727aea54cd3aed39412f143c1))
* ultima PR da DEV prima del nuovo workflow su main ([#6](https://github.com/Smailen5/server-portfolio/issues/6)) ([fbeb57d](https://github.com/Smailen5/server-portfolio/commit/fbeb57d630d6586b0807008bc42aa31c07a4a603))

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
