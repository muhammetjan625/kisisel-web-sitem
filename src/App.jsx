// src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Güvenlik görevlimiz

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';     // Yeni sayfa
import AdminPage from './pages/AdminPage';     // Yeni sayfa

import './App.css';

function App() {
  const location = useLocation();
  // Admin veya Login sayfasında Navbar ve Footer göstermeyelim
  const showHeaderFooter = !['/admin', '/login'].includes(location.pathname);

  return (
    <>
      <div className="container">
        {showHeaderFooter && <Navbar />}
        <main>
          <Routes>
            {/* Herkesin görebileceği sayfalar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/hakkimda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/project/:projectId" element={<ProjectDetailPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Sadece giriş yapmış kullanıcıların görebileceği admin sayfası */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {showHeaderFooter && <Footer />}
      </div>
    </>
  );
}

export default App;