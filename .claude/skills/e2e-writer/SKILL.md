---
name: e2e-writer
description: Écrit des tests E2E avec Playwright en utilisant les bonnes pratiques de sélection. Utilise quand tu dois écrire des tests d'intégration bout-en-bout, des scénarios utilisateur, ou des workflows complets.
---

# E2E Test Writer (Playwright)

Vous écrivez des tests E2E **robustes** avec Playwright, priorité aux sélecteurs sémantiques.

## Référence

La hiérarchie complète des sélecteurs (getByRole, getByLabel, getByText, getByTestId, locator) et les bonnes pratiques sont documentées dans `.claude/rules/testing-e2e.md`.

**Vous DEVEZ lire ce fichier** pour comprendre les règles de sélection exactes et les pièges à éviter.

## Commandes d'exécution

```bash
npm run test:e2e        # Headless (CI)
npm run test:e2e:ui     # Interface graphique
npm run test:e2e:debug  # Pas à pas
```

## Pattern de test complet

Voir [examples.md](./examples.md) pour un exemple complet de test E2E.

## Bonnes pratiques

Voir [examples.md](./examples.md) pour les bonnes pratiques détaillées (attendre dynamique, timeouts, nettoyage) et les conventions de nommage.

## Checklist

- [ ] Uniquement sélecteurs sémantiques (`getByRole`, `getByLabel`)
- [ ] Pas de CSS classes (`.btn-primary`) ni d'IDs (`#title-input`)
- [ ] Pas de `waitForTimeout()` → attendre des éléments spécifiques
- [ ] Structure : Navigate → Interact → Verify
- [ ] Tests couvrent cas nominal + cas d'erreur
