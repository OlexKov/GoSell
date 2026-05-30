# create-pr.ps1 - Create a PR with standard template
# Usage: .\create-pr.ps1 -Title "feat: add feature" -Body "Description" -Branch "feat/my-feature"

param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Body,
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = (git branch --show-current),
    
    [Parameter(Mandatory=$false)]
    [string]$Base = "main"
)

# Verify gh is available
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "gh CLI not found. Install: https://cli.github.com/"
    exit 1
}

# Verify authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not authenticated. Run: gh auth login"
    exit 1
}

# Verify branch exists remotely
$remoteBranch = git branch -r | Select-String "origin/$Branch"
if (-not $remoteBranch) {
    Write-Host "Branch not found on remote. Pushing..." -ForegroundColor Yellow
    git push -u origin $Branch
}

# Create PR
Write-Host "Creating PR: $Title" -ForegroundColor Cyan
gh pr create --title $Title --body $Body --base $Base --head $Branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "PR created successfully!" -ForegroundColor Green
    gh pr list --head $Branch
} else {
    Write-Error "Failed to create PR"
    exit 1
}
