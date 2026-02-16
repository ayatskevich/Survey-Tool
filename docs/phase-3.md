## PHASE 3: Public Survey Form & Response Collection

**Goal**: Allow respondents to fill out surveys via public links and store their responses.

---

### Task 3.1: Backend - Public Survey Access API

**What to Build**:
- GET /api/public/surveys/{id} — return public survey if active, no creator PII
- Validate active state; return 404 if not found/inactive

**AI Prompt Strategy**: Create PublicSurveyDTO exposing only public fields; response caching optional.

---

### Task 3.2: Backend - Response Submission API

**What to Build**:
- POST /api/public/surveys/{surveyId}/responses — validate required questions, match formats, store Response and Answer entities
- Optional: rate limiting, reCAPTCHA

**AI Prompt Strategy**: Provide request body schema, validation rules, and expected responses (200/400).

---

### Task 3.3: Frontend - Public Survey Form Page

**What to Build**:
- PublicSurveyPage, QuestionRenderer, ProgressBar, Submit flow, ThankYouPage
- Use React Query to fetch survey, React Hook Form to manage answers

**AI Prompt Strategy**: Dynamic rendering by type, client-side validation, mobile-first UX.

---

### Task 3.4: Frontend - Thank You / Confirmation Page

**What to Build**:
- Friendly confirmation, optional response ID, share buttons, optional redirect

**AI Prompt Strategy**: Simple declarative component with Tailwind styling and optional auto-redirect.
