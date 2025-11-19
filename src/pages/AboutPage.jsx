// src/pages/AboutPage.jsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AboutPage.css'; // CSS dosyamız

function AboutPage() {
  const [aboutData, setAboutData] = useState({ bio: '', profileImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'aboutMe');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          console.log("Hakkımda verisi henüz oluşturulmamış.");
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="about-page-wrapper loading-state"> {/* Yeni wrapper sınıfı */}
        <h3>Veriler Yükleniyor...</h3>
      </div>
    );
  }

  return (
    <div className="about-page-wrapper"> {/* Yeni ana kapsayıcı sınıfı */}
      <div className="about-card"> {/* Yeni kart sınıfı */}
        <h2 className="about-title glitch" data-text="HAKKIMDA">HAKKIMDA</h2> {/* Glitch efekti için */}
        
        <div className="about-content-wrapper">
          {aboutData.profileImageUrl && (
            <div className="about-image-section">
              <img 
                src={aboutData.profileImageUrl} 
                alt="Profil" 
                className="about-profile-img" 
              />
              {/* Resmin altında glitch efekti verecek ek elemanlar */}
              <div className="glitch-overlay-1"></div>
              <div className="glitch-overlay-2"></div>
            </div>
          )}

          <div className="about-text-section">
            <p className="glitch-text" style={{ whiteSpace: 'pre-wrap' }}>
              {aboutData.bio || "Henüz biyografi bilgisi eklenmemiş."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;