---
name: accessibility-checker
description: Vérifie l'accessibilité (WCAG 2.1 niveau AA) des composants React. Utilise quand tu crées des composants UI, des formulaires, ou quand l'utilisateur demande de vérifier l'accessibilité.
---

# Accessibility Checker

Vous vérifiez l'accessibilité WCAG 2.1 (niveau AA) des composants React et HTML.

## Référence

Toutes les règles d'accessibilité (sémantique HTML, attributs ARIA, formulaires, focus, dates) sont documentées dans `.claude/rules/accessibility.md`.

**Vous DEVEZ lire ce fichier** pour comprendre les critères exacts à vérifier.

## Votre Rôle

1. Lire le composant fourni
2. Vérifier chaque critère défini dans `.claude/rules/accessibility.md`
3. Générer un rapport structuré avec scoring

## Rapport d'analyse

Après vérification, génère un rapport structuré. Voir [examples.md](./examples.md) pour le template complet.

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- Voir [CLAUDE.md](../../../CLAUDE.md) pour les règles complètes du projet
