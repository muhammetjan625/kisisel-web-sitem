import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Bileşenler
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading'; // Yükleme ekranı

// Sayfalar
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ProjectsPage from './pages/ProjectsPage'; // YENİ EKLENDİ

import './App.css';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Site ilk açıldığında Loading ekranını göster
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 saniye bekleme süresi (isteğe bağlı ayarlanabilir)

    return () => clearTimeout(timer);
  }, []);

  // Admin ve Login sayfalarında Navbar ve Footer'ı gizle
  const showHeaderFooter = !['/admin', '/login'].includes(location.pathname);

  // Yükleniyor durumundaysa Loading bileşenini göster
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-wrapper"> 
      {showHeaderFooter && <Navbar />}
      
      <main>
        <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkimda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              
              {/* Projeler ve Vaka Analizleri */}
              <Route path="/projects" element={<ProjectsPage />} /> {/* YENİ ROTA */}
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/project/:projectId" element={<ProjectDetailPage />} />
              
              {/* Blog Rotaları */}
              <Route path="/blog" element={<BlogPage />} />
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

      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;