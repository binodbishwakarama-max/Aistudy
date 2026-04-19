import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { StudyProvider } from './context/StudyContext';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Upload = lazy(() => import('./pages/Upload'));
const Study = lazy(() => import('./pages/Study'));
const Settings = lazy(() => import('./pages/Settings'));
const StatsDashboard = lazy(() => import('./components/StatsDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center px-6">
    <div className="text-center">
      <div className="relative mx-auto mb-4 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
      <p className="text-sm font-medium text-[var(--text-muted)]">Loading your workspace...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <StudyProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                boxShadow: 'var(--shadow-soft)',
              },
              success: { iconTheme: { primary: 'var(--success)' } },
              error: { iconTheme: { primary: 'var(--danger)' } },
            }}
          />

          <BrowserRouter>
            <Layout>
              <ErrorBoundary>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/study" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                    <Route path="/flashcards" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                    <Route path="/quizzes" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><StatsDashboard /></ProtectedRoute>} />
                    <Route path="/stats" element={<ProtectedRoute><StatsDashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Layout>
          </BrowserRouter>
        </StudyProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
