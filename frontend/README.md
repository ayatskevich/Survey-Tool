# SurveyLite - Feedback & Survey Tool

A modern, full-stack SaaS application for creating and managing surveys with real-time analytics.

## Tech Stack

### Backend
- **.NET 10** Web API with Clean Architecture
- **Entity Framework Core 10.0** with PostgreSQL
- **CQRS** pattern via MediatR
- **JWT** authentication with refresh tokens
- **FluentValidation** for input validation
- **AutoMapper** for DTO mapping
- **Serilog** for structured logging

### Frontend
- **React 18** with TypeScript (strict mode)
- **Vite** as build tool
- **React Router v6** for navigation
- **React Query** for server state management
- **Axios** with JWT interceptors
- **React Hook Form** for form state
- **Zod** for schema validation
- **Tailwind CSS** for styling

### Database
- **PostgreSQL** with JSONB columns for flexible question options
- Optimized indexes for common queries

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- PostgreSQL 14+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update the database connection string in `src/SurveyLite.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=surveylite;Username=postgres;Password=postgres"
  }
}
```

3. Create the database and run migrations:
```bash
cd src/SurveyLite.API
dotnet ef database update
```

4. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
backend/
├── src/
│   ├── SurveyLite.Domain/          # Entities, enums, interfaces
│   ├── SurveyLite.Application/     # DTOs, validators, CQRS handlers
│   ├── SurveyLite.Infrastructure/  # DB context, repositories, services
│   └── SurveyLite.API/             # Controllers, middleware, configuration
└── SurveyLite.sln

frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   ├── pages/                      # Page components
│   ├── services/                   # API client, React Query
│   ├── context/                    # Authentication context
│   ├── hooks/                      # Custom hooks
│   ├── types/                      # TypeScript interfaces
│   └── utils/                      # Utility functions
├── public/
└── package.json
```

## Architecture Principles

### Clean Architecture
- **Domain Layer**: Core business entities and rules (no external dependencies)
- **Application Layer**: Use cases and business logic (depends on Domain)
- **Infrastructure Layer**: Database, external services (depends on Domain & Application)
- **API Layer**: Controllers and HTTP concerns (depends on all layers)

### CQRS Pattern
- **Commands**: State-changing operations (Create, Update, Delete)
- **Queries**: Read-only operations with optimized DTOs
- **Handlers**: MediatR processes commands and queries

### Security
- JWT tokens with 60-minute expiration
- Refresh token rotation
- BCrypt password hashing
- Input validation with FluentValidation
- CORS configured for localhost
- Authorization checks on protected endpoints

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Response
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "User",
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 3600
}
```

## Development

### Running Tests

**Backend**:
```bash
cd backend
dotnet test
```

**Frontend**:
```bash
cd frontend
npm test
```

### Building for Production

**Backend**:
```bash
cd backend/src/SurveyLite.API
dotnet publish -c Release
```

**Frontend**:
```bash
cd frontend
npm run build
```

## Deployment

### Docker

Build and run the application in Docker:

```bash
docker-compose up
```

### Environment Variables

See `.env.example` in both backend and frontend directories for required variables.

## Roadmap

- **Phase 1 (Complete)**: Project setup, authentication, infrastructure
- **Phase 2**: Core survey builder
- **Phase 3**: Public survey forms and response collection
- **Phase 4**: Response viewing and analytics
- **Phase 5**: Dashboard and user experience improvements
- **Phase 6**: Admin panel
- **Phase 7**: Polish and production readiness
- **Phase 8**: Documentation and marketing pages

## Code Quality Standards

### Backend (.NET)
- EntityFramework migrations for schema changes
- Unit tests for business logic
- Integration tests for APIs
- Async/await for all I/O operations
- Structured logging with Serilog

### Frontend (React)
- TypeScript strict mode (no 'any')
- Component testing with React Testing Library
- Custom hooks for reusable logic
- Tailwind CSS for consistent styling
- Responsive design for all screen sizes

## Support

For issues, questions, or contributions, please create an issue or pull request.

## License

MIT License - see LICENSE file for details.
