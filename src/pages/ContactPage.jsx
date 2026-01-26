import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast'; // BİLDİRİM KÜTÜPHANESİ EKLENDİ
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basit doğrulama
    if(!formData.name || !formData.email || !formData.message) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      // MODERN BAŞARI BİLDİRİMİ
      toast.success("Mesajınız başarıyla gönderildi! En kısa sürede döneceğim.");
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Hata:", error);
      // MODERN HATA BİLDİRİMİ
      toast.error("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper fade-in-bottom">
      <div className="contact-container">
        
        {/* İletişim Bilgileri */}
        <div className="contact-info">
          <h3>İletişime Geç</h3>
          <p>Projeleriniz, iş teklifleriniz veya sadece tanışmak için bana yazabilirsiniz.</p>
          
          <div className="info-item">
            <FaEnvelope className="icon" />
            <span>sokrates.ts0@gmail.com</span>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <span>YAKINDA</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>İstanbul, Türkiye</span>
          </div>

          <div className="social-links-contact">
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </div>

        {/* İletişim Formu */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Adınız Soyadınız</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Adınız..." 
            />
          </div>

          <div className="form-group">
            <label>E-posta Adresiniz</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="ornek@email.com" 
            />
          </div>

          <div className="form-group">
            <label>Mesajınız</label>
            <textarea 
              name="message" 
              rows="5" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Mesajınızı buraya yazın..."
            ></textarea>
          </div>

          <button type="submit" className="send-btn" disabled={loading}>
            {loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}
          </button>
        </form>

      </div>
    </div>
  );
}

export default ContactPage;