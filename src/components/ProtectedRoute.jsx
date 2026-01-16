// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import yoluna dikkat et

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Artık burası undefined gelmeyecek

  if (!currentUser) {
    // Giriş yapmamışsa Login sayfasına at
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;