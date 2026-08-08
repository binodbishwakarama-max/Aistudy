import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { StudyProvider } from './context/StudyContext';
import { lazyWithRetry } from './utils/lazyWithRetry';

const Landing = lazyWithRetry(() => import('./pages/Landing'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Upload = lazyWithRetry(() => import('./pages/Upload'));
const Study = lazyWithRetry(() => import('./pages/Study'));
const Settings = lazyWithRetry(() => import('./pages/Settings'));
const StatsDashboard = lazyWithRetry(() => import('./components/StatsDashboard'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center px-6">
    <div className="text-center">
      <div className="relative mx-auto mb-4 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
      <p className="text-sm font-medium text-[var(--text-muted)]">Loading…</p>
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
            containerStyle={{ top: 'calc(0.75rem + var(--safe-area-top))' }}
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-raised)',
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
                    <Route path="/demo" element={<Study />} />
                    <Route path="/demo/flashcards" element={<Study />} />
                    <Route path="/demo/quizzes" element={<Study />} />
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
