## PHASE 1: Project Setup & Infrastructure (AI-Generated)

**Goal**: Establish the foundational project structure for both backend and frontend with proper configuration and tooling.

**Why This Phase Matters**: A well-structured foundation ensures consistency, makes AI code generation more effective (clear file structure helps Copilot understand context), and prevents technical debt.

### Task 1.1: Initialize .NET 10 Web API Project

**What to Build**:
- Create a new .NET 10 Web API solution
- Set up project structure with proper layering:
  - `SurveyLite.API` - Web API layer
  - `SurveyLite.Core` - Domain models and interfaces
  - `SurveyLite.Infrastructure` - Data access and external services
  - `SurveyLite.Application` - Business logic and CQRS handlers

**AI Prompt Strategy**:
```
"Create a .NET 10 Web API solution using Clean Architecture with strict separation of concerns.

Program.cs must include:
- Dependency injection configuration (call Infrastructure and Application DI extensions)
- Swagger/OpenAPI with JWT bearer configuration
- CORS with named policy
- Exception handling middleware
- Request/response logging
- JSON serialization options (camelCase, ignore null values)
- Health checks for database
- Authentication/Authorization middleware

Follow SOLID principles and use async/await for I/O."
```

**Expected Outcome**:
- Solution file with 4 projects
- Program.cs configured with Swagger, CORS, JSON serialization
- Initial folder structure in each project (Controllers, Models, Services)
- NuGet packages: EntityFrameworkCore, JWT auth, FluentValidation, AutoMapper

---

### Task 1.2: Set Up Database and Entity Framework Core

**What to Build**:
- Configure PostgreSQL connection string
- Create DbContext with initial entity configurations
- Set up migration infrastructure
- Create initial database schema for core entities (Users, Surveys, Questions, Responses, Answers)

**AI Prompt Strategy**:
```
"Create Entity Framework Core infrastructure following best practices and Clean Architecture.

1. Domain Entities (SurveyLite.Domain/Entities/):
Create BaseEntity, User, Survey, Question, Response, Answer with proper navigation and business methods.

2. DbContext: override SaveChangesAsync to set timestamps and apply configurations.

3. IEntityTypeConfiguration classes for each entity.

4. Repository interfaces and EF implementations.

5. Create initial migration: Initial_CreateDatabase."
```

**Expected Outcome**:
- ApplicationDbContext.cs with configurations
- Entity classes with navigation
- Migration files and seed data for testing

---

### Task 1.3: Initialize React Frontend with TypeScript

**What to Build**:
- Create React app with Vite, TypeScript strict mode
- Folder structure for components, pages, services, hooks, types
- Install dependencies: React Router, React Query, Tailwind, Axios, React Hook Form, Zod

**AI Prompt Strategy**: see main plan for details and sample configs (tsconfig, axios, queryClient)

**Expected Outcome**:
- Working Vite + React + TypeScript project with Tailwind and React Query configured

---

### Task 1.4: Set Up Authentication Infrastructure

**What to Build**:
- Backend: JWT token service, AuthController, BCrypt password hashing, refresh tokens
- Frontend: AuthContext, ProtectedRoute, login/register pages, axios interceptor

**AI Prompt Strategy**: prompts provided in the main plan (Auth backend and frontend prompts)

**Expected Outcome**:
- Working JWT auth on backend and frontend
