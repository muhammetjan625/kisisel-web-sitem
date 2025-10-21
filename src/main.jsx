// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // 1. Toaster'ı import et
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <App />
        <Toaster // 2. Toaster bileşenini ekle
          position="bottom-right" // Bildirimlerin ekranın sağ altında çıkmasını sağlar
          toastOptions={{
            // Bildirimlerin varsayılan stillerini karanlık temamıza uygun hale getirelim
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>,
);