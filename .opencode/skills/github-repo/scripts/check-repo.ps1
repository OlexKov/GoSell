# check-repo.ps1 - Quick repo status check
# Usage: .\check-repo.ps1

Write-Host "`n=== Repository Status ===" -ForegroundColor Cyan

# Current branch
$branch = git branch --show-current
Write-Host "Branch: $branch" -ForegroundColor Yellow

# Status
Write-Host "`n--- Git Status ---" -ForegroundColor Cyan
git status --short

# Recent commits
Write-Host "`n--- Recent Commits ---" -ForegroundColor Cyan
git log --oneline -5

# Remote branches
Write-Host "`n--- Remote Branches ---" -ForegroundColor Cyan
git branch -r | Select-Object -First 10

# PR status
Write-Host "`n--- Open PRs ---" -ForegroundColor Cyan
gh pr list 2>$null

Write-Host "`n=== Done ===" -ForegroundColor Cyan
