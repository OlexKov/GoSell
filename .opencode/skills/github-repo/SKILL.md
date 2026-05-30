---
name: github-repo
description: Manage GitHub repositories, branches, PRs, and issues using the gh CLI. Use when creating branches, commits, PRs, viewing repo status, or performing any Git/GitHub operations.
compatibility: Requires gh CLI (GitHub CLI) installed and authenticated. Works on Windows, macOS, and Linux.
metadata:
  author: opencode
  version: "1.0"
---

# GitHub Repo Management

Manage GitHub repositories using the `gh` CLI and standard `git` commands.

## Prerequisites

Verify `gh` is installed and authenticated before starting:

```powershell
# Check gh is available
gh --version

# Check auth status
gh auth status
```

If not authenticated, run:

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

## Common Workflows

### 1. Create Branch and PR

```powershell
# Create and switch to feature branch
git checkout -b <branch-name>

# Make changes, stage, and commit
git add <files>
git commit -m "<type>(<scope>): <description>"

# Push branch
git push -u origin <branch-name>

# Create PR
gh pr create --title "<title>" --body "<description>" --base main --head <branch-name>
```

### 2. Branch Naming Convention

Use conventional format: `<type>/<short-description>`

- `feat/user-auth` — new feature
- `fix/login-bug` — bug fix
- `devops/secrets-hardening` — DevOps changes
- `docs/api-reference` — documentation

### 3. Commit Message Format

Use conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `devops`

Examples:
- `feat(auth): add Google OAuth login`
- `fix(api): handle null response in user endpoint`
- `devops(docker): add health checks to compose`

### 4. View Repo Status

```powershell
# Current branch and status
git status

# Recent commits
git log --oneline -10

# Remote branches
git branch -r

# PR list
gh pr list

# PR details
gh pr view <pr-number>
```

### 5. Update Existing PR

```powershell
# Edit PR title
gh pr edit <pr-number> --title "new title"

# Edit PR body
gh pr edit <pr-number> --body "new description"

# Add labels
gh pr edit <pr-number> --add-label "bug,urgent"
```

### 6. Review and Merge

```powershell
# Checkout PR branch
gh pr checkout <pr-number>

# View PR diff
gh pr diff <pr-number>

# Merge PR
gh pr merge <pr-number> --merge

# Delete branch after merge
git push origin --delete <branch-name>
git branch -d <branch-name>
```

## Gotchas

- **PowerShell does not support `&&`** in older versions. Use `; if ($?) { cmd2 }` or separate commands.
- **`gh` auth timeout**: The `gh auth login --web` command waits for browser interaction. Set timeout to 300s+ or handle interactively.
- **`.git` suffix is optional**: `https://github.com/user/repo` and `https://github.com/user/repo.git` are the same remote.
- **`--no-cache` in Docker builds**: Avoid in CI unless needed — defeats layer caching.
- **Secrets in git history**: Even if removed, secrets persist in history. Use `git filter-branch` or BFG Repo-Cleaner to purge.

## PR Description Template

```markdown
## Summary

[One-paragraph overview of changes]

### Changes
- Change 1
- Change 2

### Setup Required
1. Step 1
2. Step 2

## Testing
[How to test these changes]
```

## Validation

After creating a PR, verify:

```powershell
# Confirm branch exists on remote
git fetch origin; git branch -r

# Confirm PR was created
gh pr list

# View PR in browser
gh pr view <pr-number> --web
```
