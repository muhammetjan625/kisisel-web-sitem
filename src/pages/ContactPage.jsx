// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { db } from '../firebase'; // Firebase db'yi import et
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Gerekli fonksiyonları import et
import toast from 'react-hot-toast'; // Bildirim için toast'u kullanalım
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Lütfen tüm alanları doldurun.");
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Mesajınız gönderiliyor...");

    try {
      // 'messages' adında yeni bir koleksiyona veriyi ekle
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp() // Mesajın gönderilme zamanını ekle
      });
      
      toast.success('Mesajınız başarıyla alındı! Teşekkürler.', { id: toastId });
      setFormData({ name: '', email: '', message: '' }); // Formu temizle
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container fade-in-bottom">
      <div className="glass-card">
        <h2>İletişime Geçin</h2>
        <p>Aşağıdaki formu doldurarak bana ulaşabilirsiniz.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          {/* ...form inputları aynı kalacak... */}
          <div className="form-group">
            <label htmlFor="name">Adınız Soyadınız</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta Adresiniz</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;