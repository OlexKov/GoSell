# GoSell

OLX-style classifieds marketplace with real-time chat, admin panel, and full DevOps pipeline.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core 8.0 (C#) |
| Frontend | React 18 + TypeScript + Vite |
| Database | PostgreSQL 17 |
| UI | Ant Design + MUI + Tailwind CSS |
| State | Redux Toolkit + RTK Query |
| Real-time | SignalR |
| Auth | JWT + Google OAuth + reCAPTCHA v3 |
| CI/CD | Jenkins + Docker + Docker Compose |
| IaC | Terraform (AWS EC2) |

## Project Structure

```
GoSell/
├── OLX.API/                  # Backend solution
│   ├── OLX.API/              # API layer (controllers, middleware)
│   ├── Olx.BLL/              # Business logic (services, entities, DTOs)
│   └── Olx.DAL/              # Data access (EF Core, repositories)
├── OLX.Frontend/             # React frontend
│   └── src/
│       ├── components/       # 50+ reusable components
│       ├── pages/            # Route pages (default/user/admin)
│       ├── redux/            # State management + API calls
│       └── models/           # TypeScript interfaces
├── Tools/                    # DevOps configuration
│   ├── docker-compose.yml
│   ├── Jenkins.jenkinsfile
│   ├── .env.example          # Environment template
│   └── Terraform/            # AWS provisioning
└── .opencode/skills/         # Agent skills
```

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 17](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (optional)

### Local Development

**Backend:**
```bash
cd OLX.API
dotnet restore
dotnet run --project OLX.API
```

**Frontend:**
```bash
cd OLX.Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5005`.

### Environment Variables

1. Copy the template:
   ```bash
   cp Tools/.env.example Tools/.env
   ```

2. Fill in real values in `Tools/.env` (never commit this file)

3. Required variables:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `JWT_KEY` | JWT signing secret (generate: `openssl rand -base64 32`) |
| `RECAPTCHA_SECRET` | Google reCAPTCHA v3 secret |
| `NEWPOST_API_KEY` | Nova Poshta API key |
| `MAIL_PASSWORD` | SMTP password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |

## Docker Deployment

**Using Docker Compose:**
```bash
cd Tools

# Copy and edit environment file
cp .env.example .env

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down --rmi all --volumes
```

**Services:**
| Service | Port | Description |
|---------|------|-------------|
| `postgresServerDb` | 5432 | PostgreSQL database |
| `app` | 8080 | ASP.NET Core API |
| `client` | 80 | React frontend (Nginx) |

## CI/CD Pipeline

Jenkins pipeline (`.jenkinsfile`) stages:

1. **Build API** — Docker multi-stage build for backend
2. **Build Frontend** — Docker multi-stage build for React
3. **Deploy** — `docker compose up -d` on remote server

**Run locally:**
```bash
cd Tools
docker compose down --remove-orphans || true
docker compose up -d
```

## Infrastructure

Terraform provisions AWS EC2 in `eu-north-1`:

```bash
cd Tools/Terraform

# Initialize (requires S3 backend setup)
terraform init

# Plan changes
terraform plan

# Apply
terraform apply
```

**First-time setup:**
```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket gosell-terraform-state \
  --region eu-north-1 \
  --create-bucket-configuration LocationConstraint=eu-north-1

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-north-1
```

## API Endpoints

| Controller | Endpoints |
|------------|-----------|
| Account | Login, register, refresh token |
| User | Profile, favorites, viewed adverts |
| Advert | CRUD, search, filtering |
| Category | List, tree structure |
| Filter | Dynamic filters per category |
| Chat | Real-time messaging (SignalR) |
| AdminMessage | Admin-user messaging |
| Backup | Database backup/restore |

## Frontend Routes

**Public:** `/`, `/adverts`, `/advert/:id`, `/auth/*`

**User (authenticated):** `/user/*`, `/favorites`, `/user/chat`

**Admin (role: Admin):** `/admin/*`

## Scripts

```bash
# Quick commit with conventional format
.opencode/skills/github-repo/scripts/quick-commit.ps1 -Type feat -Scope auth -Message "add login" -Push

# Create PR
.opencode/skills/github-repo/scripts/create-pr.ps1 -Title "feat: add feature" -Body "Description"

# Check repo status
.opencode/skills/github-repo/scripts/check-repo.ps1
```

## License

Private — All rights reserved.
