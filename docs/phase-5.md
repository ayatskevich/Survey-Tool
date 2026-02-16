## PHASE 5: Dashboard & User Experience

**Goal**: Create the main dashboard and improve overall user experience with settings, onboarding, etc.

---

### Task 5.1: Frontend - Main Dashboard Page

**What to Build**:
- DashboardPage: WelcomeSection, RecentSurveys, ActivityFeed, QuickStats, QuickActions
- Combined endpoint for dashboard data recommended

**AI Prompt Strategy**: Single API endpoint returning aggregated data; use React Query for fetching.

---

### Task 5.2: Backend - Dashboard Statistics API

**What to Build**:
- GET /api/dashboard/stats with surveyStats, responseStats, recentSurveys, recentResponses, activityTrend, topSurveys

**AI Prompt Strategy**: Efficient server-side queries, require authentication.

---

### Task 5.3: Frontend - User Settings Page

**What to Build**:
- SettingsPage with tabs: Profile, Preferences, Security, DangerZone
- Update profile, change password, 2FA placeholder, export/delete account

**AI Prompt Strategy**: Use React Hook Form, confirm destructive actions, include loading and success states.

---

### Task 5.4: Backend - User Settings API

**What to Build**:
- Endpoints: GET/PUT profile, POST change-password, GET sessions, DELETE account
- Soft-delete vs hard-delete options, audit logging

**AI Prompt Strategy**: Validate and enforce security checks; require current password for sensitive ops.
