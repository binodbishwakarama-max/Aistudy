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

function App() {
  return (
    <StudyProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study" element={<Study />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stats" element={<div className="text-center text-gray-500 mt-20">Stats Coming Soon</div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StudyProvider>
  );
}

export default App;
