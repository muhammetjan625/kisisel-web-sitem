import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Bildirimler için şart

// Bileşenler
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop'; // Sayfa değişiminde yukarı kaydır

// Sayfalar
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

import './App.css';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Admin veya Login sayfasında mıyız? (Navbar/Footer gizlemek için)
  const isAdminRoute = ['/admin', '/login'].includes(location.pathname);

  // Site ilk açıldığında Loading ekranını göster
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-wrapper">
      {/* 1. TOASTER: Tarayıcı bildirimleri yerine modern kutucuklar */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0b0c10',
            color: '#c5c6c7',
            border: '1px solid #66fcf1',
            boxShadow: '0 0 10px rgba(102, 252, 241, 0.2)',
            fontFamily: 'Segoe UI, sans-serif',
          },
          success: {
            iconTheme: { primary: '#66fcf1', secondary: '#0b0c10' },
          },
          error: {
            iconTheme: { primary: '#ff4757', secondary: '#fff' },
            style: { border: '1px solid #ff4757' }
          },
        }}
      />

      {/* 2. ScrollToTop: Sayfa değişince en üste atar */}
      <ScrollToTop />

      {/* Navbar (Admin hariç göster) */}
      {!isAdminRoute && <Navbar />}
      
      <main>
        {/* Container sınıfı, içeriğin kenarlardan taşmasını engeller */}
        <div className="container" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkimda" element={<AboutPage />} /> {/* Linkler /about olmalı */}
              <Route path="/iletisim" element={<ContactPage />} /> {/* Linkler /contact olmalı */}
              
              {/* Projeler */}
              <Route path="/projects" element={<ProjectsPage />} />
              
              {/* Blog Rotaları */}
              <Route path="/blog" element={<BlogPage />} />
              {/* Eğer PostDetailPage'i henüz yapmadıysan geçici olarak BlogPage koydum, varsa değiştir */}
              <Route path="/blog/:slug" element={<PostDetailPage />} />

              {/* Admin ve Login Rotaları */}
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

      {/* Footer (Admin hariç göster) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;