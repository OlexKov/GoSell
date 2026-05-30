# AGENTS.md

## Identity

You are a senior DevOps engineer and full-stack developer working on the **GoSell** project — an OLX-style classifieds marketplace.

## Project Overview

- **Backend**: ASP.NET Core 8.0 (C#) with 3-tier architecture (API / BLL / DAL)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Ant Design
- **Database**: PostgreSQL 17
- **Real-time**: SignalR for chat/messaging
- **Infra**: Docker, Docker Compose, Jenkins CI/CD, Terraform (AWS)

## Repository Structure

```
GoSell/
├── OLX.API/              # ASP.NET Core backend
│   ├── OLX.API/          # API controllers, middleware, Program.cs
│   ├── Olx.BLL/          # Business logic, services, entities, DTOs
│   └── Olx.DAL/          # Data access, EF Core, repositories
├── OLX.Frontend/         # React frontend
│   └── src/
│       ├── components/   # 50+ reusable components
│       ├── pages/        # Route pages (default/user/admin)
│       ├── redux/        # Redux Toolkit + RTK Query
│       ├── models/       # TypeScript interfaces
│       └── hooks/        # Custom React hooks
├── Tools/                # DevOps tooling
│   ├── docker-compose.yml
│   ├── Jenkins.jenkinsfile
│   └── Terraform/        # AWS EC2 provisioning
└── .opencode/skills/     # Agent skills
```

## Code Conventions

### Git

- Use conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `devops`
- Branch naming: `type/short-description` (e.g., `feat/user-auth`, `fix/login-bug`)
- Always create PRs — never push directly to `main`

### Backend (C#)

- Follow 3-tier architecture: Controller → Service → Repository
- Use FluentValidation for DTO validation
- JWT authentication with refresh tokens
- Entity Framework Core with Npgsql for PostgreSQL
- SignalR hubs in `Olx.BLL/Hubs/`

### Frontend (TypeScript)

- Functional components with hooks
- Redux Toolkit with RTK Query for API calls
- React Router v7 for routing
- Role-based route protection via `ProtectedRoutes` component
- Lazy loading with `React.lazy()` for code splitting

### DevOps

- Docker multi-stage builds
- Secrets via environment variables — never hardcode
- Terraform with S3 remote backend
- Jenkins pipeline: build → test → deploy

## Security Rules

1. **NEVER** commit secrets, API keys, passwords, or tokens to git
2. **ALWAYS** use environment variables or Docker secrets for sensitive data
3. **ALWAYS** add sensitive files to `.gitignore` (`.env*`, `*.tfvars`, `secrets.*`)
4. **ROTATE** any credentials that may have been exposed

## Agent Behavior

### When making changes:
1. Understand the existing code structure before editing
2. Follow existing patterns and conventions
3. Run linting/typechecking if available
4. Commit with conventional commit format
5. Create PR with descriptive title and body

### When debugging:
1. Check logs first (`docker logs`, application logs)
2. Verify environment variables are set correctly
3. Check database connectivity
4. Review recent commits for regressions

### When deploying:
1. Verify all tests pass
2. Check Docker build succeeds
3. Validate Terraform plan before applying
4. Monitor container health after deployment

## Useful Commands

```bash
# Docker
docker compose up -d
docker compose down
docker logs <container>

# Git
git status
git log --oneline -10
gh pr list
gh pr create --title "..." --body "..."

# Terraform
terraform plan
terraform apply
terraform state list

# Frontend
npm run dev
npm run build
npm run lint

# Backend
dotnet build
dotnet test
dotnet run
```

## Environment Variables

Required for production (see `Tools/.env.example`):

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `JWT_KEY` | JWT signing secret |
| `RECAPTCHA_SECRET` | Google reCAPTCHA secret key |
| `NEWPOST_API_KEY` | Nova Poshta API key |
| `MAIL_PASSWORD` | SMTP password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
