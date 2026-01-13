import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ContactPage.css';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Lütfen tüm alanları doldur.");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      toast.success("Mesajın başarıyla gönderildi! En kısa sürede döneceğim.");
      setFormData({ name: '', email: '', message: '' }); // Formu temizle
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Mesaj gönderilemedi. Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper fade-in-bottom">
      <Toaster position="top-center" />
      
      <div className="contact-container">
        {/* Sol Taraf: İletişim Bilgileri */}
        <div className="contact-info">
          <h2>İletişime Geç</h2>
          <p>Bir proje fikrin mi var veya sadece merhaba mı demek istiyorsun? Aşağıdaki formu doldur veya sosyal medyadan ulaş.</p>
          
          <div className="info-item">
            <div className="icon-box"><FaEnvelope /></div>
            <div>
              <h4>E-posta</h4>
              <p>sokrates.ts0gmail.com</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaMapMarkerAlt /></div>
            <div>
              <h4>Konum</h4>
              <p>Samsun, Türkiye</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaPhoneAlt /></div>
            <div>
              <h4>Telefon</h4>
              <p>+90 552 832 17 97</p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Mesaj Formu */}
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Adın Soyadın</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Örn: Muhammet Can" 
              />
            </div>

            <div className="form-group">
              <label>E-posta Adresin</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="ornek@mail.com" 
              />
            </div>

            <div className="form-group">
              <label>Mesajın</label>
              <textarea 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Projen hakkında bilgi ver..." 
              ></textarea>
            </div>

            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? 'Gönderiliyor...' : <><FaPaperPlane style={{marginRight:'8px'}} /> Gönder</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;