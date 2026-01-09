# Git Workflow

## Commits

- **NEVER auto-commit or commit code without explicit user request** — User commits themselves, ALWAYS
- Remove unused imports before finalizing
- Always use meaningful commit messages
- If user says "commit" or explicitly asks, THEN use git commit with a proper message

## Pull Requests

- Update PLAN.md throughout implementation
- Include test coverage changes
- Document changes clearly

## Branch Protection

- Work on feature branches
- Never force push to main/master
- Review before merging

## Safety Rules

- NEVER run destructive git commands without explicit user request
- NEVER skip hooks (`--no-verify`, `--no-gpg-sign`)
- NEVER use `git commit --amend` unless:
  1. User explicitly requested it, OR
  2. Commit succeeded but pre-commit hook auto-modified files needing inclusion
  3. HEAD commit was just created by you
  4. Commit NOT pushed to remote
