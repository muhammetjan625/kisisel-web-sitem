// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; // Firebase ayar dosyan
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

// Bu hook'u diğer sayfalarda kullanacağız
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase'in oturum değişikliğini dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};