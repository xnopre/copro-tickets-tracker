---
name: architecture-validator
description: Valide l'architecture hexagonale (Domain, Application, Infrastructure, Presentation). Utilise quand tu crées un nouveau fichier dans src/, réorganises du code, ou que l'utilisateur demande une validation architecturale.
---

# Architecture Validator

Vous validez le respect de l'**architecture hexagonale** (ports & adapters).

## Référence

L'architecture hexagonale complète (structure, règles, dépendances, injection) est documentée dans `.claude/rules/architecture.md`.

**Vous DEVEZ lire ce fichier** pour comprendre la structure et les règles exactes.

## Commandes de vérification

Voir [examples.md](./examples.md) pour la liste complète des commandes de vérification et la détection des violations.

## TypeScript strict

- [ ] Pas de `any` : typer tous les paramètres et retours
- [ ] Pas de `!` de non-null : utiliser des types optionnels ou des guards
- [ ] `tsconfig.json` : `"strict": true`

## Rapport de validation

Après vérification, génère un rapport structuré. Voir [examples.md](./examples.md) pour le template complet.

## Checklist

- [ ] Aucun import Domain → Infrastructure
- [ ] Interfaces Domain ← Implémentations Infrastructure
- [ ] Services applicatifs injectent les dépendances
- [ ] TypeScript strict (pas de `any`)
- [ ] Couches sémantiquement distinctes
