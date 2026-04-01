import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import { StudyProvider } from './context/StudyContext';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Study = lazy(() => import('./pages/Study'));
const StatsDashboard = lazy(() => import('./components/StatsDashboard'));

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-6">
    <div className="text-center">
      <div className="relative w-12 h-12 mx-auto mb-4">
        <div className="absolute inset-0 border-2 border-[var(--border)] rounded-full" />
        <div className="absolute inset-0 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
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
              className: '',
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
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
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/study" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/stats" element={<ProtectedRoute><StatsDashboard /></ProtectedRoute>} />
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
