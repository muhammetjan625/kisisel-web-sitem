import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import './AboutPage.css';

function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "siteContent", "aboutMe");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error("Veri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="about-loading">Yükleniyor...</div>;

  return (
    <div className="about-wrapper fade-in-bottom">
      <div className="about-container">
        
        {/* Sol Taraf: Profil Kartı */}
        <div className="profile-card">
          <div className="profile-image-container">
            {/* Admin panelinden foto yüklenmediyse varsayılan bir görsel gösterir */}
            <img 
              src={data?.profileImageUrl || 'https://placehold.co/400x400?text=Profil'} 
              alt="Profil" 
            />
            <div className="profile-glow"></div>
          </div>
          
          <h2 className="profile-name">Muhammetjan</h2>
          <p className="profile-title">Frontend Geliştirici</p>
          
          <div className="social-row">
            <a href="https://github.com/muhammetjan625" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="mailto:email@example.com"><FaEnvelope /></a>
          </div>

          {/* CV İNDİRME BUTONU (GÜNCELLENDİ) */}
          <a 
            href={data?.cvUrl || '#'} 
            target={data?.cvUrl ? "_blank" : "_self"}
            rel="noopener noreferrer" 
            className="download-cv-btn"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
            onClick={(e) => {
              if(!data?.cvUrl) {
                e.preventDefault();
                alert("CV dosyası henüz admin paneline eklenmedi.");
              }
            }}
          >
            <FaDownload /> CV İndir
          </a>
        </div>

        {/* Sağ Taraf: Biyografi ve Detaylar */}
        <div className="bio-section">
          <div className="glass-panel">
            <h3>Hakkımda</h3>
            <div className="bio-text">
              {/* Satır sonlarını (<br>) algılaması için white-space stili CSS'te ayarlandı */}
              <p>{data?.bio || "Henüz biyografi eklenmemiş. Admin panelinden ekleyebilirsiniz."}</p>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <h4>2+</h4>
                <span>Yıl Deneyim</span>
              </div>
              <div className="stat-box">
                <h4>10+</h4>
                <span>Proje</span>
              </div>
              <div className="stat-box">
                <h4>%100</h4>
                <span>Müşteri Memnuniyeti</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;