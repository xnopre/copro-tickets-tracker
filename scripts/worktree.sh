#!/bin/bash

# Script pour créer un worktree et lancer Claude
# Usage: npm run worktree <branch-name>

if [ -z "$1" ]; then
  echo "❌ Erreur: Veuillez fournir un nom de branche"
  echo "Usage: npm run worktree <branch-name>"
  exit 1
fi

BRANCH_NAME="$1"
WORKTREE_PATH="../copro-tickets-tracker-$BRANCH_NAME"

echo "📁 Création du worktree: $WORKTREE_PATH"
echo "🌿 Branche: $BRANCH_NAME"

# Créer le worktree
if ! git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"; then
  echo "❌ Erreur lors de la création du worktree"
  exit 1
fi

echo "✅ Worktree créé avec succès"
echo "🚀 Lancement de Claude dans $WORKTREE_PATH"

# Naviguer dans le worktree et lancer Claude
cd "$WORKTREE_PATH" && claude
