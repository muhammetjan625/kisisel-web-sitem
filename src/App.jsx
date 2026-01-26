import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import BuyMeCoffee from './components/BuyMeCoffee'; 
import ChatBot from './components/ChatBot'; // IMPORT EKLENDİ
import ScrollProgress from './components/ScrollProgress'; // Import et

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage'; 
import ProjectDetailPage from './pages/ProjectDetailPage'; // 1. EKSİK: IMPORT EKLENDİ

import './App.css';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Admin ve Login sayfalarında widget'ı, nav'ı ve footer'ı gizle
  const isAdminRoute = ['/admin', '/login'].includes(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mouse Glow Efekti
  useEffect(() => {
    const updateMousePosition = (e) => {
      document.body.style.setProperty('--x', `${e.clientX}px`);
      document.body.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="app-wrapper">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0b0c10', color: '#c5c6c7', border: '1px solid #66fcf1',
            boxShadow: '0 0 10px rgba(102, 252, 241, 0.2)', fontFamily: 'Segoe UI, sans-serif',
          },
          success: { iconTheme: { primary: '#66fcf1', secondary: '#0b0c10' } },
          error: { iconTheme: { primary: '#ff4757', secondary: '#fff' }, style: { border: '1px solid #ff4757' } },
        }}
      />
      <ScrollProgress />
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      {!isAdminRoute && <BuyMeCoffee />}
      {!isAdminRoute && <ChatBot />}


      <main>
        <div className="container" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkimda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              
              <Route path="/projects" element={<ProjectsPage />} />
              {/* 2. EKSİK: PROJE DETAY ROTASI EKLENDİ (Burası olmazsa açılmaz) */}
              <Route path="/projects/:id" element={<ProjectDetailPage />} />

              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<PostDetailPage />} />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;