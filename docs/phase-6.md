## PHASE 6: Admin Panel

**Goal**: Create admin functionality for managing users and monitoring system health.

---

### Task 6.1: Backend - Admin User Management API

**What to Build**:
- Admin-only endpoints: GET /api/admin/users, GET /api/admin/users/{id}, PUT role/status, DELETE user, GET /api/admin/stats, GET /api/admin/audit-log
- Authorization attribute for Admin role, audit logging

**AI Prompt Strategy**: Use [Authorize(Roles = "Admin")] and provide paginated responses and filters.

---

### Task 6.2: Frontend - Admin Dashboard

**What to Build**:
- AdminDashboard with SystemStatsCards, UserManagementTable, UserDetailModal, AdminSidebar
- Charts for growth trends and system health

**AI Prompt Strategy**: Restrict access in AuthContext, use React Query for fetching admin data, Tailwind for UI.
