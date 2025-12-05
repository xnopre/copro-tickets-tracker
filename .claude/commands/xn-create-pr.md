---
description: Créer une Pull Request sur GitHub avec vérifications et suggestion de mise à jour du PLAN.md
---

# Créer une Pull Request GitHub

Tu vas créer une Pull Request en suivant EXACTEMENT ces étapes.

## Étape 1 : Vérifications Pré-vol (BLOQUANTES)

Exécute les vérifications suivantes en PARALLÈLE (un seul message avec plusieurs appels Bash) :

```bash
git status --porcelain
```

```bash
git rev-parse --abbrev-ref HEAD
```

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>&1
```

```bash
git status -sb --porcelain
```

### Règles de Validation

**ARRÊTE et affiche une erreur si UNE de ces conditions est vraie :**

#### 1. Changements non commités

Si `git status --porcelain` retourne du contenu (non vide) :

```
❌ ERREUR : Vous avez des changements non commités.

Veuillez commiter ou stasher vos changements avant de créer une PR :

git add .
git commit -m "Votre message de commit"

Puis relancez /pr
```

#### 2. Sur la branche main

Si `git rev-parse --abbrev-ref HEAD` retourne "main" :

```
❌ ERREUR : Vous êtes sur la branche main.

Les Pull Requests doivent être créées depuis une branche de fonctionnalité.
Créez d'abord une nouvelle branche :

git checkout -b nom-de-la-branche

Puis relancez /pr
```

#### 3. Pas de branche remote tracking

Si `git rev-parse --abbrev-ref --symbolic-full-name @{u}` échoue ou retourne une erreur :

```
❌ ERREUR : Votre branche ne track pas de branche remote.

Pushez d'abord votre branche vers le remote :

git push -u origin $(git rev-parse --abbrev-ref HEAD)

Puis relancez /pr
```

#### 4. Branche pas synchronisée avec remote

Si `git status -sb --porcelain` contient "[ahead" ou "[behind" :

```
❌ ERREUR : Votre branche n'est pas synchronisée avec le remote.

Pushez vos changements d'abord :

git push

Puis relancez /pr
```

### Si TOUTES les vérifications passent, passe à l'Étape 2

## Étape 2 : Créer la Pull Request

Utilise GitHub CLI pour créer la PR avec titre et description auto-générés :

```bash
gh pr create --base main --fill
```

**Important :**

- Utilise le flag `--fill` pour laisser GitHub auto-générer le titre depuis les commits
- Utilise `--base main` pour cibler la branche principale
- NE PAS utiliser `--title` ou `--body` - laisse GitHub auto-générer

Capture l'URL de la PR depuis la sortie.

## Étape 3 : Afficher le Succès

Affiche à l'utilisateur :

```
✅ Pull Request créée avec succès !

URL de la PR : [colle l'URL ici]
```

## Gestion d'Erreurs

Pour toute erreur inattendue lors de la création de la PR :

```
❌ ERREUR : Échec de création de la Pull Request.

[Affiche le message d'erreur réel]

Cela peut signifier :
- GitHub CLI n'est pas authentifié (lancez : gh auth login)
- Vous n'avez pas la permission de créer des PRs dans ce repository
- Problèmes de connectivité réseau

Veuillez résoudre le problème et relancer /pr
```

## Notes Importantes

- TOUJOURS utiliser des appels bash PARALLÈLES pour les vérifications indépendantes (Étape 1)
- TOUJOURS afficher l'URL de la PR à la fin
- Être utile avec les messages d'erreur - montrer les commandes exactes pour corriger
- Ne JAMAIS procéder si les vérifications pré-vol échouent
- La mise à jour du PLAN.md est optionnelle mais encouragée
