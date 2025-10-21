// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import './ContactPage.css'; // Form stillerini import ediyoruz

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    alert('Mesajınız alınmıştır! Teşekkürler.');
    console.log('Form Verisi:', formData);
    // Formu temizle
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="glass-card">
        <h2>İletişime Geçin</h2>
        <p>Aşağıdaki formu doldurarak bana ulaşabilirsiniz.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">#MOMO</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta Adresiniz</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea 
              id="message" 
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Gönder</button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;