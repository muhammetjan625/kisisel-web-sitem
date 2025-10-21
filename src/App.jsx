// src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

import './App.css';

function App() {
  const location = useLocation();
  const showHeaderFooter = !['/admin', '/login'].includes(location.pathname);

  return (
    // 1. ADIM: Her şeyi saran ana sarmalayıcı. Flexbox yapısı buna uygulanacak.
    <div className="app-wrapper"> 
      {showHeaderFooter && <Navbar />}
      <main>
        <div className="container">
            <Routes>
              {/* Rotalar aynı kalıyor */}
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkimda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              <Route path="/project/:projectId" element={<ProjectDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
        </div>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;