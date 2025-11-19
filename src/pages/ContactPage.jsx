import React, { useState } from 'react'; // Doğru import satırı
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
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
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp()
      });
      
      toast.success('Mesajınız başarıyla alındı! Teşekkürler.', { id: toastId });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container fade-in-bottom">
      <div className="glass-card contact-card">
        <h2>İletişime Geçin</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Adınız Soyadınız" required />
          </div>
          <div className="form-group">
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-posta Adresiniz" required />
          </div>
          <div className="form-group">
            <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} placeholder="Mesajınız" required></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;