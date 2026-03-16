import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Study from './pages/Study';
import Login from './pages/Login';
import Register from './pages/Register';
import { StudyProvider } from './context/StudyContext';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import StatsDashboard from './components/StatsDashboard';

import { GamificationProvider } from './context/GamificationContext';

import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

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
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/study" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/stats" element={<ProtectedRoute><StatsDashboard /></ProtectedRoute>} />
                </Routes>
              </ErrorBoundary>
            </Layout>
          </BrowserRouter>
        </StudyProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
