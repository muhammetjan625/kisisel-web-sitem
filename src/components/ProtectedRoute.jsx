// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute artık doğrudan firebase.auth'a bakmıyor.
// AuthContext'ten currentUser ve loading bilgilerini kullanıyor.
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Auth durumu yükleniyorsa basit bir loading dönebiliriz.
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  if (!currentUser) {
    // Kullanıcı giriş yapmamışsa, /login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  // Kullanıcı giriş yapmışsa, istenen sayfayı göster
  return children;
}

export default ProtectedRoute;