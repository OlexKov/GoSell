# Troubleshooting Guide

## gh CLI Issues

### "gh: command not found"

**Windows:**
```powershell
# Install via winget
winget install --id GitHub.cli -e

# Or download manually from https://github.com/cli/cli/releases
```

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
sudo apt install gh  # Debian/Ubuntu
```

### "You are not logged into any GitHub hosts"

```powershell
# Interactive login
gh auth login --hostname github.com --git-protocol https --web

# Or with token
gh auth login --with-token < token.txt
```

### Auth timeout during `gh auth login --web`

The command waits for browser interaction. If it times out:
1. Run the command again
2. Complete the browser step quickly
3. Or use token-based auth instead

## Git Issues

### "fatal: refusing to merge unrelated histories"

```bash
git merge --allow-unrelated-histories <branch>
```

### "error: failed to push some refs"

```bash
# Force push (use with caution)
git push --force-with-lease

# Or pull and rebase first
git pull --rebase origin <branch>
git push
```

### "fatal: remote branch already exists"

```bash
# Delete remote branch
git push origin --delete <branch-name>

# Then delete local branch
git branch -d <branch-name>
```

### CRLF issues on Windows

```bash
# Normalize line endings
git config --global core.autocrlf true

# For existing repo
git add --renormalize .
git commit -m "fix: normalize line endings"
```

## PR Issues

### "A pull request already exists for..."

```bash
# View existing PRs
gh pr list

# If you need to recreate, close existing first
gh pr close <pr-number>
```

### PR target branch is wrong

```bash
# Edit PR base branch
gh pr edit <pr-number> --base main
```

### Can't merge due to conflicts

```bash
# Fetch latest
git fetch origin

# Rebase on target branch
git rebase origin/main

# Resolve conflicts, then
git add .
git rebase --continue

# Force push (rebase rewrites history)
git push --force-with-lease
```

## Docker Issues

### Build context too large

Ensure `.dockerignore` exists and excludes:
- `.git/`
- `node_modules/`
- `bin/`, `obj/`
- `*.md`
- `.env*`

### Container won't start

```bash
# Check logs
docker logs <container-name>

# Check health
docker inspect --format='{{.State.Health.Status}}' <container-name>

# Enter container
docker exec -it <container-name> /bin/bash
```

## Terraform Issues

### "Error: Backend initialization required"

```bash
# Reinitialize with new backend
terraform init -migrate-state

# Or force unlock if stuck
terraform force-unlock <lock-id>
```

### State file conflicts

```bash
# List state
terraform state list

# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0

# Remove resource from state
terraform state rm aws_instance.example
```
