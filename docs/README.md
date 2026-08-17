# Documentazione tecnica

Documentazione operativa del server per chi deve configurarlo, integrarlo o estenderlo.

## Contenuti

| Documento | Scopo |
|-----------|-------|
| [Guida d'uso](guida-uso.md) | Configurazione completa, variabili d'ambiente, endpoint disponibili, autenticazione e gestione degli errori |
| [Creare nuovi progetti](creare-progetti.md) | Come aggiungere progetti al portfolio: struttura del repo, chiavi del `package.json` e sincronizzazione automatica |

## Panoramica

Il server è un'API REST costruita con Express e TypeScript che:

- espone i progetti del portfolio tramite endpoint pubblici e protetti;
- mantiene i dati sincronizzati con i repository GitHub in automatico;
- scarica e converte le immagini di anteprima dei progetti.

La sincronizzazione con GitHub avviene **ogni ora** (configurabile) e **all'avvio del server**.