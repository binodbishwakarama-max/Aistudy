import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Study from './pages/Study';
import Login from './pages/Login';
import Register from './pages/Register';
import { StudyProvider } from './context/StudyContext';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import StatsDashboard from './components/StatsDashboard';

import { GamificationProvider } from './context/GamificationContext';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <StudyProvider>
          <Toaster position="top-center" />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/study" element={<Study />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/stats" element={<StatsDashboard />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </StudyProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
