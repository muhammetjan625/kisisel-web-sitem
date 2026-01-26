import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext'; // 1. BU SATIRI IMPORT ET

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider> {/* 2. BURAYA EKLE (App'i sarmalamalı) */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider> {/* 3. BURADA KAPAT */}
    </HelmetProvider>
  </React.StrictMode>,
)