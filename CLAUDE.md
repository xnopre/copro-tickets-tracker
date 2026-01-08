# CLAUDE.md

Guidance for Claude Code working with **CoTiTra** — a ticket management app (Next.js + TypeScript + MongoDB).

## Core Principles

1. **Tests First** — Every line needs tests (AAA: Arrange-Act-Assert)
2. **Hexagonal** — Domain → Application → Infrastructure → Presentation
3. **Minimal** — Write only what's needed NOW, delete dead code
4. **Accessible** — WCAG 2.1 Level AA for all components
5. **Type Safe** — Strict TypeScript, no `any`

## Start Here

1. Read code before changing it
2. Implement + tests together
3. Check `.claude/rules/` for specifics
