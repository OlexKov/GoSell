# Conventional Commits Reference

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add Google OAuth` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `docs` | Documentation only | `docs: update README` |
| `style` | Formatting, no code change | `style: fix indentation` |
| `refactor` | Code change without feature/fix | `refactor: extract utils` |
| `test` | Adding/updating tests | `test: add auth tests` |
| `chore` | Build, deps, configs | `chore: update npm packages` |
| `devops` | Infrastructure/CI/CD | `devops: add Docker healthcheck` |
| `ci` | CI configuration | `ci: add GitHub Actions` |
| `perf` | Performance improvement | `perf: optimize queries` |

## Examples

### Simple
```
feat: add user registration
```

### With scope
```
feat(auth): implement JWT refresh tokens
```

### With body
```
fix(api): prevent duplicate submissions

The previous implementation allowed multiple form submissions
when users clicked rapidly. Added debounce and server-side
idempotency check.

Closes #123
```

### Breaking change
```
feat!: change API response format

BREAKING CHANGE: All API responses now use camelCase
instead of snake_case. Clients need to update accordingly.
```

## Branch Naming

Match branch type to commit type:

| Branch | Purpose |
|--------|---------|
| `feat/feature-name` | New feature |
| `fix/bug-description` | Bug fix |
| `devops/change-description` | DevOps changes |
| `docs/update-description` | Documentation |
| `refactor/description` | Code refactoring |

## PR Title

Match PR title to commit format:

```
feat(auth): add OAuth2 login with Google
```
