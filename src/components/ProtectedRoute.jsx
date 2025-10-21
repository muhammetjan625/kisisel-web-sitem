// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// Bu bileşen, içine aldığı 'children'ı (yani Admin sayfasını)
// sadece kullanıcı giriş yapmışsa gösterir.
function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    // Kullanıcı giriş yapmamışsa, /login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  // Kullanıcı giriş yapmışsa, istenen sayfayı göster
  return children;
}

export default ProtectedRoute;