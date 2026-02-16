## PHASE 4: Response Viewing & Analytics

**Goal**: Allow survey creators to view collected responses and gain insights.

---

### Task 4.1: Backend - Response Retrieval API

**What to Build**:
- Endpoints: GET /api/surveys/{surveyId}/responses (paginated), GET /api/surveys/{surveyId}/responses/{responseId}, GET /api/surveys/{surveyId}/analytics, GET /api/surveys/{surveyId}/export
- Analytics: total count, response rate over time, per-question stats

**AI Prompt Strategy**: Aggregated endpoints server-side, CSV export, proper auth checks.

---

### Task 4.2: Frontend - Response List Page

**What to Build**:
- ResponseListPage, ResponseTable, FilterBar, ExportButton
- Sortable columns, pagination, export CSV

**AI Prompt Strategy**: React Query for fetch, Tailwind for UI, date picker for filters.

---

### Task 4.3: Frontend - Response Detail Page

**What to Build**:
- ResponseDetailPage with metadata and Q&A list, print-friendly view, prev/next navigation

**AI Prompt Strategy**: Fetch single response, render answers by question type, provide deletion and print actions.

---

### Task 4.4: Frontend - Analytics Dashboard

**What to Build**:
- AnalyticsDashboard with summary cards, ResponseChart, QuestionBreakdown, Pie/Bar charts
- Interactive charts with Recharts or Chart.js, date-range filters

**AI Prompt Strategy**: Provide analytics DTO, precomputed stats to minimize client work.
