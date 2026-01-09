# Task Summary & Reporting

## Rule

At the end of each task, provide a summary of tools and agents used.

## Format

```markdown
## Outils utilisés :

- Skill: [skill name] (if applicable)
- Agent (Task): [agent type] (if applicable)
- Tools: [Read, Edit, Bash, Glob, Grep, etc.]
```

## When to Apply

- **Always** — Every completed task gets a summary
- **Multi-step tasks** — Especially important for complex work
- **Simple tasks** — Even if only 1-2 tools used, include it for transparency

## Examples

### Example 1: Feature Implementation with Tests

```markdown
## Outils utilisés :

- Skill: test-writer
- Agent (Task): code-reviewer
- Tools: Read, Edit, Bash (npm test, npm run build)
```

### Example 2: Bug Investigation

```markdown
## Outils utilisés :

- Agent (Task): Explore
- Tools: Grep, Read, Glob
```

### Example 3: Simple Edit

```markdown
## Outils utilisés :

- Tools: Read, Edit
```

## Purpose

- **Transparency** — Shows what specialized tools were used
- **Auditability** — Easy to understand the approach taken
- **Learning** — User sees which agents/skills are most useful
- **Reproducibility** — Future tasks can reference similar approaches
