import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

// === YENİ EKLENDİ (Vaka Analizi Sayfaları) ===
import CaseStudiesPage from './pages/CaseStudiesPage';
// Detay sayfasını (bir sonraki adım) oluşturana kadar geçici bir bileşen:
const CaseStudyDetailPage = () => <div style={{padding: '50px', textAlign: 'center'}}><h1>Vaka Analizi Detay Sayfası</h1><a href="/case-studies">Geri Dön</a></div>;
// ==============================================

import './App.css';

function App() {
  const location = useLocation();
  
  // Bu mantık harika, /admin ve /login'de header/footer'ı gizler.
  // /case-studies yolu bu listeye dahil OLMADIĞI için
  // header ve footer'ı GÖSTERECEKTİR (ki bu istediğimiz şey).
  const showHeaderFooter = !['/admin', '/login'].includes(location.pathname);

  return (
    <div className="app-wrapper"> 
      {showHeaderFooter && <Navbar />}
      <main>
        <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkimda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              <Route path="/project/:projectId" element={<ProjectDetailPage />} />
              
              {/* Blog Sayfası Rotaları */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<PostDetailPage />} />

              {/* === YENİ EKLENDİ (Vaka Analizi Rotaları) === */}
              <Route 
                path="/case-studies" 
                element={<CaseStudiesPage />} 
              />
              <Route 
                path="/case-studies/:slug" 
                element={<CaseStudyDetailPage />} 
              />
              {/* ============================================== */}

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