# Architecture Validator - Examples

## Commandes de vérification

### Détecter les violations Domain → Infrastructure

```bash
grep -rn "from '@/infrastructure" src/domain/
grep -rn "from '@/application" src/domain/
grep -rn "from '@/presentation" src/domain/
grep -rn "from 'mongoose'" src/domain/
grep -rn "from 'next/" src/domain/
grep -rn "from 'react'" src/domain/
```

Si **AUCUNE ligne** → ✅ Domain est pur
Si **DES LIGNES** → ❌ VIOLATION CRITIQUE

### Détecter les violations Application → Infrastructure

```bash
grep -rn "from '@/infrastructure" src/application/
grep -rn "from '@/presentation" src/application/
```

### Détecter les instanciations directes (pas d'injection)

```bash
grep -rn "new Mongo" src/domain/use-cases/
grep -rn "new Mongo" src/application/
```

Si **DES LIGNES** → ❌ Violation de l'injection de dépendances

## Rapport de validation structuré

```markdown
# Rapport de Validation d'Architecture Hexagonale

## ✅ Règles Respectées

- ✅ Domain ne dépend de rien
- ✅ Application dépend uniquement du Domain
- ✅ Infrastructure implémente les interfaces du Domain
- ✅ Injection de dépendances respectée

## ❌ Violations Détectées

### Critique (P0)

#### Violation 1 : Domain importe Infrastructure

- **Fichier** : src/domain/use-cases/CreateTicket.ts:15
- **Import interdit** : `import ... from '@/infrastructure/database'`
- **Impact** : Le Domain n'est plus indépendant
- **Solution** :
  1. Créer une interface dans `src/domain/repositories/`
  2. Implémenter dans `src/infrastructure/repositories/`
  3. Injecter via le constructeur

## 📊 Statistiques

- Fichiers Domain analysés : X
- Violations critiques : X
- Violations importantes : X

## ✅ Verdict

[ARCHITECTURE VALIDE / VIOLATIONS À CORRIGER]
```

## TypeScript strict - Checklist

```typescript
// ❌ À ÉVITER
const getValue = (obj: any) => obj.value; // any
const id = value!; // non-null assertion

// ✅ PRÉFÉRER
const getValue = (obj: { value: string }) => obj.value; // Typage
const id = value ?? defaultValue; // Optionnel ou guard
```

Vérifiez dans `tsconfig.json` : `"strict": true`
