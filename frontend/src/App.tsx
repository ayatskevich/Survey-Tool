import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { queryClient } from '@/services/queryClient';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import SurveyListPage from '@/pages/SurveyListPage';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { PublicSurveyPage } from '@/pages/PublicSurveyPage';
import { ThankYouPage } from '@/pages/ThankYouPage';
import { ResponseListPage } from '@/pages/ResponseListPage';
import { ResponseDetailPage } from '@/pages/ResponseDetailPage';
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminSurveysPage } from '@/pages/AdminSurveysPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/survey/:surveyId" element={<PublicSurveyPage />} />
              <Route path="/survey/:surveyId/thank-you" element={<ThankYouPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys"
              element={
                <ProtectedRoute>
                  <SurveyListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:surveyId/edit"
              element={
                <ProtectedRoute>
                  <SurveyBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:surveyId/responses"
              element={
                <ProtectedRoute>
                  <ResponseListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:surveyId/responses/:responseId"
              element={
                <ProtectedRoute>
                  <ResponseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:surveyId/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/surveys"
              element={
                <ProtectedRoute>
                  <AdminSurveysPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
      
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
