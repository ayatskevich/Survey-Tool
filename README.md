# SurveyLite - Survey Platform

A modern, full-stack survey platform built with React, TypeScript, and ASP.NET Core. Create, distribute, and analyze surveys with beautiful analytics and real-time insights.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [AI-Assisted Development](#ai-assisted-development)
- [Contributing](#contributing)

## 🤖 AI-Assisted Development

This project was built using **AI-assisted development** with GitHub Copilot and Claude AI. For a comprehensive overview of:
- All key prompts used during development
- How each phase was implemented via AI prompting
- Tools and models used (GitHub Copilot, Claude Haiku 4.5)
- Problem-solving strategies that worked well
- Insights and recommendations for future AI-assisted projects

**See [AI_WORKFLOW.md](AI_WORKFLOW.md)** for the complete prompt log, workflow documentation, and lessons learned.

## ✨ Features

### Core Survey Management
- **Create Surveys**: Intuitive survey builder with multiple question types
  - Short Text, Long Text, Multiple Choice, Rating, Date, Matrix, Ranking
- **Survey Distribution**: Share surveys via public link, embed on website, or direct responses
- **Response Collection**: Real-time response tracking with deduplication
- **Analytics Dashboard**: Beautiful charts and visualizations using Recharts
  - Response trends, question statistics, completion rates
- **Export Data**: Download responses in CSV or JSON format with filtering

### Admin Features
- **User Management**: Search, filter, and manage platform users
  - Role assignment (Admin/User)
  - User suspension/activation
- **Survey Administration**: Bulk archive/unarchive surveys
  - Clone surveys with all questions and options
  - View detailed survey metrics
- **Analytics Export**: Export survey data with date range filtering

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
  - Desktop: Full horizontal navigation
  - Mobile: Hamburger menu with touch-friendly controls
  - Responsive tables with card view on mobile
- **Error Handling**: Graceful error boundaries and user-friendly error messages
- **Loading States**: Skeleton screens for smooth loading experiences
- **Toast Notifications**: Real-time feedback with react-hot-toast

### Security
- **JWT Authentication**: Secure token-based authentication
- **Authorization**: Role-based access control (Admin/User)
- **Password Security**: Bcrypt hashing with configurable rounds
- **CORS Enabled**: Safe cross-origin requests to frontend

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: TanStack React Query v5
- **Styling**: Tailwind CSS 3
- **Components**: shadcn/ui compatible, lucide-react icons
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Notifications**: react-hot-toast
- **Routing**: React Router v6

### Backend
- **Framework**: ASP.NET Core 8
- **Architecture**: CQRS Pattern with MediatR
- **ORM**: Entity Framework Core 8
- **Database**: PostgreSQL 17
- **Authentication**: JWT with Identity
- **Logging**: Serilog with structured logging
- **Validation**: FluentValidation
- **API Documentation**: Swagger/OpenAPI

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions ready
- **Database**: PostgreSQL with migrations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- PostgreSQL 12+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Restore dependencies
dotnet restore

# Build
dotnet build

# Configure environment variables in appsettings.Development.json
# - Update ConnectionStrings:DefaultConnection
# - Update Jwt:SecretKey
# - Update Jwt:Issuer and Jwt:Audience

# Run migrations
dotnet ef database update --project src/SurveyLite.Infrastructure

# Start the API server
cd src/SurveyLite.API
dotnet run
```

The API will start at `https://localhost:5001`

### Database Setup

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or configure PostgreSQL manually
# ConnectionString: Server=localhost;Port=5432;Database=surveylite_db;User Id=postgres;Password=your_password;
```

## 📁 Project Structure

```
Marketplace-Admin-Panel/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── pages/                    # Page components (Landing, Dashboard, etc.)
│   │   ├── components/               # Reusable components (Layout, ErrorBoundary, etc.)
│   │   ├── services/                 # API service clients
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # React context providers
│   │   ├── types/                    # TypeScript type definitions
│   │   └── App.tsx                   # Root component with routing
│   ├── public/                       # Static assets
│   └── package.json
│
├── backend/                           # ASP.NET Core backend
│   ├── src/
│   │   ├── SurveyLite.API/           # API layer (Controllers, Middleware)
│   │   ├── SurveyLite.Application/   # Business logic (CQRS, Commands, Queries)
│   │   ├── SurveyLite.Domain/        # Domain entities and interfaces
│   │   └── SurveyLite.Infrastructure/ # Data access and external services
│   └── SurveyLite.sln
│
└── docs/                              # Documentation
    ├── phase-*.md                    # Phase-by-phase development docs
    └── README.md                     # This file
```

## 🏗 Architecture

### CQRS Pattern
The backend implements the Command Query Responsibility Segregation pattern using MediatR:

- **Queries**: Read operations (GetUsersQuery, GetSurveysWithFiltersQuery, ExportAnalyticsQuery)
- **Commands**: Write operations (UpdateUserRoleCommand, CloneSurveyCommand, BulkArchiveSurveysCommand)
- **Handlers**: Business logic implementation

### Domain-Driven Design
Core domain entities:
- **User**: Authentication and profile management
- **Survey**: Survey definition with questions and options
- **Response**: User responses to surveys
- **Answer**: Individual answer to question in a response

### Repository Pattern
Data access abstraction for:
- UserRepository
- SurveyRepository
- ResponseRepository
- These support querying with navigation properties and filters

### API Layers
1. **Controller Layer**: HTTP endpoint handling, request routing
2. **Application Layer**: CQRS handlers, business logic, DTOs
3. **Domain Layer**: Core entities, business rules
4. **Infrastructure Layer**: Database, external services

## 📡 API Documentation

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### User Management
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

#### Survey Operations
- `POST /api/surveys` - Create new survey
- `GET /api/surveys` - List user's surveys
- `GET /api/surveys/{id}` - Get survey details
- `PUT /api/surveys/{id}` - Update survey
- `DELETE /api/surveys/{id}` - Delete survey
- `PUT /api/surveys/{id}/publish` - Publish survey

#### Survey Responses
- `POST /api/responses` - Submit survey response (public)
- `GET /api/surveys/{surveyId}/responses` - List survey responses
- `GET /api/responses/{id}` - Get response details

#### Analytics
- `GET /api/surveys/{surveyId}/analytics` - Get analytics data
- `POST /api/analytics/export` - Export survey data (CSV/JSON)

#### Admin Operations
- `POST /api/admin/users/search` - Search users (Admin only)
- `PUT /api/admin/users/{id}/role` - Update user role (Admin only)
- `PUT /api/admin/users/{id}/suspend` - Suspend/activate user (Admin only)
- `POST /api/admin/surveys/search` - Search surveys (Admin only)
- `POST /api/admin/surveys/{id}/clone` - Clone survey (Admin only)
- `PUT /api/admin/surveys/bulk-archive` - Bulk archive surveys (Admin only)

#### Health Checks
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness probe

## 🗄 Database Schema

### Key Tables
- **Users**: User accounts and authentication
- **UserRoles**: User role assignments
- **Surveys**: Survey metadata and configuration
- **Questions**: Survey questions with types
- **AnswerOptions**: Multiple choice options
- **Responses**: Submitted survey responses
- **Answers**: Individual question answers in responses

### Migrations
Entity Framework Core migrations are in `SurveyLite.Infrastructure/Migrations/`. Run migrations with:
```bash
dotnet ef database update --project src/SurveyLite.Infrastructure
```

## 💻 Development

### Running Locally

1. **Terminal 1 - Frontend**:
```bash
cd frontend
npm install
npm run dev
```

2. **Terminal 2 - Backend**:
```bash
cd backend
dotnet build
cd src/SurveyLite.API
dotnet run
```

3. **Terminal 3 - Database** (if not using Docker):
```bash
# Ensure PostgreSQL is running
psql -U postgres -c "CREATE DATABASE surveylite_db;"
```

Access the application at `http://localhost:5173`

### Code Standards
- **Frontend**: TypeScript strict mode, ESLint, Prettier
- **Backend**: C# 12, nullable reference types enabled
- **Formatting**: EditorConfig for consistent styles

### Common Tasks

**Adding a new API endpoint**:
1. Create DTO in `SurveyLite.Application/DTOs/`
2. Create Query/Command in `SurveyLite.Application/Queries/` or `Commands/`
3. Create Handler
4. Create Controller action
5. Register in dependency injection

**Adding a new frontend page**:
1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Create corresponding service in `src/services/`
4. Create TypeScript types in `src/types/`

## 📦 Deployment

### Docker Deployment

1. **Using docker-compose**:
```bash
docker-compose --env-file .env.production up -d
```

2. **Manual Docker build**:
```bash
# Backend
docker build -f backend/Dockerfile -t surveylite-api .

# Frontend
docker build -f frontend/Dockerfile -t surveylite-web .
```

### Environment Variables

**Backend** (`appsettings.Production.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Port=5432;Database=surveylite_db;User Id=postgres;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "SecretKey": "your-very-long-secret-key-min-32-chars",
    "Issuer": "SurveyLite",
    "Audience": "SurveyLiteClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Frontend** (`.env.production`):
```
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_ENV=production
```

### Database Migrations in Production

1. Run migrations before deploying API:
```bash
dotnet ef database update --configuration Release
```

2. Or use automatic migration on startup (less recommended):
- Edit `Program.cs` to run migrations on app start

### GitHub Actions CI/CD

Example workflow in `.github/workflows/`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: ./deploy.sh
```

## � AI-Assisted Development Details

This project demonstrates the effectiveness of AI-assisted full-stack development. For comprehensive documentation including:

- **Prompt History**: All key prompts used to build each phase, from authentication to production deployment
- **Architecture Decisions**: Why CQRS, DDD, and Repository patterns were chosen
- **Problem-Solving Strategies**: How issues were debugged and refined through iterative prompting
- **Prompting Patterns**: What worked well and what didn't
- **Tool Recommendations**: When to use GitHub Copilot vs Claude AI vs other tools
- **Lessons Learned**: Insights from building 100+ files with AI assistance

**👉 See [AI_WORKFLOW.md](AI_WORKFLOW.md)** - Complete prompt log and development workflow documentation

### Quick Stats
- **8 Development Phases**: From auth to production-ready platform
- **100+ Files Generated**: Backend services, frontend components, configurations
- **25+ API Endpoints**: Implemented via CQRS pattern
- **50+ React Components**: built with TypeScript and React Query v5
- **Success Rate**: ~85% correct first implementation, 1-2 refinement rounds average

## �🤝 Contributing

### Development Workflow
1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Submit a pull request with description
4. Ensure all tests pass and code is reviewed

### Commit Message Format
```
feat(scope): description
fix(scope): description
docs(scope): description
```

## 📄 License

This project is free and open to use for now. See LICENSE file for details.

## 📞 Support

For issues and questions:
- Check FAQ section on the landing page
- Review API documentation in Swagger UI at `/swagger`
- Check structured logs in `logs/` directory

---

**Made with ❤️ by SurveyLite Team**

Last Updated: February 2026
Version: 1.0.0
