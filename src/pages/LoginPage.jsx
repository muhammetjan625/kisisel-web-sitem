// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './LoginPage.css'; // YENİ CSS DOSYASI

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
            <h2>Admin Giriş</h2>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@mail.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn">Panele Gir</button>
        </form>

        <div className="back-link-container">
          <Link to="/" className="back-link">← Siteye Dön</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;