import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { queryClient } from '@/services/queryClient';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import SurveyListPage from '@/pages/SurveyListPage';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { PublicSurveyPage } from '@/pages/PublicSurveyPage';
import { ThankYouPage } from '@/pages/ThankYouPage';
import { ResponseListPage } from '@/pages/ResponseListPage';
import { ResponseDetailPage } from '@/pages/ResponseDetailPage';
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard';
import './index.css';

function App() {
  return (
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
