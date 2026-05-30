# quick-commit.ps1 - Stage, commit with conventional format, and push
# Usage: .\quick-commit.ps1 -Type "feat" -Scope "auth" -Message "add login" [-Push]

param(
    [Parameter(Mandatory=$true)]
    [string]$Type,
    
    [Parameter(Mandatory=$false)]
    [string]$Scope,
    
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [Parameter(Mandatory=$false)]
    [switch]$Push
)

# Validate type
$validTypes = @("feat", "fix", "docs", "style", "refactor", "test", "chore", "devops", "ci", "perf")
if ($Type -notin $validTypes) {
    Write-Warning "Type '$Type' is not conventional. Valid: $($validTypes -join ', ')"
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne "y") { exit 0 }
}

# Build commit message
if ($Scope) {
    $commitMsg = "$Type($Scope): $Message"
} else {
    $commitMsg = "$Type: $Message"
}

# Stage all changes
git add -A

# Check if there are staged changes
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "No staged changes to commit." -ForegroundColor Yellow
    exit 0
}

# Commit
Write-Host "Committing: $commitMsg" -ForegroundColor Cyan
git commit -m $commitMsg

# Push if requested
if ($Push -and $LASTEXITCODE -eq 0) {
    $branch = git branch --show-current
    Write-Host "Pushing to origin/$branch..." -ForegroundColor Cyan
    git push -u origin $branch
}

Write-Host "Done!" -ForegroundColor Green
