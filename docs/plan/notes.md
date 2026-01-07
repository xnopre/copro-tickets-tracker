# Notes Importantes

## Principes à Respecter

- **Commit après chaque étape** : gardez l'historique propre
- **Déployer après chaque étape** : validez en production
- **Écrire les tests en même temps** : pas après coup
- **Garder l'architecture hexagonale** : même dans l'incrémental

## Architecture Progressive

Au départ, vous pouvez :

- Mettre la logique directement dans les API routes
- Garder les types dans un seul fichier

Puis, au fur et à mesure :

- Extraire les use cases
- Créer les repositories
- Structurer en couches hexagonales

L'important est que **chaque étape livre de la valeur**.

## Tests

- Tests unitaires pour les composants React
- Tests d'intégration pour les API routes
- Tests E2E à partir de l'étape 12

## Commandes Utiles

```bash
npm run dev          # Développement local
npm test            # Lancer les tests
npm run build       # Build de production
git add . && git commit -m "Étape X: ..."
git push            # Déclenche le déploiement Render
```
