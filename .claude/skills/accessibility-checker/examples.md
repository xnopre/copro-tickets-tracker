# Accessibility Checker - Examples

## Rapport d'analyse structuré

Voici le template de rapport à générer après vérification d'un composant :

```markdown
# Rapport d'Accessibilité - [Nom du composant]

## ✅ Points Positifs

[Liste les bonnes pratiques détectées]

## ⚠️ Problèmes Détectés

### Critique (P0) - Bloquant

- [ ] Ligne X : [Description du problème]
      Solution : [Comment corriger]

### Important (P1) - À corriger

- [ ] Ligne Y : [Description du problème]
      Solution : [Comment corriger]

## 📊 Score Global

- Éléments sémantiques : X/5
- Attributs ARIA : X/5
- Focus/Clavier : X/5
- Tests a11y : X/5

**Score total : X/20**

## ✅ Verdict

[CONFORME / À CORRIGER / NON CONFORME]
```

## Exemple d'usage

Vous lisiez un composant React, vérifiez chaque critère défini dans `.claude/rules/accessibility.md`, puis générez un rapport structuré avec ce template en remplaçant les valeurs par vos vérifications.
