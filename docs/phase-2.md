## PHASE 2: Core Survey Builder (The Heart of the App)

**Goal**: Create the survey builder interface where users can create and edit surveys with different question types.

---

### Task 2.1: Backend - Survey CRUD API

**What to Build**:
- Survey entity with full CRUD operations
- API endpoints: POST /api/surveys, GET /api/surveys, GET /api/surveys/{id}, PUT /api/surveys/{id}, DELETE /api/surveys/{id}, POST /api/surveys/{id}/duplicate, PATCH /api/surveys/{id}/status
- DTOs, FluentValidation, Authorization

**AI Prompt Strategy**: Use CQRS, MediatR, Commands/Queries, DTOs, validators, thin controllers. See main plan for example command and controller templates.

---

### Task 2.2: Backend - Question Management API

**What to Build**:
- Question entity supporting types: ShortText, LongText, MultipleChoice, Checkboxes, Rating, Date, Email
- Nested endpoints under survey for add/update/delete/reorder
- Store options and validationRules as JSON

**AI Prompt Strategy**: Provide question model, endpoints, DTOs and validation, ensure user owns the survey.

---

### Task 2.3: Frontend - Survey List Page

**What to Build**:
- Dashboard page showing user surveys, SurveyCard, CreateSurveyButton, EmptyState, SearchBar, StatusFilter
- Grid/list view, pagination, loading states, duplicate/delete actions

**AI Prompt Strategy**: Use React Query, React Hook Form for create modal, Tailwind for styling.

---

### Task 2.4: Frontend - Survey Builder Interface

**What to Build**:
- Split-screen builder: left question list (draggable) and right question editor
- Components: QuestionList, QuestionItem, QuestionEditor, OptionEditor, AddQuestionButton
- Features: drag-drop, auto-save debounce, live preview

**AI Prompt Strategy**: Use @dnd-kit/core, React Hook Form, React Query mutations.

---

### Task 2.5: Frontend - Question Type Components

**What to Build**:
- Editor/Preview/Answer components for each question type (ShortText, LongText, MultipleChoice, Checkboxes, Rating, Date, Email)
- Use TypeScript interfaces and React Hook Form

**AI Prompt Strategy**: Generate per-type components with editor and preview variations; separate concerns for answer mode used in public surveys.
