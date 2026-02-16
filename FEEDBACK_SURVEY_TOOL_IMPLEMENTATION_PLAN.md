# Feedback & Survey Tool - Complete Implementation Plan

## Table of Contents

1. [Project Overview](#project-overview)
2. [Software Architecture Principles](#software-architecture-principles)
3. [AI Code Generation Strategy](#ai-code-generation-strategy)
4. [Phase-by-Phase Implementation](#phase-by-phase-implementation-plan)
   - Phase 1: Project Setup & Infrastructure
   - Phase 2: Core Survey Builder
   - Phase 3: Public Survey Form & Response Collection
   - Phase 4: Response Viewing & Analytics
   - Phase 5: Dashboard & User Experience
   - Phase 6: Admin Panel
   - Phase 7: Polish & Production Readiness
   - Phase 8: Documentation & Marketing Pages
5. [Code Review Checklist](#code-review-checklist)
6. [Development Workflow](#development-workflow)
7. [Performance Optimization Guide](#performance-optimization-guide)
8. [Expected Deliverables](#expected-deliverables-checklist)
9. [Success Metrics](#success-metrics)
10. [Next Steps - Getting Started](#next-steps---getting-started)
11. [Future Enhancements](#future-technical-enhancements-post-mvp)
12. [Appendix: Quick Reference](#appendix-quick-reference)

---

# Feedback & Survey Tool - Complete Implementation Plan

## Project Overview

**Name**: SurveyLite - Lightweight Feedback & Survey SaaS Platform

**Tech Stack**:
- **Backend**: .NET 10 Web API
- **Frontend**: React.js 18+ with TypeScript
- **Database**: PostgreSQL (or SQL Server)
- **Authentication**: JWT-based auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + Context API
- **Code Generation**: GitHub Copilot (90%+ AI-generated code)

**Core Value Proposition**: 
Simple, fast survey creation and response collection with beautiful analytics - targeting small businesses, educators, and product teams who need quick feedback without complexity.

**Project Focus**:
Building a production-ready application with emphasis on:
- Clean Architecture and SOLID principles
- Scalable and maintainable codebase
- Best practices in .NET and React development
- Comprehensive error handling and validation
- High code quality with minimal technical debt
- Performance optimization and security

---

## Architecture Overview

### System Components

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React SPA     │────────▶│  .NET 10 Web API │────────▶│ PostgreSQL  │
│   (Frontend)    │◀────────│    (Backend)     │◀────────│  Database   │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

### Key Features Map

1. **Public Features** (No auth required)
   - Landing page with demo
   - Public survey form (respondents fill surveys)
   - Survey preview

2. **User Features** (Authenticated)
   - Survey builder (drag-drop form creator)
   - Survey list & management
   - Response viewer & analytics
   - Dashboard with statistics
   - Export responses (CSV)
   - Account settings

3. **Admin Features** (Admin role)
   - User management
   - System analytics
   - Subscription management
   - Feature flags

### Layouts Required

1. **Public Layout**: Landing page, public survey form
2. **Dashboard Layout**: User workspace with sidebar navigation
3. **Admin Layout**: Admin panel with different navigation
4. **Survey Preview Layout**: Minimal layout for survey taking

---

## Phase-by-Phase Implementation Plan

The detailed phase-by-phase plan has been moved to the `docs/` folder and split into individual files for each phase. See [docs/README.md](docs/README.md) for links and focused phase documents.

---

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

Project Structure:
1. SurveyLite.Domain (Class Library)
   - Entities/ (pure domain models with no dependencies)
   - Interfaces/ (repository and service interfaces)
   - Exceptions/ (custom domain exceptions)
   - Common/ (base classes, value objects)

2. SurveyLite.Application (Class Library)
   - Commands/ (CQRS command handlers)
   - Queries/ (CQRS query handlers)
   - DTOs/ (data transfer objects)
   - Interfaces/ (application service interfaces)
   - Validators/ (FluentValidation validators)
   - Mappings/ (AutoMapper profiles)

3. SurveyLite.Infrastructure (Class Library)
   - Persistence/ (DbContext, repositories, configurations)
   - Services/ (external service implementations)
   - Migrations/ (EF Core migrations)
   - DependencyInjection.cs (service registration)

4. SurveyLite.API (Web API)
   - Controllers/ (thin controllers, routing only)
   - Middleware/ (exception handling, logging)
   - Filters/ (authorization, validation)
   - Program.cs (app configuration)
   - appsettings.json

Program.cs must include:
- Dependency injection configuration (call Infrastructure and Application DI extensions)
- Swagger/OpenAPI with JWT bearer configuration
- CORS with named policy
- Exception handling middleware
- Request/response logging
- JSON serialization options (camelCase, ignore null values)
- Health checks for database
- Authentication/Authorization middleware

Follow SOLID principles:
- Single Responsibility: Each class has one clear purpose
- Open/Closed: Use interfaces for extensibility
- Dependency Inversion: Controllers depend on interfaces, not concrete implementations

Use async/await for all I/O operations.
Add XML documentation comments for all public APIs."
```

**Expected Outcome**:
- Solution file with 4 projects
- Program.cs configured with Swagger, CORS, JSON serialization
- Initial folder structure in each project (Controllers, Models, Services)
- NuGet packages: EntityFrameworkCore, JWT auth, FluentValidation, AutoMapper

**Why These Choices**:
- Clean Architecture separates concerns and makes the codebase maintainable
- Copilot works better with well-organized folder structures
- Standard patterns help AI understand where to place new code

---

### Task 1.2: Set Up Database and Entity Framework Core

**What to Build**:
- Configure PostgreSQL connection string
- Create DbContext with initial entity configurations
- Set up migration infrastructure
- Create initial database schema for core entities:
  - Users (Id, Email, PasswordHash, Role, CreatedAt, SubscriptionTier)
  - Surveys (Id, UserId, Title, Description, IsActive, CreatedAt, UpdatedAt)
  - Questions (Id, SurveyId, Type, Text, Order, IsRequired, Options)
  - Responses (Id, SurveyId, RespondentEmail, SubmittedAt)
  - Answers (Id, ResponseId, QuestionId, AnswerText)

**AI Prompt Strategy**:
```
"Create Entity Framework Core infrastructure following best practices and Clean Architecture.

1. Domain Entities (SurveyLite.Domain/Entities/):

Create base entity:
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

Create entities with proper encapsulation:
- User: Id, Email, PasswordHash, FirstName, LastName, Role (enum: User, Admin), IsActive, LastLoginAt
  - Add validation in setters (email format, password requirements)
  - Private setters, public methods for state changes (UpdateProfile, ChangePassword, Login)
  - Business rules: Email must be unique, password must be hashed
  
- Survey: Id, UserId, Title, Description, IsActive, Settings (value object or JSON)
  - Navigation: User (creator), Questions (collection), Responses (collection)
  - Business methods: Activate(), Deactivate(), AddQuestion()
  
- Question: Id, SurveyId, Type (enum), Text, Order, IsRequired, Options (JSON), ValidationRules (JSON)
  - Enum QuestionType: ShortText, LongText, MultipleChoice, Checkboxes, Rating, Date, Email
  - Navigation: Survey, Answers (collection)
  
- Response: Id, SurveyId, RespondentEmail, IpAddress, SubmittedAt
  - Navigation: Survey, Answers (collection)
  
- Answer: Id, ResponseId, QuestionId, AnswerText
  - Navigation: Response, Question

2. DbContext (SurveyLite.Infrastructure/Persistence/):

ApplicationDbContext inherits from DbContext:
- Override SaveChangesAsync to set CreatedAt/UpdatedAt automatically
- Apply all IEntityTypeConfiguration from assembly

3. Entity Configurations (Fluent API):

Create separate configuration classes implementing IEntityTypeConfiguration<T>:
- UserConfiguration: Index on Email (unique), required fields, max lengths
- SurveyConfiguration: HasOne-WithMany for User-Surveys, cascade delete
- QuestionConfiguration: HasOne-WithMany for Survey-Questions, ordered by Order field
- ResponseConfiguration: HasOne-WithMany for Survey-Responses
- AnswerConfiguration: HasOne-WithMany for Response-Answers and Question-Answers

4. Repository Interfaces (SurveyLite.Domain/Interfaces/):

IRepository<T> with common operations:
- Task<T> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
- Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
- Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
- Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
- Task DeleteAsync(T entity, CancellationToken cancellationToken = default);

Specific repositories:
- ISurveyRepository: Task<IEnumerable<Survey>> GetByUserIdAsync(Guid userId, int page, int pageSize);
- IResponseRepository: Task<int> GetResponseCountAsync(Guid surveyId);

5. Repository Implementation (SurveyLite.Infrastructure/Persistence/Repositories/):

GenericRepository<T> base class with EF Core implementation.
Specific repositories inheriting from base.

6. Migration:

Create initial migration with proper naming: Initial_CreateDatabase

Best Practices:
- Use Guid for all IDs (better for distributed systems)
- Index all foreign keys
- Set appropriate max lengths for strings (Email: 256, Title: 200)
- Use JSON columns for flexible data (Options, ValidationRules, Settings)
- Add DeleteBehavior.Cascade where appropriate
- Use value converters for enums
- No navigation properties in DTOs
- Async all the way"
```

**Expected Outcome**:
- ApplicationDbContext.cs with all entity configurations
- Entity classes with proper navigation properties
- Database migration files
- Seed data for testing (1 admin user, 2 sample surveys)

**Why These Choices**:
- PostgreSQL is robust and handles JSON columns well (useful for flexible question options)
- EF Core provides excellent tooling and is well-understood by AI assistants
- Proper relationships ensure data integrity

---

### Task 1.3: Initialize React Frontend with TypeScript

**What to Build**:
- Create React app with Vite (faster than CRA)
- Configure TypeScript strict mode
- Set up folder structure:
  ```
  src/
  ├── components/
  │   ├── common/
  │   ├── survey/
  │   └── admin/
  ├── pages/
  ├── layouts/
  ├── services/
  ├── hooks/
  ├── types/
  ├── utils/
  └── App.tsx
  ```
- Install and configure dependencies:
  - React Router v6
  - React Query (TanStack Query)
  - Tailwind CSS
  - Axios
  - React Hook Form
  - Zod (validation)

**AI Prompt Strategy**:
```
"Create a professional React 18 + TypeScript project with Vite following best practices.

Project Structure (based on Feature-Sliced Design and Atomic Design):

src/
├── app/
│   ├── App.tsx (root component)
│   ├── router.tsx (routing configuration)
│   └── providers.tsx (context providers)
├── pages/
│   ├── LandingPage/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── SettingsPage.tsx
│   ├── surveys/
│   │   ├── SurveyListPage.tsx
│   │   ├── SurveyBuilderPage.tsx
│   │   └── ResponseListPage.tsx
│   └── public/
│       └── PublicSurveyPage.tsx
├── features/ (feature-based modules)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── surveys/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── responses/
├── components/ (shared/common components)
│   ├── ui/ (basic UI components: Button, Input, Card, Modal)
│   ├── forms/ (form components)
│   ├── layout/ (Layout, Header, Sidebar, Footer)
│   └── common/ (LoadingSpinner, ErrorBoundary, etc.)
├── layouts/
│   ├── PublicLayout.tsx
│   ├── DashboardLayout.tsx
│   └── AdminLayout.tsx
├── services/
│   ├── api/ (API client configuration)
│   │   ├── axios.config.ts
│   │   └── endpoints.ts
│   └── queryClient.ts (React Query configuration)
├── hooks/
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── types/
│   ├── models.ts (type definitions matching backend DTOs)
│   ├── api.ts (API request/response types)
│   └── common.ts
├── utils/
│   ├── validation.ts (Zod schemas)
│   ├── formatters.ts
│   └── constants.ts
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx (optional)
└── assets/

Dependencies to install:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

Configuration Files:

1. tsconfig.json (strict mode):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

2. Axios Configuration (src/services/api/axios.config.ts):
```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

3. React Query Configuration (src/services/queryClient.ts):
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

4. ESLint Configuration (.eslintrc.cjs):
Configure rules for:
- No unused variables
- Consistent component naming (PascalCase)
- React hooks rules
- TypeScript rules (no 'any', explicit return types)

5. Prettier Configuration (.prettierrc):
Enforce consistent code style.

Best Practices to Follow:
- Use functional components only (no class components)
- Custom hooks for reusable logic (prefix with 'use')
- Prop interfaces for all components
- Error boundaries around route components
- Lazy loading for routes (React.lazy)
- Memoization for expensive computations (useMemo, useCallback)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation
- No inline styles (use Tailwind classes)
- Extract magic numbers/strings to constants
- Use TypeScript discriminated unions for state machines

Create the initial folder structure and configuration files."
```

**Expected Outcome**:
- Working Vite + React + TypeScript project
- All dependencies installed and configured
- Tailwind CSS working with initial config
- Path aliases set up (@/components, @/services, etc.)
- Axios instance with base URL and interceptors
- React Query provider configured

**Why These Choices**:
- Vite provides significantly faster dev experience
- TypeScript catches errors early and helps Copilot generate better code
- React Query simplifies server state management
- Tailwind + React Hook Form are Copilot-friendly (common patterns)

---

### Task 1.4: Set Up Authentication Infrastructure

**What to Build**:
- **Backend**:
  - JWT token generation service
  - Authentication middleware
  - AuthController with Register/Login endpoints
  - Password hashing using BCrypt
  - Refresh token mechanism

- **Frontend**:
  - AuthContext for managing auth state
  - Protected route wrapper component
  - Login/Register pages (UI only, will style later)
  - Token storage in localStorage/cookies
  - Axios interceptor for adding auth tokens

**AI Prompt Strategy**:
```
Backend:
"Create JWT authentication in .NET 10 Web API.
Include:
- JwtService to generate and validate tokens
- AuthController with Register and Login endpoints
- Password hashing with BCrypt
- User registration with email validation
- Login returning access token and refresh token
- Middleware to validate JWT on protected routes

Use dependency injection and follow SOLID principles."

Frontend:
"Create authentication context in React with TypeScript.
Include:
- AuthContext with login, logout, register functions
- Protected route component that redirects to login
- Hook useAuth for accessing auth state
- Token storage and automatic inclusion in API requests
- Token refresh logic
- Login and Register page components with form validation"
```

**Expected Outcome**:
- Working JWT auth on backend with secure password storage
- Frontend can register, login, and maintain session
- Protected routes work correctly
- Tokens automatically included in API calls
- Auth state persists across page refreshes

**Why These Choices**:
- JWT is stateless and scales well
- Industry standard pattern that Copilot knows well
- Separating auth logic into context makes it reusable

---

## PHASE 2: Core Survey Builder (The Heart of the App)

**Goal**: Create the survey builder interface where users can create and edit surveys with different question types.

**Why This Phase Matters**: This is the core differentiator of the product. A smooth, intuitive builder experience is critical for user retention.

---

### Task 2.1: Backend - Survey CRUD API

**What to Build**:
- Survey entity with full CRUD operations
- API endpoints:
  - `POST /api/surveys` - Create survey
  - `GET /api/surveys` - List user's surveys (paginated)
  - `GET /api/surveys/{id}` - Get single survey with questions
  - `PUT /api/surveys/{id}` - Update survey
  - `DELETE /api/surveys/{id}` - Delete survey
  - `POST /api/surveys/{id}/duplicate` - Clone a survey
  - `PATCH /api/surveys/{id}/status` - Toggle active/inactive

- DTOs for request/response
- Validation using FluentValidation
- Authorization (users can only access their own surveys)

**AI Prompt Strategy**:
```
"Create a complete CRUD API for surveys in .NET 10 Web API using CQRS pattern and Clean Architecture.

1. Commands (SurveyLite.Application/Commands/Surveys/):

CreateSurveyCommand.cs:
```csharp
public record CreateSurveyCommand(
    string Title,
    string Description,
    bool IsActive = false
) : IRequest<SurveyResponseDto>;
```

CreateSurveyCommandHandler.cs:
- Inject ISurveyRepository, IMapper, ICurrentUserService
- Validate command using FluentValidation (CreateSurveyCommandValidator)
- Create Survey entity with UserId from ICurrentUserService
- Save via repository
- Map to DTO and return
- Handle exceptions (throw custom exceptions)

UpdateSurveyCommand, DeleteSurveyCommand with handlers following same pattern.

2. Queries (SurveyLite.Application/Queries/Surveys/):

GetSurveysQuery.cs:
```csharp
public record GetSurveysQuery(
    int Page = 1,
    int PageSize = 10,
    string? SearchTerm = null
) : IRequest<PaginatedResult<SurveyListDto>>;
```

GetSurveysQueryHandler.cs:
- Inject ISurveyRepository, IMapper, ICurrentUserService
- Get user's surveys with pagination
- Apply search filter if provided
- Map to DTOs
- Return PaginatedResult<T>

GetSurveyByIdQuery with handler.

3. DTOs (SurveyLite.Application/DTOs/):

SurveyResponseDto.cs:
```csharp
public record SurveyResponseDto(
    Guid Id,
    string Title,
    string Description,
    bool IsActive,
    int QuestionCount,
    int ResponseCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
```

SurveyListDto, CreateSurveyDto, UpdateSurveyDto.

PaginatedResult<T>.cs:
```csharp
public record PaginatedResult<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);
```

4. Validators (SurveyLite.Application/Validators/):

CreateSurveyCommandValidator.cs using FluentValidation:
```csharp
public class CreateSurveyCommandValidator : AbstractValidator<CreateSurveyCommand>
{
    public CreateSurveyCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");
        
        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");
    }
}
```

5. Controller (SurveyLite.API/Controllers/):

SurveysController.cs:
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication
public class SurveysController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public SurveysController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<SurveyListDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSurveys(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetSurveysQuery(page, pageSize, searchTerm);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSurvey(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetSurveyByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateSurvey(
        [FromBody] CreateSurveyCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetSurvey), new { id = result.Id }, result);
    }
    
    // PUT, DELETE endpoints following same pattern
}
```

6. Current User Service:

ICurrentUserService interface:
```csharp
public interface ICurrentUserService
{
    Guid UserId { get; }
    string Email { get; }
    bool IsAuthenticated { get; }
}
```

Implementation extracts user from ClaimsPrincipal.

Best Practices Applied:
- CQRS: Commands change state, Queries read data
- Mediator pattern: Controllers delegate to handlers
- Thin controllers: No business logic
- Async/await throughout
- Cancellation tokens for graceful cancellation
- ProducesResponseType for OpenAPI documentation
- Authorization at controller level
- Validation at command level
- Repository pattern abstracts data access
- DTOs prevent over-posting and control API contract
- Resource-based URLs (REST conventions)

Install MediatR NuGet package."
```

**Expected Outcome**:
- Clean Architecture with proper layer separation (Domain → Application → Infrastructure → API)
- CQRS pattern separates reads from writes for better scalability
- MediatR decouples controllers from business logic
- FluentValidation ensures data integrity
- Repository pattern abstracts data access
- DTOs provide API contract stability
- Authorization ensures users only access their own data
- Async operations for better performance
- Proper HTTP status codes and error messages
- OpenAPI documentation via attributes

**Why These Choices**:
- **Clean Architecture**: Testability, maintainability, independence from frameworks
- **CQRS**: Read models can be optimized separately from write models, better scalability
- **MediatR**: Single Responsibility, loose coupling, easier to add cross-cutting concerns (logging, validation)
- **Repository Pattern**: Abstracts data access, easier to test, can swap implementations
- **FluentValidation**: Declarative validation, reusable, testable in isolation
- **DTOs**: Prevent over-posting, version API independently from domain model, security
- **Async/Await**: Better resource utilization, improved scalability

---

### Task 2.2: Backend - Question Management API

**What to Build**:
- Question entity supporting multiple types:
  - ShortText (single line)
  - LongText (paragraph)
  - MultipleChoice (radio buttons)
  - Checkboxes (multiple selections)
  - Rating (1-5 stars or 1-10 scale)
  - Date
  - Email

- API endpoints (nested under survey):
  - `POST /api/surveys/{surveyId}/questions` - Add question
  - `PUT /api/surveys/{surveyId}/questions/{id}` - Update question
  - `DELETE /api/surveys/{surveyId}/questions/{id}` - Delete question
  - `PUT /api/surveys/{surveyId}/questions/reorder` - Reorder questions

- Question options storage (for multiple choice/checkboxes) as JSON
- Validation rules storage (required, min/max length, etc.)

**AI Prompt Strategy**:
```
"Create a Question API for a survey builder in .NET 10.

Question types: ShortText, LongText, MultipleChoice, Checkboxes, Rating, Date, Email

Endpoints:
- Add question to survey
- Update question
- Delete question
- Reorder questions (accept array of {id, order})

Question model:
- Type (enum)
- Text (question text)
- Order (display order)
- IsRequired (bool)
- Options (JSON for choice-based questions)
- ValidationRules (JSON for additional rules)

Include DTOs, validation, and authorization (user must own the survey)."
```

**Expected Outcome**:
- Full question management API
- Supports all required question types
- Flexible options storage using JSON columns
- Reordering works correctly (updates order field)
- Validated that questions belong to user's survey

**Why These Choices**:
- JSON columns provide flexibility without complex schema changes
- Nested routes clearly show resource relationship
- Enum for question types ensures type safety

---

### Task 2.3: Frontend - Survey List Page

**What to Build**:
- Dashboard page showing all user surveys
- Components:
  - SurveyCard - displays survey with title, status, response count, actions
  - CreateSurveyButton - opens modal/form to create new survey
  - EmptyState - shown when no surveys exist
  - SearchBar - filter surveys by name
  - StatusFilter - filter by active/inactive

- Features:
  - Grid/list view toggle
  - Pagination
  - Loading states
  - Delete confirmation modal
  - Duplicate survey action

**AI Prompt Strategy**:
```
"Create a survey list page in React with TypeScript.

Components needed:
- SurveyListPage - main page component
- SurveyCard - card showing survey title, description, status badge, response count, last updated, and action menu (edit, duplicate, delete, toggle status)
- CreateSurveyButton - button that opens a modal with form
- EmptyState - friendly message when no surveys exist

Features:
- Fetch surveys using React Query
- Grid layout with Tailwind CSS
- Search filter (client-side filtering)
- Delete confirmation dialog
- Loading skeleton while fetching
- Error state with retry button

Use React Hook Form for the create survey form.
Use Tailwind CSS for styling."
```

**Expected Outcome**:
- Beautiful, responsive survey list
- Smooth loading states
- Working search and filters
- Create/delete operations work
- Optimistic updates (UI updates before API confirms)

**Why These Choices**:
- React Query handles caching, loading, error states automatically
- Card layout is familiar and works on mobile
- Optimistic updates improve perceived performance

---

### Task 2.4: Frontend - Survey Builder Interface

**What to Build**:
- Survey builder page with two panels:
  - Left: Question list with drag-drop reordering
  - Right: Question editor form

- Components:
  - QuestionList - draggable list of questions
  - QuestionItem - individual question with preview
  - QuestionEditor - form to edit selected question
  - QuestionTypeSelector - dropdown to choose type
  - OptionEditor - for multiple choice/checkbox options
  - AddQuestionButton - adds new question

- Features:
  - Add/edit/delete questions
  - Drag-drop reordering (use react-beautiful-dnd or dnd-kit)
  - Live preview of current question
  - Auto-save (debounced)
  - Question type-specific settings
  - Mark questions as required

**AI Prompt Strategy**:
```
"Create a survey builder interface in React with TypeScript.

Layout:
- Split screen: left side shows question list, right side shows editor
- Left panel: draggable question list using @dnd-kit/core
- Right panel: form to edit selected question

Components:
- SurveyBuilder - main container
- QuestionList - renders draggable questions
- QuestionItem - displays question with type icon, text preview, delete button
- QuestionEditor - form with fields: question text, type selector, required checkbox, type-specific options
- OptionEditor - for adding/editing multiple choice options

Features:
- Add question button (adds to end of list)
- Click question to edit in right panel
- Drag to reorder questions
- Auto-save changes after 1 second debounce
- Delete question with confirmation

Use React Hook Form, React Query mutations, and Tailwind CSS."
```

**Expected Outcome**:
- Intuitive drag-drop interface
- Smooth editing experience
- Auto-save works reliably
- Different question types render correctly
- Changes persist to backend

**Why These Choices**:
- Split-pane layout is standard for builder UIs
- Auto-save reduces fear of losing work
- dnd-kit is modern and accessible
- Debouncing prevents excessive API calls

---

### Task 2.5: Frontend - Question Type Components

**What to Build**:
- Specific components for each question type:
  - ShortTextQuestion - single-line input
  - LongTextQuestion - textarea
  - MultipleChoiceQuestion - radio buttons with options editor
  - CheckboxQuestion - checkboxes with options editor
  - RatingQuestion - star rating or number scale
  - DateQuestion - date picker
  - EmailQuestion - email input with validation

- Each component needs:
  - Preview mode (how it looks in builder)
  - Edit mode (settings form)
  - Answer mode (how respondents see it)

**AI Prompt Strategy**:
```
"Create question type components for a survey builder in React.

For each question type (ShortText, LongText, MultipleChoice, Checkboxes, Rating, Date, Email), create:

1. Editor component - form to configure the question:
   - Text input for question text
   - Required toggle
   - Type-specific settings (e.g., for Rating: min/max values, scale type)
   - For choice-based: add/edit/delete/reorder options

2. Preview component - shows how the question appears to respondents:
   - Displays question text
   - Shows appropriate input control
   - Displays required indicator

3. Answer component - functional input for respondents:
   - Proper HTML input types
   - Validation
   - Error messages

Use TypeScript interfaces for question props.
Use Tailwind CSS for consistent styling.
Use React Hook Form for form handling."
```

**Expected Outcome**:
- All question types have proper UI
- Settings forms are type-appropriate
- Previews look professional
- Validation works correctly

**Why These Choices**:
- Separating editor/preview/answer makes code reusable
- Type-specific components keep logic isolated
- Better UX when each type has tailored settings

---

## PHASE 3: Public Survey Form & Response Collection

**Goal**: Allow respondents to fill out surveys via public links and store their responses.

**Why This Phase Matters**: This is where the actual value is delivered - collecting real feedback from users.

---

### Task 3.1: Backend - Public Survey Access API

**What to Build**:
- API endpoint for public survey access:
  - `GET /api/public/surveys/{id}` - Get survey structure (no auth required)
  - Validate survey is active
  - Return survey with questions (no personally identifiable info from creator)
  - Track view count (optional analytics)

**AI Prompt Strategy**:
```
"Create a public survey API endpoint in .NET 10.

Endpoint: GET /api/public/surveys/{id}

Requirements:
- No authentication required
- Return survey only if IsActive = true
- Return survey title, description, questions with type, order, options
- Do NOT return creator info, internal IDs, or sensitive data
- Return 404 if survey not found or inactive
- Log view for analytics (optional)

Create PublicSurveyDTO that exposes only public fields."
```

**Expected Outcome**:
- Public can access active surveys without logging in
- Inactive surveys return 404
- No sensitive data exposed
- Clean, minimal response payload

**Why These Choices**:
- Separate endpoint improves security (different DTO)
- No auth required makes sharing easy
- Validation prevents accessing draft surveys

---

### Task 3.2: Backend - Response Submission API

**What to Build**:
- API to submit survey responses:
  - `POST /api/public/surveys/{surveyId}/responses` - Submit response
  - Validate all required questions are answered
  - Validate answer format matches question type
  - Store Response entity with timestamp
  - Store individual Answers for each question
  - Optional: rate limiting to prevent spam
  - Optional: reCAPTCHA integration

**AI Prompt Strategy**:
```
"Create a survey response submission API in .NET 10.

Endpoint: POST /api/public/surveys/{surveyId}/responses

Request body:
{
  "respondentEmail": "optional@email.com",
  "answers": [
    {"questionId": "guid", "answerText": "value"}
  ]
}

Validation:
- Survey must be active
- All required questions must be answered
- Answer format must match question type (e.g., email questions validated as email)
- Multiple choice answers must be from available options

Create Response entity with ResponseId, SurveyId, SubmittedAt
Create Answer entities for each question answer

Return 200 with success message and responseId.
Return 400 for validation errors with detailed messages."
```

**Expected Outcome**:
- Responses successfully stored in database
- Validation prevents invalid submissions
- Clear error messages guide respondents
- Response ID returned for confirmation page

**Why These Choices**:
- Server-side validation ensures data quality
- Detailed validation errors improve UX
- Timing metadata useful for analytics

---

### Task 3.3: Frontend - Public Survey Form Page

**What to Build**:
- Public-facing survey form page
- Components:
  - PublicSurveyPage - main container
  - SurveyHeader - displays title and description
  - QuestionRenderer - renders each question based on type
  - SubmitButton - with loading state
  - ThankYouPage - shown after submission
  - ProgressBar - shows completion percentage

- Features:
  - Fetch survey from public API
  - Render all questions in order
  - Client-side validation
  - Show required field indicators
  - Prevent multiple submissions (cookie/localStorage)
  - Mobile-responsive design
  - Smooth scrolling between questions

**AI Prompt Strategy**:
```
"Create a public survey form page in React with TypeScript.

Components:
- PublicSurveyPage - fetches survey by ID from URL params
- SurveyHeader - shows title and description
- QuestionList - renders all questions
- QuestionRenderer - dynamically renders question based on type (ShortText, LongText, MultipleChoice, etc.)
- ProgressBar - shows % completion based on answered questions
- SubmitButton - submits all answers, shows loading state

Features:
- Fetch survey using React Query
- Use React Hook Form to manage form state
- Validate required fields before submission
- Show validation errors inline
- On successful submission, show thank you message
- Use Tailwind CSS for clean, professional styling
- Mobile responsive

Handle errors gracefully (survey not found, inactive, or submission failed)."
```

**Expected Outcome**:
- Professional-looking survey form
- All question types render correctly
- Validation works client-side
- Successful submission shows confirmation
- Works perfectly on mobile devices

**Why These Choices**:
- Public form is the respondent's only touchpoint - must be polished
- React Hook Form handles complex nested validation
- Progress bar increases completion rates
- Mobile-first design ensures accessibility

---

### Task 3.4: Frontend - Thank You / Confirmation Page

**What to Build**:
- Confirmation screen shown after submission
- Components:
  - ConfirmationMessage - success message
  - ResponseId display (optional)
  - ShareButtons - share survey on social media (optional)
  - RedirectOption - if survey creator set a redirect URL

**AI Prompt Strategy**:
```
"Create a thank you page component in React for after survey submission.

Display:
- Success icon (checkmark)
- Thank you message
- Optional: custom message from survey creator
- Optional: response ID for tracking
- Optional: social share buttons

Use Tailwind CSS for clean, centered design.
Auto-redirect after 5 seconds if redirect URL is configured."
```

**Expected Outcome**:
- Friendly, reassuring confirmation
- Professional appearance
- Optional auto-redirect works

**Why These Choices**:
- Good UX to confirm submission
- Share buttons can increase viral growth
- Custom messages allow personalization

---

## PHASE 4: Response Viewing & Analytics

**Goal**: Allow survey creators to view collected responses and gain insights.

**Why This Phase Matters**: This is the core value delivery for the survey creator - seeing and understanding the feedback.

---

### Task 4.1: Backend - Response Retrieval API

**What to Build**:
- API endpoints for viewing responses:
  - `GET /api/surveys/{surveyId}/responses` - List all responses (paginated)
  - `GET /api/surveys/{surveyId}/responses/{responseId}` - Single response detail
  - `GET /api/surveys/{surveyId}/analytics` - Aggregated statistics
  - `GET /api/surveys/{surveyId}/export` - Export to CSV

- Analytics data:
  - Total response count
  - Response rate over time (daily/weekly)
  - Per-question statistics:
    - Multiple choice: count per option, percentage
    - Rating: average, min, max
    - Text: word cloud data (optional)

**AI Prompt Strategy**:
```
"Create response viewing and analytics API in .NET 10.

Endpoints:

1. GET /api/surveys/{surveyId}/responses
   - Return paginated list of responses with basic info
   - Include answeredAt, respondentEmail (if provided)
   - Pagination: page, pageSize
   - Filter options: dateFrom, dateTo

2. GET /api/surveys/{surveyId}/responses/{responseId}
   - Return full response with all answers
   - Join with questions to show question text alongside answers

3. GET /api/surveys/{surveyId}/analytics
   - Return aggregated statistics:
     - Total responses
     - Responses per day (last 30 days)
     - Per-question statistics based on type:
       - Multiple choice: {option: count} for each option
       - Rating: {average, min, max, count}
       - Text: count of responses
   - Calculate percentages for choice-based questions

4. GET /api/surveys/{surveyId}/export
   - Return CSV file with all responses
   - One row per response
   - Columns: ResponseId, SubmittedAt, Email, [Question columns]

All endpoints require authentication and verify user owns the survey."
```

**Expected Outcome**:
- Complete response data retrieval
- Efficient analytics calculations
- CSV export works correctly
- Proper authorization checks

**Why These Choices**:
- Separate endpoints for list/detail/analytics follows REST principles
- Aggregated analytics reduce client-side processing
- CSV export is essential for data portability

---

### Task 4.2: Frontend - Response List Page

**What to Build**:
- Page showing all responses for a survey
- Components:
  - ResponseListPage - main container
  - ResponseTable - table of responses
  - ResponseRow - individual row with preview
  - FilterBar - date range, search filters
  - ExportButton - download CSV

- Features:
  - Sortable columns (date, email)
  - Pagination
  - Click row to view full response
  - Bulk actions (delete selected)
  - Date range filter
  - Export to CSV

**AI Prompt Strategy**:
```
"Create a response list page in React with TypeScript.

Components:
- ResponseListPage - fetches responses for a survey
- ResponseTable - table with columns: Date, Email (if provided), Preview (first answer), Actions
- FilterBar - date range picker, search box
- ExportButton - downloads CSV
- Pagination - controls at bottom

Features:
- Fetch responses using React Query
- Sort by date (newest first by default)
- Click row to navigate to detail view
- Export button calls API and downloads CSV
- Loading skeleton while fetching
- Empty state if no responses

Use Tailwind CSS for styling.
Use a date picker library like react-datepicker."
```

**Expected Outcome**:
- Clean, readable table of responses
- Filters work smoothly
- Export downloads CSV file
- Pagination handles large datasets

**Why These Choices**:
- Table format is familiar for data viewing
- Filters essential for large response volumes
- CSV export allows further analysis in Excel/Sheets

---

### Task 4.3: Frontend - Response Detail Page

**What to Build**:
- Detailed view of a single response
- Components:
  - ResponseDetailPage - main container
  - ResponseHeader - metadata (date, email, response ID)
  - AnswerList - displays all Q&A pairs
  - AnswerItem - single question and answer
  - NavigationButtons - prev/next response

- Features:
  - Shows question text and answer for each question
  - Highlights conditional logic (if applicable)
  - Delete response option
  - Print-friendly view

**AI Prompt Strategy**:
```
"Create a response detail page in React with TypeScript.

Layout:
- Header with metadata: submission date, respondent email, response ID
- List of questions and answers (Q&A format)
- Each answer displayed based on question type:
  - Text questions: display text
  - Multiple choice: highlight selected option
  - Rating: show stars or number
  - Date: formatted date

Features:
- Fetch single response using React Query
- Delete button with confirmation
- Previous/Next buttons to navigate between responses
- Print button (window.print)
- Back to list link

Use Tailwind CSS for clean, readable layout."
```

**Expected Outcome**:
- Easy-to-read Q&A format
- Navigation between responses works
- Print view is clean
- Delete function works

**Why These Choices**:
- Q&A format is most readable for reviewing individual responses
- Navigation reduces page loads
- Print functionality useful for sharing offline

---

### Task 4.4: Frontend - Analytics Dashboard

**What to Build**:
- Analytics page with visualizations
- Components:
  - AnalyticsDashboard - main container
  - SummaryCards - total responses, avg completion time, etc.
  - ResponseChart - line chart of responses over time
  - QuestionBreakdown - per-question statistics
  - PieChart - for multiple choice questions
  - RatingDisplay - visual rating averages

- Features:
  - Fetch analytics data
  - Interactive charts (use Chart.js or Recharts)
  - Filter by date range
  - Export chart as image (optional)

**AI Prompt Strategy**:
```
"Create an analytics dashboard in React with TypeScript using Recharts.

Components:
- AnalyticsDashboard - main page
- SummaryCards - row of metric cards showing:
  - Total responses
  - Average responses per day
  - Completion rate
- ResponseChart - line chart showing responses over time (last 30 days)
- QuestionBreakdown - section for each question showing:
  - Multiple choice: pie chart with percentages
  - Rating: average with star display
  - Text: response count

Features:
- Fetch analytics data using React Query  
- Interactive charts with tooltips
- Date range selector
- Responsive layout with Tailwind CSS

Use Recharts for charts (LineChart, PieChart, BarChart)."
```

**Expected Outcome**:
- Beautiful, interactive analytics dashboard
- Charts render correctly with data
- Insights are easy to understand
- Mobile-responsive layout

**Why These Choices**:
- Visual analytics are more engaging than tables
- Recharts is declarative and works well with React
- Summary cards provide quick overview
- Per-question breakdown helps identify trends

---

## PHASE 5: Dashboard & User Experience

**Goal**: Create the main dashboard and improve overall user experience with settings, onboarding, etc.

**Why This Phase Matters**: A polished dashboard ties everything together and provides a home base for users.

---

### Task 5.1: Frontend - Main Dashboard Page

**What to Build**:
- User dashboard (home page after login)
- Components:
  - DashboardPage - main container
  - WelcomeSection - greeting and quick actions
  - RecentSurveys - 5 most recent surveys
  - ActivityFeed - recent responses
  - QuickStats - total surveys, total responses, active surveys
  - QuickActions - create survey, view all surveys, settings

**AI Prompt Strategy**:
```
"Create a user dashboard home page in React with TypeScript.

Layout:
- Top: Welcome message with user name
- Stats row: Cards showing total surveys, total responses, active surveys
- Two columns:
  - Left: Recent surveys (5 most recent) with quick actions
  - Right: Recent activity (last 10 responses across all surveys)
- Quick action buttons: Create New Survey, View All Surveys, Account Settings

Features:
- Fetch dashboard data using React Query (combined endpoint recommended)
- Click survey to navigate to edit
- Click response to view detail
- Responsive layout (stacks on mobile)
- Use Tailwind CSS for styling"
```

**Expected Outcome**:
- Informative, actionable dashboard
- Quick access to common tasks
- Recent activity provides engagement
- Clean, professional design

**Why These Choices**:
- Dashboard provides orientation for users
- Quick stats show progress/growth
- Recent activity encourages engagement

---

### Task 5.2: Backend - Dashboard Statistics API

**What to Build**:
- Endpoint for dashboard data:
  - `GET /api/dashboard/stats` - Returns aggregated dashboard data
  - User's survey count (total, active, inactive)
  - Total response count across all surveys
  - Recent surveys (5 most recent)
  - Recent responses (10 most recent across all surveys)
  - Trends: responses this week vs last week

**AI Prompt Strategy**:
```
"Create a dashboard statistics API endpoint in .NET 10.

Endpoint: GET /api/dashboard/stats

Return:
- surveyStats: { total, active, inactive, drafts }
- responseStats: { total, thisWeek, thisMonth, trend (% change from last week) }
- recentSurveys: Array of 5 most recent surveys with { id, title, isActive, questionCount, responseCount, lastResponseAt, createdAt }
- recentResponses: Array of 10 recent responses across all user's surveys with { surveyId, surveyTitle, submittedAt, respondentEmail }
- activityTrend: Responses per day for last 30 days (for chart)
- topSurveys: Top 5 surveys by response count

Use efficient queries (single database round-trip if possible).
Require authentication.
Only return data for the authenticated user's surveys."
```

**Expected Outcome**:
- Single endpoint returns all dashboard data
- Efficient query (minimal database calls)
- Properly calculated trends
- Only user's data returned

**Why These Choices**:
- Single endpoint reduces API calls
- Aggregated data calculated server-side (more efficient)
- Trends provide motivation and insights

---

### Task 5.3: Frontend - User Settings Page

**What to Build**:
- User account settings page
- Components:
  - SettingsPage - tabbed interface
  - ProfileTab - name, email, password change
  - PreferencesTab - UI preferences, email notifications
  - SecurityTab - two-factor authentication, active sessions
  - DangerZoneTab - export data, delete account

- Features:
  - Update profile information
  - Change password
  - View current subscription tier
  - View usage (responses used vs limit)
  - Delete account (with confirmation)

**AI Prompt Strategy**:
```
"Create a user settings page in React with TypeScript.

Use tabs for organization:
1. Profile tab:
   - Form to update first name, last name, and email
   - Change password section (requires current password)
   - Avatar upload (optional)

2. Preferences tab:
   - Theme selection (light/dark/system)
   - Email notification preferences
   - Language selection (if multi-language support)

3. Security tab:
   - Two-factor authentication setup
   - Active sessions list with ability to revoke
   - Login history

4. Danger Zone tab:
   - Export all data button (downloads JSON)
   - Delete account button (requires password confirmation and double confirmation modal)

Use React Hook Form for forms.
Use Tailwind CSS for styling.
Include success/error notifications after actions.
Validate email format and password strength.
Show loading states during API calls."
```

**Expected Outcome**:
- Clean settings interface
- Profile updates work correctly
- Password change is secure
- Usage stats visible
- Account deletion works (with safeguards)

**Why These Choices**:
- Tabbed interface organizes settings logically
- Usage visibility helps users understand limits
- Danger zone separates destructive actions

---

### Task 5.4: Backend - User Settings API

**What to Build**:
- API endpoints for user settings:
  - `GET /api/user/profile` - Get user profile
  - `PUT /api/user/profile` - Update name/email
  - `POST /api/user/change-password` - Change password
  - `DELETE /api/user/account` - Delete account (and all data)

**AI Prompt Strategy**:
```
"Create user settings API endpoints in .NET 10.

Endpoints:
1. GET /api/user/profile
   - Return user profile (id, firstName, lastName, email, role, createdAt, lastLoginAt, preferences)

2. PUT /api/user/profile
   - Update firstName, lastName, and/or email
   - Validate email format and uniqueness
   - If email changed, require re-verification (optional)

3. POST /api/user/change-password
   - Require current password for verification
   - Validate new password strength (min 8 chars, uppercase, lowercase, number, special char)
   - Hash and save new password using BCrypt
   - Invalidate all existing sessions except current (optional)

4. GET /api/user/sessions
   - List active sessions (device, location, last activity)
   - Allow revoking individual sessions

5. DELETE /api/user/account
   - Require password confirmation
   - Soft delete user (mark as deleted, keep data for 30 days)
   - Or hard delete: cascade delete all surveys, questions, responses
   - Log deletion in audit trail

Include proper validation and error handling.
Require authentication for all endpoints."
```

**Expected Outcome**:
- Profile updates work securely
- Password change validates current password
- Email uniqueness enforced
- Account deletion is irreversible but confirmed

**Why These Choices**:
- Separate endpoints follow single responsibility
- Password verification prevents unauthorized changes
- Soft delete preserves data integrity options

---

## PHASE 6: Admin Panel

**Goal**: Create admin functionality for managing users and monitoring system health.

**Why This Phase Matters**: Admin capabilities are essential for managing a SaaS product and supporting users.

---

### Task 6.1: Backend - Admin User Management API

**What to Build**:
- Admin-only endpoints:
  - `GET /api/admin/users` - List all users (paginated)
  - `GET /api/admin/users/{id}` - Get user details
  - `PUT /api/admin/users/{id}/role` - Change user role (User/Admin)
  - `PUT /api/admin/users/{id}/status` - Activate/deactivate user
  - `DELETE /api/admin/users/{id}` - Delete user
  - `GET /api/admin/stats` - System-wide statistics
  - `GET /api/admin/audit-log` - System audit log

- Authorization attribute for admin role
- Statistics include:
  - Total users, surveys, responses
  - Active users (logged in last 30 days)
  - Subscription breakdown (Free/Pro/Business counts)
  - Growth trends

**AI Prompt Strategy**:
```
"Create admin user management API in .NET 10.

Create [Authorize(Roles = "Admin")] attribute for admin-only endpoints.

Endpoints:
1. GET /api/admin/users
   - Paginated list of all users
   - Include: id, name, email, role, surveyCount, responseCount, createdAt, lastLoginAt, isActive
   - Filter options: role (User/Admin), isActive, search by email/name
   - Sort options: name, email, createdAt, lastLoginAt

2. GET /api/admin/users/{id}
   - Detailed user info
   - Include list of surveys with response counts
   - Include activity history

3. PUT /api/admin/users/{id}/role
   - Change user's role (User \u2192 Admin or Admin \u2192 User)
   - Body: { role: "User|Admin" }
   - Log this action in audit log

4. PUT /api/admin/users/{id}/status
   - Activate or deactivate user account
   - Body: { isActive: true|false }
   - Deactivated users cannot login

5. DELETE /api/admin/users/{id}
   - Soft delete user (mark as deleted, don't actually remove)
   - Or hard delete: cascade delete all surveys, questions, responses
   - Log this action

6. GET /api/admin/stats
   - Return system statistics:
     - Total users (active/inactive)
     - Total surveys (active/inactive)
     - Total responses
     - Active users (logged in last 30 days)
     - Users by role (User count, Admin count)
     - Growth trends (new users/surveys/responses this month vs last month)
     - System health metrics (database size, API response times)

7. GET /api/admin/audit-log
   - Paginated list of admin actions
   - Include: timestamp, admin user, action type, target user/resource, details

All require Admin role."
```

**Expected Outcome**:
- Admin can view all users
- Can change subscriptions
- Can delete users if needed
- System stats provide oversight

**Why These Choices**:
- Role-based authorization is standard and secure
- User management essential for customer support
- System stats help monitor health

---

### Task 6.2: Frontend - Admin Dashboard

**What to Build**:
- Admin panel with different layout
- Components:
  - AdminDashboard - main admin home
  - SystemStatsCards - overview metrics
  - UserManagementTable - list of users
  - UserDetailModal - view/edit user
  - AdminSidebar - admin navigation

- Features:
  - View system statistics
  - Search/filter users
  - Change user subscription tiers
  - View user's surveys
  - System health indicators

**AI Prompt Strategy**:
```
"Create an admin dashboard in React with TypeScript.

Layout:
- Admin-specific sidebar navigation
- Dashboard with system stats cards:
  - Total users
  - Total surveys
  - Total responses
  - Active users (logged in last 30 days)
  - System health metrics
- User management table:
  - Columns: Name, Email, Role, Surveys, Responses, Joined Date, Last Login, Actions
  - Search by email/name
  - Filter by role (User/Admin)
  - Click to view user detail
- Charts showing growth trends (users, surveys, responses over time)

Features:
- Fetch admin data using React Query
- Table with sorting and pagination
- Edit user subscription (dropdown in modal)
- Delete user with confirmation
- Use Tailwind CSS
- Use Recharts for charts

Only accessible to admin users (check role in AuthContext)."
```

**Expected Outcome**:
- Functional admin dashboard
- User management works smoothly
- System oversight is clear
- Restricted to admin role

**Why These Choices**:
- Separate admin layout distinguishes admin tasks
- Table view efficient for managing users
- Real-time stats help monitor growth

---

## PHASE 7: Polish & Production Readiness

**Goal**: Add final touches, error handling, loading states, and prepare for deployment.

**Why This Phase Matters**: Polish separates professional products from prototypes. Production readiness ensures reliability.

---

### Task 7.1: Frontend - Error Handling & Loading States

**What to Build**:
- Comprehensive error handling:
  - Global error boundary
  - API error handling with user-friendly messages
  - Network error detection
  - 404 page for invalid routes
  - 403 page for unauthorized access

- Loading states:
  - Skeleton loaders for all data fetching
  - Button loading spinners
  - Progress indicators for long operations

**AI Prompt Strategy**:
```
"Add comprehensive error handling and loading states to React app.

1. Create ErrorBoundary component:
   - Catches React errors
   - Shows friendly error page
   - Option to reload

2. Create NotFoundPage component (404)

3. Create UnauthorizedPage component (403)

4. Create LoadingSkeleton components:
   - SurveyCardSkeleton
   - TableSkeleton
   - DashboardSkeleton

5. Update all API calls to show:
   - Loading state (skeleton)
   - Error state (error message with retry button)
   - Empty state (when no data)

6. Create Toast notification system:
   - Success, error, info, warning types
   - Auto-dismiss after 5 seconds
   - Use React Context for global access

Use Tailwind CSS for styling.
Use react-hot-toast or similar library for toasts."
```

**Expected Outcome**:
- App never shows raw errors to users
- Loading states prevent confusion
- Error messages are helpful
- Toast notifications provide feedback

**Why These Choices**:
- Error boundaries prevent white screen of death
- Skeletons improve perceived performance
- Toast notifications are non-intrusive feedback

---

### Task 7.2: Backend - Logging, Validation, and Error Handling

**What to Build**:
- Structured logging using Serilog
- Global exception handler middleware
- Request/response logging
- Validation error standardization
- Health check endpoint

**AI Prompt Strategy**:
```
"Add production-ready error handling and logging to .NET 10 Web API.

1. Configure Serilog:
   - Log to console and file
   - Include request ID, user ID, timestamp
   - Different log levels for different environments

2. Create GlobalExceptionHandler middleware:
   - Catch all unhandled exceptions
   - Return standardized error response: { error: message, statusCode, timestamp }
   - Log exceptions with stack trace
   - Don't expose internal errors in production

3. Create ValidationExceptionHandler:
   - Convert FluentValidation errors to consistent format
   - Return 400 with field-level errors

4. Add request logging middleware:
   - Log HTTP method, path, status code, duration
   - Don't log sensitive data (passwords, tokens)

5. Add health check endpoint:
   - GET /health
   - Check database connection
   - Return 200 OK if healthy, 503 if unhealthy

Configure in Program.cs."
```

**Expected Outcome**:
- All errors logged systematically
- Consistent error response format
- Health checks enable monitoring
- No sensitive data in logs

**Why These Choices**:
- Structured logging essential for debugging production issues
- Standardized errors improve API usability
- Health checks enable uptime monitoring

---

### Task 7.3: Frontend - Responsive Design & Mobile Optimization

**What to Build**:
- Ensure all pages work on mobile
- Mobile-specific components:
  - Mobile navigation menu (hamburger)
  - Mobile-optimized tables (card view on small screens)
  - Touch-friendly buttons and forms
  - Mobile survey taking experience

**AI Prompt Strategy**:
```
"Optimize React app for mobile devices.

1. Create MobileNav component:
   - Hamburger menu icon
   - Slide-out sidebar
   - Works on screens < 768px

2. Update DashboardLayout:
   - Hide sidebar on mobile
   - Show hamburger menu
   - Responsive padding and spacing

3. Update tables to show as cards on mobile:
   - ResponseTable
   - UserManagementTable
   - Stack data vertically in cards

4. Optimize survey form for mobile:
   - Larger touch targets
   - Better keyboard handling
   - One question per screen option (multi-step form)

5. Test navigation and forms on mobile viewport

Use Tailwind's responsive classes (sm:, md:, lg:)."
```

**Expected Outcome**:
- Entire app usable on mobile
- Navigation works smoothly
- Forms are easy to fill on phone
- No horizontal scrolling

**Why These Choices**:
- 60%+ users may access via mobile
- Mobile survey taking is common use case
- Responsive design is expected baseline

---

### Task 7.4: Backend & Frontend - Testing Setup

**What to Build**:
- Backend:
  - Unit tests for critical business logic
  - Integration tests for API endpoints
  - Use xUnit and Moq

- Frontend:
  - Component tests using React Testing Library
  - E2E tests for critical flows using Playwright
  - Test authentication, survey creation, response submission

**AI Prompt Strategy**:
```
Backend:
"Create unit and integration tests for .NET 10 Web API using xUnit.

1. Unit tests for:
   - JwtService (token generation/validation)
   - Survey validation logic
   - Analytics calculations

2. Integration tests for:
   - Auth endpoints (register, login)
   - Survey CRUD endpoints
   - Response submission endpoint

Use Moq for mocking dependencies.
Use WebApplicationFactory for integration tests.
Aim for 70%+ code coverage on critical paths."

Frontend:
"Create tests for React app using React Testing Library and Vitest.

1. Component tests:
   - SurveyCard rendering
   - Login form validation
   - QuestionRenderer for different types

2. E2E tests using Playwright:
   - Complete user journey: register → login → create survey → view responses
   - Public survey submission flow
   - Admin user management

Configure test scripts in package.json."
```

**Expected Outcome**:
- Core functionality has test coverage
- Critical paths protected by E2E tests
- Regression detection capability
- CI/CD ready tests

**Why These Choices**:
- Tests prevent regressions during AI code generation
- E2E tests validate complete flows
- Testing critical paths ensures quality

---

### Task 7.5: Deployment Configuration

**What to Build**:
- Backend:
  - Docker containerization
  - appsettings for different environments
  - Database migration strategy
  - CI/CD pipeline (GitHub Actions)

- Frontend:
  - Production build configuration
  - Environment variables
  - Static hosting setup (Vercel/Netlify)

- Database:
  - PostgreSQL on cloud (AWS RDS, Azure, or Supabase)
  - Connection pooling
  - Backup strategy

**AI Prompt Strategy**:
```
Backend:
"Create deployment configuration for .NET 10 Web API.

1. Create Dockerfile:
   - Multi-stage build
   - Use .NET 10 SDK for build, runtime for production
   - Expose port 80

2. Create docker-compose.yml:
   - API service
   - PostgreSQL service
   - Environment variables

3. Create appsettings.Production.json:
   - Connection strings from env vars
   - Serilog configured for cloud
   - CORS for production frontend URL

4. Create GitHub Actions workflow:
   - Build and test on push
   - Deploy to cloud on merge to main
   - Run database migrations

Frontend:
"Configure React app for production deployment.

1. Update Vite config:
   - Environment variable handling
   - Build optimization
   - API URL from environment

2. Create .env.production

3. Create deployment workflow:
   - Build React app
   - Deploy to Vercel/Netlify
   - Preview deployments for PRs

4. Add deploy scripts to package.json"
```

**Expected Outcome**:
- App runs in Docker containers
- Automated deployment pipeline
- Environment-specific configuration
- Production-ready setup

**Why These Choices**:
- Docker ensures consistency across environments
- Automated deployment reduces errors
- Cloud hosting provides scalability

---

## PHASE 8: Documentation & Marketing Pages

**Goal**: Create landing page, documentation, and pricing page.

**Why This Phase Matters**: These pages drive acquisition and help users understand the product.

---

### Task 8.1: Frontend - Landing Page

**What to Build**:
- Marketing landing page
- Sections:
  - Hero with value proposition and CTA
  - Features showcase (3-4 key features)
  - How it works (3 steps)
  - Testimonials/social proof
  - Pricing table
  - FAQ section
  - Footer with links

**AI Prompt Strategy**:
```
"Create a landing page for a survey SaaS tool in React.

Sections:
1. Hero:
   - Headline: 'Create Beautiful Surveys in Minutes'
   - Subheadline: value proposition
   - CTA buttons: 'Start Free Trial' and 'See Demo'
   - Hero image or illustration

2. Features (3 columns):
   - Easy drag-drop builder
   - Real-time analytics
   - Mobile-friendly surveys

3. How It Works (3 steps with icons):
   - Create your survey
   - Share the link
   - View responses

4. Pricing table:
   - Free, Pro, Business tiers
   - Feature comparison
   - CTA buttons

5. FAQ (accordion):
   - 5-6 common questions

6. Footer:
   - Links, social media, contact

Use Tailwind CSS for modern, professional design.
Use Framer Motion for scroll animations (optional).
Fully responsive."
```

**Expected Outcome**:
- Professional landing page
- Clear value proposition
- Convincing CTAs
- Mobile responsive

**Why These Choices**:
- Landing page is first impression
- Social proof builds trust
- Clear pricing increases conversions

---

### Task 8.2: Frontend - Pricing Page

**What to Build**:
- Detailed pricing page
- Components:
  - PricingTable - 3 tiers with features
  - FeatureComparison - detailed feature matrix
  - FAQ specific to pricing
  - Toggle for monthly/annual billing

**AI Prompt Strategy**:
```
"Create a pricing page in React with TypeScript.

Layout:
- Toggle for Monthly/Annual (show annual savings)
- Three pricing cards:
  - Free: $0, 50 responses/month, 3 surveys
  - Pro: $15/month ($150/year), 1,000 responses, unlimited surveys
  - Business: $49/month ($490/year), 10,000 responses, team features

Features comparison table below cards.

Each card has:
- Name and price
- Feature list with checkmarks
- CTA button (Sign Up / Upgrade)

Use Tailwind CSS.
Highlight Pro tier as 'Most Popular'."
```

**Expected Outcome**:
- Clear pricing tiers
- Feature comparison helps decision
- Annual billing toggle works
- CTAs link to signup/upgrade

**Why These Choices**:
- Transparent pricing builds trust
- Feature comparison helps users choose
- Annual billing increases LTV

---

### Task 8.3: Documentation - README and Prompt Log

**What to Build**:
- Comprehensive README.md with:
  - Project overview
  - Tech stack
  - Setup instructions
  - Architecture diagram
  - API documentation (brief)
  - Deployment guide

- PROMPT_LOG.md documenting:
  - All major AI prompts used
  - Results and modifications
  - Insights on what worked

**AI Prompt Strategy**:
```
"Create comprehensive README.md for a survey SaaS application.

Include:
1. Project Overview:
   - Description
   - Key features
   - Tech stack

2. Getting Started:
   - Prerequisites
   - Installation steps (backend and frontend)
   - Environment variables needed
   - Database setup
   - Running locally

3. Architecture:
   - High-level architecture diagram (Mermaid)
   - Folder structure explanation

4. API Documentation:
   - Brief overview of main endpoints
   - Authentication flow

5. Deployment:
   - Docker deployment
   - Cloud deployment options

6. Testing:
   - How to run tests

7. License and Contact

Use proper markdown formatting with code blocks, lists, and sections."
```

**Expected Outcome**:
- Complete project documentation
- Easy for others to run locally
- Clear architecture explanation
- Prompt history preserved

**Why These Choices**:
- README is essential for open-source/portfolio
- Documentation helps future maintenance
- Prompt log fulfills assignment requirements

---

## Software Architecture Principles

### Core Architectural Patterns

**Backend Architecture**:
- **Clean Architecture**: Separation of concerns with distinct layers
  - Domain Layer: Core business entities and rules
  - Application Layer: Use cases and business logic
  - Infrastructure Layer: Database, external services
  - API Layer: Controllers, middleware, DTOs

- **CQRS Pattern**: Separate read and write operations for better scalability
  - Commands: State-changing operations (Create, Update, Delete)
  - Queries: Read-only operations with optimized DTOs

- **Repository Pattern**: Abstract data access logic
  - Generic repository for common operations
  - Specific repositories for complex queries

- **Dependency Injection**: Loose coupling and testability
  - Interface-based programming
  - Constructor injection
  - Service lifetime management

**Frontend Architecture**:
- **Component-Based Architecture**: Reusable, composable UI components
  - Atomic Design: Atoms → Molecules → Organisms → Templates → Pages
  - Smart vs Presentational components
  - Custom hooks for business logic

- **Container/Presenter Pattern**: Separate data fetching from presentation
  - Container components handle data and state
  - Presenter components handle UI rendering

- **Single Responsibility Principle**: Each component/module has one purpose

### SOLID Principles Application

**S - Single Responsibility**:
- Each class/component has one reason to change
- Controllers only handle HTTP concerns
- Services contain business logic
- Repositories handle data access

**O - Open/Closed**:
- Extend behavior without modifying existing code
- Use interfaces and abstract classes
- Strategy pattern for varying algorithms

**L - Liskov Substitution**:
- Derived classes must be substitutable for base classes
- Interface contracts must be honored

**I - Interface Segregation**:
- Many specific interfaces over one general interface
- Clients shouldn't depend on interfaces they don't use

**D - Dependency Inversion**:
- Depend on abstractions, not concretions
- High-level modules shouldn't depend on low-level modules

### Code Quality Standards

**Backend (.NET)**:
- **Naming Conventions**: PascalCase for classes/methods, camelCase for parameters
- **Async/Await**: All I/O operations must be async
- **Error Handling**: Try-catch at appropriate boundaries, custom exceptions
- **Validation**: FluentValidation for all input
- **DTOs**: Never expose entities directly through API
- **Logging**: Structured logging with context
- **Comments**: XML documentation for public APIs

**Frontend (React)**:
- **Naming Conventions**: PascalCase for components, camelCase for functions/variables
- **TypeScript**: Strict mode, no 'any' types
- **Hooks**: Custom hooks for reusable logic
- **Props**: Interface definitions for all component props
- **Error Boundaries**: Wrap components for graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Memoization, lazy loading, code splitting

### Security Best Practices

- **Authentication**: JWT with refresh tokens, secure password hashing (BCrypt)
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Both client and server-side
- **SQL Injection Prevention**: Parameterized queries (EF Core handles this)
- **XSS Prevention**: Sanitize user input, React escapes by default
- **CORS**: Whitelist allowed origins
- **HTTPS**: Enforce in production
- **Secrets Management**: Environment variables, never hardcoded

### Scalability Considerations

- **Database Indexing**: Index foreign keys and frequently queried columns
- **Pagination**: All list endpoints must support pagination
- **Caching**: Response caching for read-heavy endpoints
- **Connection Pooling**: Database connection pooling
- **Background Jobs**: Async processing for heavy operations
- **Rate Limiting**: Prevent API abuse
- **CDN**: Static assets served via CDN in production

### Maintainability Practices

- **DRY (Don't Repeat Yourself)**: Extract common logic into utilities/services
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't build features before they're needed
- **Code Reviews**: All AI-generated code must be reviewed
- **Refactoring**: Continuous improvement of code structure
- **Documentation**: Clear README, API docs, architectural decisions

---

## AI Code Generation Strategy

### Best Practices for AI-Assisted Development

**1. Prompting Patterns That Work**:

**Architecture-First Approach**:
- Start with high-level architecture and folder structure
- Define interfaces and contracts before implementations
- Specify design patterns explicitly (CQRS, Repository, Factory, etc.)
- Request separation of concerns in initial prompt

**Incremental Complexity**:
- Begin with basic happy-path implementation
- Add error handling in second iteration
- Add validation in third iteration
- Add logging and performance optimization last

**Context-Rich Prompts**:
```
Good Prompt Template:
"Create [component/service] in [language/framework] following [architectural pattern].

Requirements:
- [List specific functional requirements]
- [List non-functional requirements: performance, security]
- [Specify dependencies and interfaces]
- [Indicate code quality expectations]

Example structure:
[Provide code skeleton or interface]

Contraints:
- [List constraints: no third-party libs, must be async, etc.]

Best practices to follow:
- [SOLID principles]
- [Specific patterns to use]
[Error handling strategy]
```

**2. Context Provision Strategy**:

**Always Include**:
- Tech stack and versions (.NET 10, React 18, TypeScript 5.2)
- Architectural pattern being followed (Clean Architecture, CQRS)
- Related interfaces/DTOs/types from other files
- Naming conventions and code style guide
- Dependencies available (NuGet packages, npm packages)

**Reference Existing Code**:
- "Following the pattern used in [ExistingFile.cs]"
- "Similar to [ExistingComponent.tsx] but for [NewFeature]"
- "Implement interface [IExistingInterface]"

**Specify Integration Points**:
- "This service will be injected into [ControllerName]"
- "This component will be used in [PageName]"
- "Integrate with existing [ServiceName]"

**3. Systematic Review Process**:

**Level 1 - Correctness Review**:
- [ ] Code compiles without errors
- [ ] Implements all required functionality
- [ ] Method signatures match interfaces
- [ ] Types are correct (no 'any' in TypeScript)

**Level 2 - Architecture Review**:
- [ ] Follows Clean Architecture layer separation
- [ ] SOLID principles applied
- [ ] Proper dependency injection
- [ ] Correct design patterns used
- [ ] No architectural violations (e.g., Domain depending on Infrastructure)

**Level 3 - Code Quality Review**:
- [ ] Meaningful naming (no abbreviations, descriptive)
- [ ] Single Responsibility Principle
- [ ] DRY principle (no duplication)
- [ ] Proper commenting (why, not what)
- [ ] Magic numbers/strings extracted to constants
- [ ] Appropriate use of async/await

**Level 4 - Security Review**:
- [ ] Input validation present
- [ ] Authorization checks in place
- [ ] No sensitive data exposure
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized outputs)
- [ ] No hardcoded secrets

**Level 5 - Performance Review**:
- [ ] No N+1 query problems
- [ ] Pagination for large datasets
- [ ] Caching where appropriate
- [ ] Database queries optimized
- [ ] Unnecessary re-renders prevented (React)

**Level 6 - Testing Review**:
- [ ] Unit tests cover business logic
- [ ] Edge cases handled
- [ ] Error cases tested
- [ ] Mocking used appropriately

**4. Iteration Strategy**:

**First Pass - Core Implementation**:
```
Prompt: "Create [feature] with basic functionality.
Focus on happy path only.
Use synchronous code for now."
```

**Second Pass - Error Handling**:
```
Prompt: "Add comprehensive error handling to [previous code].
- Try-catch blocks at appropriate boundaries
- Custom exceptions for domain errors
- Meaningful error messages
- Proper HTTP status codes"
```

**Third Pass - Validation**:
```
Prompt: "Add input validation to [previous code].
- FluentValidation for commands
- Check for null/empty values
- Business rule validation
- Return detailed validation errors"
```

**Fourth Pass - Testing**:
```
Prompt: "Create unit tests for [previous code].
- Test happy path
- Test edge cases
- Test error scenarios
- Use mocking for dependencies
- Aim for 80%+ code coverage"
```

**Fifth Pass - Documentation**:
```
Prompt: "Add XML documentation to [previous code].
- Document all public methods
- Include parameter descriptions
- Provide usage examples
- Document exceptions thrown"
```

**5. Common Pitfalls to Avoid**:

**Vague Prompts**:
❌ "Create a survey controller"
✅ "Create a SurveysController in .NET 10 Web API following REST conventions, using CQRS with MediatR, returning DTOs, with authentication via JWT, and FluentValidation for input validation."

**Missing Context**:
❌ "Add authentication"
✅ "Add JWT authentication to the .NET 10 Web API. Use the existing ApplicationDbContext, create a AuthService implementing IAuthService interface, hash passwords with BCrypt, return access token and refresh token, handle token expiration."

**No Quality Standards**:
❌ "Create a form component"
✅ "Create a form component in React with TypeScript using React Hook Form and Zod validation. Follow Atomic Design (molecule level), use Tailwind CSS, handle loading/error states, be accessible (ARIA labels), and extract validation schema to separate file."

**Accepting First Output**:
- Always review and refine
- Ask for improvements: "Make this more maintainable", "Add error handling", "Optimize this query"
- Request specific changes: "Extract this into a separate service", "Add dependency injection"

**6. Prompt Templates Library**:

**Backend API Endpoint Template**:
```
"Create [HTTP Method] endpoint for [resource] in .NET 10 Web API.

Endpoint: [METHOD] /api/[resource]

Architecture:
- CQRS pattern with MediatR
- Command/Query: [name]
- Handler: [name]
- DTO: [name]
- Validator: FluentValidation

Authorization: [requirements]

Request: [structure]
Response: [structure]

Error Handling:
- [list expected errors and status codes]

Follow Clean Architecture, inject [dependencies], return proper HTTP status codes."
```

**Frontend Component Template**:
```
"Create a [component name] component in React with TypeScript.

Purpose: [description]

Props interface:
[list props with types]

State management: [local state / context / React Query]

UI Requirements:
- [layout description]
- [interactive elements]
- Tailwind CSS for styling
- Responsive design
- Accessibility (ARIA labels, keyboard navigation)

Behavior:
- [user interactions]
- [API calls if any]
- [validation]

Error/Loading States:
- Show loading spinner during async operations
- Display errors with user-friendly messages
- Handle empty states

Follow Atomic Design ([atom/molecule/organism]), use React Hook Form for forms, extract business logic to custom hooks."
```

**Database Operations Template**:
```
"Create repository implementation for [Entity] in .NET 10.

Implement I[Entity]Repository interface.

Methods needed:
- [list methods with signatures]

Use Entity Framework Core with:
- Async operations
- Proper includes for navigation properties
- Pagination support
- Filtering capabilities
- Proper error handling

Optimize queries to avoid N+1 problems.
Use AsNoTracking() for read-only queries.
Add CancellationToken support."
```

**7. Documentation Standards for AI Usage**:

**For Each Major Component, Document**:
- **Initial Prompt**: Exact prompt used
- **AI Tool Used**: "GitHub Copilot Chat", "Claude", etc.
- **Generated Code**: Brief summary (not full code)
- **Modifications Made**: List of manual changes
- **Reason for Changes**: Why manual intervention was needed
- **Time Saved**: Estimate (e.g., "Would have taken 2 hours, took 20 minutes")
- **Success Rating**: 1-5 stars for code quality

**Track Metrics**:
- Total lines of code generated
- Percentage of AI-generated code accepted as-is
- Percentage requiring minor tweaks (<10 lines changed)
- Percentage requiring major refactoring
- Time spent on prompting vs reviewing vs manual coding

---

## Performance Optimization Guide

### Backend Performance

**Database Optimization**:
```sql
-- Index strategy
CREATE INDEX IX_Surveys_UserId ON Surveys(UserId);
CREATE INDEX IX_Questions_SurveyId ON Questions(SurveyId);
CREATE INDEX IX_Responses_SurveyId ON Responses(SurveyId);
CREATE INDEX IX_Answers_ResponseId ON Answers(ResponseId);
CREATE INDEX IX_Answers_QuestionId ON Answers(QuestionId);

-- Composite indexes for common queries
CREATE INDEX IX_Surveys_UserId_IsActive ON Surveys(UserId, IsActive);
CREATE INDEX IX_Responses_SurveyId_SubmittedAt ON Responses(SurveyId, SubmittedAt DESC);
```

**Query Optimization**:
```csharp
// ❌ Bad: N+1 problem
var surveys = await _context.Surveys.ToListAsync();
foreach (var survey in surveys)
{
    var questionCount = await _context.Questions
        .CountAsync(q => q.SurveyId == survey.Id);
}

// ✅ Good: Single query with projection
var surveys = await _context.Surveys
    .Select(s => new SurveyListDto(
        s.Id,
        s.Title,
        s.IsActive,
        s.Questions.Count,
        s.Responses.Count
    ))
    .ToListAsync();

// ✅ Good: Use AsNoTracking for read-only queries
var surveys = await _context.Surveys
    .AsNoTracking()
    .Where(s => s.UserId == userId)
    .ToListAsync();
```

**Caching Strategy**:
```csharp
// Response caching for public surveys
[HttpGet("{id}")]
[ResponseCache(Duration = 300)] // 5 minutes
public async Task<IActionResult> GetPublicSurvey(Guid id)
{
    // ...
}

// Memory caching for expensive calculations
private async Task<AnalyticsDto> GetAnalyticsWithCache(Guid surveyId)
{
    var cacheKey = $"analytics_{surveyId}";
    
    if (!_cache.TryGetValue(cacheKey, out AnalyticsDto analytics))
    {
        analytics = await CalculateAnalytics(surveyId);
        
        _cache.Set(cacheKey, analytics, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        });
    }
    
    return analytics;
}
```

**Async Best Practices**:
```csharp
// ✅ Good: Async all the way
public async Task<IActionResult> GetSurveys()
{
    var surveys = await _mediator.Send(new GetSurveysQuery());
    return Ok(surveys);
}

// ❌ Bad: Blocking on async (causes deadlocks)
public IActionResult GetSurveys()
{
    var surveys = _mediator.Send(new GetSurveysQuery()).Result;
    return Ok(surveys);
}
```

### Frontend Performance

**Code Splitting**:
```typescript
// Lazy load route components
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const SurveyBuilderPage = lazy(() => import('./pages/surveys/SurveyBuilderPage'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

// In router
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    {/* ... */}
  </Routes>
</Suspense>
```

**React Query Optimization**:
```typescript
// Prefetch data on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery(['survey', surveyId], () => fetchSurvey(surveyId));
};

// Optimistic updates
const updateSurvey = useMutation(updateSurveyAPI, {
  onMutate: async (updatedSurvey) => {
    await queryClient.cancelQueries(['survey', updatedSurvey.id]);
    const previous = queryClient.getQueryData(['survey', updatedSurvey.id]);
    
    queryClient.setQueryData(['survey', updatedSurvey.id], updatedSurvey);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['survey', variables.id], context.previous);
  },
});

// Infinite queries for pagination
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  'responses',
  ({ pageParam = 1 }) => fetchResponses(surveyId, pageParam),
  {
    getNextPageParam: (lastPage) => lastPage.nextPage,
  }
);
```

**Memoization**:
```typescript
// Memoize expensive calculations
const sortedSurveys = useMemo(
  () => surveys?.sort((a, b) => b.createdAt - a.createdAt),
  [surveys]
);

// Memoize callbacks to prevent child re-renders
const handleSurveyClick = useCallback(
  (surveyId: string) => {
    navigate(`/surveys/${surveyId}`);
  },
  [navigate]
);

// Memoize components
const MemoizedSurveyCard = memo(SurveyCard, (prev, next) => {
  return prev.survey.id === next.survey.id && 
         prev.survey.updatedAt === next.survey.updatedAt;
});
```

**Virtualization for Large Lists**:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const ResponseList = ({ responses }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: responses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated row height
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ResponseRow response={responses[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Image Optimization**:
```typescript
// Use WebP with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={imageSrc}
  alt="Description"
  effect="blur"
  placeholderSrc={thumbnailSrc}
/>
```

---

## Expected Deliverables Checklist

### Working Application
- [ ] .NET 10 Web API running and accessible
- [ ] React frontend running and accessible
- [ ] PostgreSQL database set up
- [ ] Authentication works (register, login, logout)
- [ ] Survey CRUD operations work
- [ ] Question management works
- [ ] Public survey form accessible and functional
- [ ] Response submission works
- [ ] Response viewing and analytics work
- [ ] Admin panel functional
- [ ] All pages responsive (mobile, tablet, desktop)

### Features
- [ ] Multiple layouts (public, dashboard, admin)
- [ ] Routing configured (React Router)
- [ ] 10+ pages/components
- [ ] Authentication and authorization
- [ ] Public survey sharing
- [ ] Analytics dashboard with charts
- [ ] Data export (CSV)
- [ ] User settings
- [ ] Admin user management

### Documentation
- [ ] README.md with setup instructions
- [ ] PROMPT_LOG.md with all prompts used
- [ ] Architecture documentation
- [ ] API endpoint documentation
- [ ] Insights on AI prompt effectiveness
- [ ] Recommendations for future AI use

### Production Readiness
- [ ] Error handling (backend and frontend)
- [ ] Loading states
- [ ] Input validation
- [ ] Security (JWT, password hashing, CORS)
- [ ] Logging configured
- [ ] Docker configuration
- [ ] Deployment pipeline (GitHub Actions)
- [ ] Environment configuration
- [ ] Tests (unit, integration, E2E)

---

## Development Workflow

### Day-by-Day Breakdown

**Day 1: Foundation (6-8 hours)**
- Morning: Backend project structure, EF Core setup, database migration
- Afternoon: Frontend project structure, routing, authentication UI
- Evening: JWT authentication (backend + frontend integration)
- End of Day: Can register, login, and access protected routes

**Day 2: Core Features (6-8 hours)**
- Morning: Survey CRUD API (backend with CQRS)
- Afternoon: Survey list and create UI (frontend)
- Evening: Question management API (backend)
- End of Day: Can create surveys and add questions (backend works, basic UI)

**Day 3: Survey Builder & Public Form (6-8 hours)**
- Morning: Survey builder UI with drag-drop
- Afternoon: Question type components
- Evening: Public survey form and response submission
- End of Day: Complete survey creation and response collection flow

**Day 4: Analytics & Dashboard (6-8 hours)**
- Morning: Response retrieval API and analytics calculations
- Afternoon: Response list and detail pages
- Evening: Analytics dashboard with charts
- End of Day: Full analytics and data visualization

**Day 5: Polish & Production (6-8 hours)**
- Morning: Admin panel (user management)
- Afternoon: Error handling, loading states, responsive design
- Evening: Testing, deployment setup, documentation
- End of Day: Production-ready application

**Total: 30-40 hours** (1 week of focused development)

### Workflow Per Feature

**For Each Backend Feature**:
1. **Define** (5 min): Write down requirements, identify entities/DTOs
2. **Prompt** (5 min): Craft detailed prompt with architecture specifications
3. **Generate** (2 min): Run AI code generation
4. **Review** (10 min): Check against code review checklist
5. **Test** (10 min): Manual testing via Swagger/Postman
6. **Refine** (5 min): Fix issues, add missing error handling
7. **Document** (3 min): Log prompt and results in PROMPT_LOG.md

**Total per feature: ~40 minutes** (vs 2-3 hours manual coding)

**For Each Frontend Feature**:
1. **Design** (10 min): Sketch component structure, identify props
2. **Prompt** (5 min): Detailed prompt with UX requirements
3. **Generate** (2 min): AI generates component
4. **Review** (15 min): Check TypeScript types, accessibility, styling
5. **Integrate** (10 min): Connect to API, add to routing
6. **Test** (10 min): Manual testing in browser (desktop + mobile)
7. **Refine** (10 min): Styling adjustments, error handling
8. **Document** (3 min): Log in PROMPT_LOG.md

**Total per feature: ~65 minutes** (vs 3-4 hours manual coding)

### Git Workflow

**Branch Strategy**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/[feature-name]`: Individual features

**Commit Convention**:
```
[type]: [description]

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- docs: Documentation
- test: Adding tests
- chore: Maintenance

Examples:
feat: Add survey CRUD API with CQRS pattern
fix: Resolve infinite loop in useEffect
refactor: Extract validation logic to separate service
```

**After Each Feature**:
```bash
git add .
git commit -m "feat: [description]"
git push origin feature/[feature-name]
# Create PR, review, merge to develop
```

### Testing Strategy

**Backend Testing Pyramid**:
- **Unit Tests (70%)**: Business logic, validators, services
- **Integration Tests (20%)**: API endpoints, database operations
- **E2E Tests (10%)**: Critical user flows

**Frontend Testing Pyramid**:
- **Unit Tests (60%)**: Utility functions, custom hooks
- **Component Tests (30%)**: Component rendering, user interactions
- **E2E Tests (10%)**: Complete user journeys

**Test-Driven AI Development**:
1. Write test cases first (or generate with AI)
2. Generate implementation to pass tests
3. Refactor while keeping tests green

**AI Prompt for Tests**:
```
"Create unit tests for [Class/Component] using [xUnit/Vitest].

Test cases:
- Happy path: [describe]
- Edge cases: [list]
- Error scenarios: [list]

Use mocking for:
- [dependencies]

Arrange-Act-Assert pattern.
Aim for 80%+ code coverage."
```

---

## Success Metrics

### Technical Excellence Metrics

**Code Quality**:
- [ ] 90%+ code AI-generated with minimal manual editing
- [ ] Zero compiler warnings
- [ ] Zero critical code analysis issues
- [ ] TypeScript strict mode enabled with no 'any' types
- [ ] Consistent code style (enforced by ESLint/Prettier)
- [ ] All public APIs documented (XML docs/.md files)

**Architecture**:
- [ ] Clean Architecture layers properly separated
- [ ] No circular dependencies
- [ ] SOLID principles applied throughout
- [ ] Design patterns used appropriately (CQRS, Repository, Factory, etc.)
- [ ] Dependency injection used consistently
- [ ] Domain logic isolated from infrastructure

**Performance**:
- [ ] All API endpoints respond < 200ms (p95)
- [ ] Frontend initial load < 2 seconds
- [ ] No N+1 query problems
- [ ] Database queries optimized with proper indexing
- [ ] Pagination implemented for all lists
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)

**Security**:
- [ ] All endpoints properly authenticated/authorized
- [ ] Input validation on all endpoints (client + server)
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention implemented
- [ ] CORS configured correctly
- [ ] Secrets managed via environment variables
- [ ] HTTPS enforced in production
- [ ] Security headers configured

**Testing**:
- [ ] Unit test coverage > 70% for business logic
- [ ] Integration tests for all API endpoints
- [ ] E2E tests for critical user flows
- [ ] All tests passing in CI/CD pipeline
- [ ] No flaky tests

**Maintainability**:
- [ ] Comprehensive README with setup instructions
- [ ] Architecture documented (diagrams + explanations)
- [ ] API endpoints documented (OpenAPI/Swagger)
- [ ] Prompt log maintained throughout development
- [ ] Consistent naming conventions
- [ ] Code is self-documenting (clear variable/function names)

**DevOps**:
- [ ] CI/CD pipeline configured and working
- [ ] Automated builds on commit
- [ ] Automated tests in pipeline
- [ ] Deployment to staging/production automated
- [ ] Environment configuration separated (dev/staging/prod)
- [ ] Logging configured and working
- [ ] Health checks implemented

### Learning & AI Effectiveness Metrics

**AI Code Generation Success**:
- [ ] Track percentage of code accepted as-is
- [ ] Track percentage requiring minor modifications (<10 lines)
- [ ] Track percentage requiring major refactoring
- [ ] Document average time saved per feature
- [ ] Identify most effective prompt patterns
- [ ] Identify areas where AI struggled

**Insights Documented**:
- [ ] 10+ key prompts documented with results
- [ ] Identified 5+ effective prompting patterns
- [ ] Documented 5+ areas for prompt improvement
- [ ] Created reusable prompt templates
- [ ] Documented review/refinement workflow
- [ ] Lessons learned section completed

**Knowledge Transfer**:
- [ ] Prompt log can be used as reference for future projects
- [ ] Architectural decisions documented (ADRs)
- [ ] Best practices codified for team use
- [ ] Template project created for future SaaS apps

---

## Next Steps - Getting Started

### Prerequisites

**Development Environment Setup**:
1. Install .NET 10 SDK
2. Install Node.js 20+ and npm
3. Install PostgreSQL 16+ (or use Docker)
4. Install VS Code with extensions:
   - C# Dev Kit
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier
   - GitHub Copilot (critical for this project)
5. Install Git
6. Install Docker Desktop (for containerization)
7. Set up GitHub repository

**Tool Configuration**:
1. Configure GitHub Copilot in VS Code
2. Enable Copilot Chat
3. Set up code snippets for common patterns
4. Configure ESLint and Prettier

### Phase 0: Planning & Setup (Before Coding)

**1. Create Project Structure**:
```bash
# Create workspace directory
mkdir SurveyLite
cd SurveyLite

# Initialize Git
git init
git checkout -b develop

# Create folders
mkdir backend frontend docs

# Create documentation files
touch README.md
touch PROMPT_LOG.md
touch ARCHITECTURE.md
touch docs/API.md
touch docs/ADR.md  # Architectural Decision Records
```

**2. Initialize PROMPT_LOG.md Template**:
```markdown
# AI Prompt Log - SurveyLite Development

## Project: Feedback & Survey Tool (SurveyLite)
## AI Tools Used: GitHub Copilot, Copilot Chat
## Developer: [Your Name]
## Dates: [Start Date] - [End Date]

---

## Format for Each Entry

### [Feature Name] - [Date]

**Context**: [What you were building and why]

**Prompt**:
```
[Exact prompt used]
```

**AI Tool**: [GitHub Copilot / Copilot Chat / etc.]

**Result Summary**:
- [What was generated]
- [Quality assessment: 1-5 stars]
- [Code accepted as-is / minor modifications / major refactoring]

**Modifications Made**:
- [List specific changes]
- [Reason for each change]

**Time Estimate**:
- Manual coding estimate: [X hours]
- AI-assisted time: [Y minutes]
- Time saved: [Z%]

**Insights**:
- [What worked well]
- [What could be improved]
- [Lessons learned]

---
```

**3. Set Up Architectural Decision Records (ADR)**:

Create template in `docs/ADR.md`:
```markdown
# Architectural Decision Records

## ADR-001: Use Clean Architecture

**Date**: [Date]

**Status**: Accepted

**Context**:
Need to choose an architectural pattern for the .NET backend.

**Decision**:
Use Clean Architecture with CQRS pattern.

**Consequences**:
- **Positive**: Better testability, maintainability, clear separation of concerns
- **Negative**: More initial setup, more files/folders
- **Risks**: Learning curve for team members unfamiliar with pattern

**Alternatives Considered**:
- Traditional layered architecture (simpler but less testable)
- Vertical slice architecture (modern but less familiar to AI tools)

---
```

### Execution Plan

**Step 1: Backend Foundation (Day 1 Morning)**
1. Create .NET solution structure
2. Set up EF Core and database
3. **Prompt**: Use "Task 1.1" and "Task 1.2" prompts from implementation plan
4. **Review**: Architecture checklist
5. **Document**: First entries in PROMPT_LOG.md

**Step 2: Frontend Foundation (Day 1 Afternoon)**
1. Create React + Vite project
2. Configure TypeScript and Tailwind
3. **Prompt**: Use "Task 1.3" prompt
4. **Review**: Code quality checklist
5. **Document**: Continue PROMPT_LOG.md

**Step 3: Authentication (Day 1 Evening)**
1. Backend: JWT service and auth endpoints
2. Frontend: Auth context and login/register pages
3. **Prompt**: Use "Task 1.4" prompt
4. **Test**: Register → Login → Access protected route
5. **Document**: ADR for JWT choice, PROMPT_LOG entries

**Continue with Phases 2-7** following the same pattern:
- Prompt (use enhanced prompts from plan)
- Generate (let AI create code)
- Review (systematic checklist)
- Test (manual + automated)
- Refine (fix issues)
- Document (PROMPT_LOG + ADR if architectural decision)

### Daily Workflow

**Morning**:
1. Review previous day's work
2. Plan today's features (2-3 major features)
3. Create feature branches
4. Set up prompt template for each feature

**During Development**:
1. For each feature:
   - Write prompt (5 min)
   - Generate code with AI (2 min)
   - Review with checklist (10 min)
   - Test manually (10 min)
   - Refine if needed (10 min)
   - Document in PROMPT_LOG (3 min)
   - Commit with descriptive message

**Evening**:
1. Review day's progress against plan
2. Update README with completed features
3. Push all changes to GitHub
4. Create PR for completed features
5. Plan next day's work

### Quality Gates

**Before Each Commit**:
- [ ] Code compiles without errors
- [ ] No linting errors
- [ ] Manual testing passed
- [ ] Prompt logged in PROMPT_LOG.md

**Before Each PR**:
- [ ] All tests passing
- [ ] Code reviewed against checklist
- [ ] Documentation updated
- [ ] No security vulnerabilities

**Before Deployment**:
- [ ] All features complete
- [ ] E2E tests passing
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation complete

### Metrics Tracking

Create a spreadsheet to track:
- Date
- Feature name
- Lines of code generated
- Percentage accepted as-is
- Time saved estimate
- AI tool used
- Quality rating (1-5)
- Issues encountered

This data will be valuable for the "Insights" section.

---

## Code Review Checklist

### Backend Code Review

**Architecture & Design**:
- [ ] Follows Clean Architecture layer separation
- [ ] SOLID principles applied correctly
- [ ] Proper use of dependency injection
- [ ] No circular dependencies
- [ ] Appropriate design patterns used

**Code Quality**:
- [ ] Meaningful variable/method names
- [ ] Single Responsibility: each class has one purpose
- [ ] DRY: no duplicated code
- [ ] YAGNI: no unnecessary complexity
- [ ] Proper async/await usage (no .Result or .Wait())
- [ ] No magic strings or numbers (use constants/enums)

**Error Handling**:
- [ ] Try-catch at appropriate boundaries
- [ ] Custom exceptions for domain errors
- [ ] Proper HTTP status codes
- [ ] Meaningful error messages
- [ ] Logging for all errors

**Security**:
- [ ] No sensitive data in responses
- [ ] Authorization checks on all protected endpoints
- [ ] Input validation (FluentValidation)
- [ ] No SQL injection vulnerabilities
- [ ] Password hashing (never plain text)

**Testing**:
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Edge cases covered
- [ ] Mocking used appropriately

**Performance**:
- [ ] Queries are efficient (no N+1 problems)
- [ ] Pagination implemented for lists
- [ ] Proper indexing on database
- [ ] Async operations used for I/O

### Frontend Code Review

**Architecture & Design**:
- [ ] Component structure follows Atomic Design
- [ ] Smart vs Presentational components separated
- [ ] Proper state management (local vs global)
- [ ] Custom hooks extract reusable logic
- [ ] No prop drilling (use context when appropriate)

**TypeScript**:
- [ ] No 'any' types (use proper types)
- [ ] Interfaces defined for all props
- [ ] Type safety maintained throughout
- [ ] Proper generic usage
- [ ] Strict mode enabled

**Performance**:
- [ ] useMemo/useCallback used appropriately
- [ ] Lazy loading for routes
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] No unnecessary re-renders

**Code Quality**:
- [ ] Components are small and focused (< 250 lines)
- [ ] DRY principle followed
- [ ] Proper error boundaries
- [ ] Loading states handled
- [ ] Consistent naming conventions

**Accessibility**:
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Form labels properly associated
- [ ] Color contrast meets WCAG AA

**React Best Practices**:
- [ ] useEffect dependencies correct
- [ ] No infinite loops in effects
- [ ] Keys used properly in lists
- [ ] Forms use React Hook Form
- [ ] Validation with Zod schemas

---

## Future Technical Enhancements (Post-MVP)

**Advanced Features** (Demonstrate architectural scalability):
1. **Question Logic**: Skip logic, conditional questions (finite state machine pattern)
2. **Templates**: Pre-built survey templates (Template pattern, strategy pattern)
3. **Integrations**: Webhooks, API endpoints (Observer pattern, publish-subscribe)
4. **File Uploads**: Allow file upload questions (Blob storage integration, security considerations)
5. **Real-time**: WebSocket for live response updates (SignalR implementation)
6. **Offline Mode**: PWA for offline survey taking (Service workers, IndexedDB)

**Technical Improvements**:
1. **Microservices**: Split into survey-service, response-service, analytics-service
2. **Event Sourcing**: Track all state changes for audit trail
3. **GraphQL**: Alternative to REST for flexible data fetching
4. **Server-Side Rendering**: Next.js migration for better SEO and performance
5. **AI Integration**: OpenAI API for survey question suggestions, response analysis
6. **Advanced Caching**: Redis for distributed caching
7. **Message Queue**: RabbitMQ/Azure Service Bus for async processing
8. **Multi-tenancy**: Support for multiple organizations with data isolation
9. **Feature Flags**: LaunchDarkly or custom solution for gradual rollouts
10. **Observability**: OpenTelemetry, Application Insights, distributed tracing

**Infrastructure**:
1. **Kubernetes**: Container orchestration for better scalability
2. **CDN**: CloudFlare or Azure CDN for static assets
3. **Load Balancing**: Multi-region deployment
4. **Database Scaling**: Read replicas, sharding strategies
5. **Monitoring**: Prometheus + Grafana dashboards
6. **Security**: Penetration testing, OWASP compliance audit
7. **Compliance**: GDPR, SOC 2 compliance measures

These enhancements demonstrate how the clean architecture foundation enables future growth without major refactoring.

---

## Appendix: Quick Reference

### Common AI Prompts Quick Reference

**Creating an Entity**:
```
"Create a [EntityName] entity in .NET 10 following DDD principles.
Properties: [list properties with types]
Inherit from BaseEntity (has Id, CreatedAt, UpdatedAt).
Add business methods: [list methods].
Use private setters, validate in constructor.
No dependencies on other layers."
```

**Creating a Repository**:
```
"Create [EntityName]Repository implementing I[EntityName]Repository.
Use Entity Framework Core.
Methods: [list with signatures].
Use async/await, AsNoTracking for reads, include CancellationToken.
Optimize queries to avoid N+1."
```

**Creating a Command Handler**:
```
"Create [CommandName]CommandHandler implementing IRequestHandler.
Inject: [list dependencies].
Validate with FluentValidation.
Implement business logic: [describe].
Return: [DTO type].
Handle errors: [list expected errors]."
```

**Creating a React Component**:
```
"Create [ComponentName] component in React with TypeScript.
Props: [interface definition].
UI: [description].
Use Tailwind CSS, responsive design.
Handle loading/error states.
Accessible (ARIA labels).
Extract logic to custom hooks."
```

**Creating a Form**:
```
"Create [FormName] form component in React.
Fields: [list with types and validation].
Use React Hook Form with Zod validation.
Submit to: [API endpoint].
Show validation errors inline.
Disable submit during loading.
Show success message on completion."
```

**Creating Tests**:
```
"Create unit tests for [Class/Component].
Test framework: [xUnit/Vitest].
Test cases: Happy path, [edge case 1], [edge case 2], [error scenario].
Mock: [dependencies].
AAA pattern (Arrange-Act-Assert).
80%+ coverage."
```

### Architecture Decision Template

```markdown
## ADR-###: [Title]

**Date**: YYYY-MM-DD

**Status**: [Proposed | Accepted | Rejected | Deprecated | Superseded by ADR-###]

**Context**:
[Describe the forces at play: technical, business, user needs]

**Decision**:
[State the decision clearly]

**Consequences**:
**Positive**:
- [Benefit 1]
- [Benefit 2]

**Negative**:
- [Tradeoff 1]
- [Tradeoff 2]

**Risks**:
- [Risk 1 and mitigation]

**Alternatives Considered**:
1. [Alternative 1]: [Why rejected]
2. [Alternative 2]: [Why rejected]

**Implementation Notes**:
[Any specific guidance for implementing this decision]
```

### Git Commit Message Template

```
<type>(<scope>): <subject>

<body>

<footer>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Performance improvement
- test: Adding tests
- docs: Documentation only
- style: Formatting, missing semi-colons, etc.
- chore: Updating build tasks, package manager configs, etc.

Example:

feat(survey-api): Add CRUD endpoints with CQRS pattern

Implemented CreateSurveyCommand, GetSurveysQuery with handlers.
Added FluentValidation for input validation.
Used AutoMapper for entity-to-DTO mapping.
All endpoints require authentication.

Generated with GitHub Copilot, reviewed and tested.
90% AI-generated code.

Closes #123
```

### Code Review Comment Templates

**Security Issue**:
```
⚠️ SECURITY: [Description]

Risk: [Severity - Critical/High/Medium/Low]
Impact: [What could happen]

Recommended Fix:
[Code snippet or approach]

Reference: [OWASP link or documentation]
```

**Architecture Violation**:
```
🏠 ARCHITECTURE: Violates [principle/pattern]

Current: [What's wrong]
Expected: [How it should be]

Reason: [Why this matters for maintainability/testability]

Suggested Refactoring:
[Approach or code snippet]
```

**Performance Issue**:
```
⚡ PERFORMANCE: Potential bottleneck

Issue: [N+1 query / memory leak / etc.]

Impact: [Performance degradation when...]

Optimization:
[Code snippet or approach]

Benchmark: [Expected improvement]
```

### Useful Commands

**Backend (.NET)**:
```bash
# Create new migration
dotnet ef migrations add MigrationName -p Infrastructure -s API

# Update database
dotnet ef database update -p Infrastructure -s API

# Run tests
dotnet test --collect:"XPlat Code Coverage"

# Run with hot reload
dotnet watch run --project API

# Format code
dotnet format
```

**Frontend (React)**:
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint and fix
npm run lint --fix

# Format with Prettier
npm run format
```

**Docker**:
```bash
# Build image
docker build -t surveylite-api:latest -f backend/Dockerfile .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down
```

---

**End of Implementation Plan**

This comprehensive plan provides everything needed to build a production-ready survey SaaS application with 90%+ AI-generated code, following software architecture best practices, ensuring scalability, maintainability, and clean code principles.

**Key Takeaways**:
1. Architecture-first approach with Clean Architecture and SOLID principles
2. Detailed AI prompts that specify patterns, validation, error handling
3. Systematic code review process with checklists
4. Performance optimization from the start
5. Comprehensive testing strategy
6. Complete documentation of AI usage and architectural decisions
7. Focus on technical excellence over features
8. Iterative refinement workflow
9. Metrics tracking for continuous improvement
10. Reusable templates for future projects
