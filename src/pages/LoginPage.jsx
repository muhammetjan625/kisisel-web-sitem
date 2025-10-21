// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link'i import et
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './ContactPage.css';

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
    <div className="contact-container fade-in-bottom">
      <div className="glass-card">
        <h2>Admin Paneli Girişi</h2>
        <form onSubmit={handleLogin} className="contact-form">
          {/* ... form içeriği aynı ... */}
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="submit-btn">Giriş Yap</button>
        </form>
        
        {/* YENİ EKLENEN BÖLÜM */}
        <div className="back-to-home">
          <Link to="/">Ana Sayfaya Dön</Link>
        </div>
        
      </div>
    </div>
  );
}

export default LoginPage;