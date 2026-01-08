---
name: test-writer
description: Écrit des tests unitaires et d'intégration suivant la structure AAA. Utilise quand tu dois écrire des tests, tester un composant React, valider une logique métier, ou quand un fichier n'a pas de tests.
---

# Test Writer

Vous écrivez des tests avec **Vitest** et **React Testing Library**.

## Référence

Les principes complets (structure AAA, assertions, mocking, ce qui nécessite des tests) sont documentés dans `.claude/rules/testing.md`.

**Vous DEVEZ lire ce fichier** pour comprendre les règles de test et la couverture requise.

## Mocker les dépendances & Templates

Voir [examples.md](./examples.md) pour :

- Comment mocker les dépendances (modules, fonctions, restauration)
- Templates par type de fichier (React, Use Case/Service)

## Checklist

- [ ] Chaque fichier `.ts/.tsx` a son `.test.ts/.test.tsx`
- [ ] Tests couvrent nominaux + erreurs
- [ ] Pas de `any` ni assertions flottantes
- [ ] Valeurs en dur dans les assertions
- [ ] Dépendances externes mockées
- [ ] Structure AAA respectée

Voir [examples.md](./examples.md) pour les commandes d'exécution des tests.
