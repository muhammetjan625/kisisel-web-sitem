import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase bağlantısı
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './HomePage.css';
// İkonlara Timeline için yenileri eklendi: FaGraduationCap, FaBriefcase, FaCodeBranch
import { FaCode, FaLayerGroup, FaUserAstronaut, FaGithub, FaLinkedin, FaMicrochip, FaGraduationCap, FaBriefcase, FaCodeBranch } from 'react-icons/fa';

function HomePage() {
  const [skills, setSkills] = useState([]);

  // Yetenekleri Firebase'den Çek
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const q = query(collection(db, "skills"), orderBy("percent", "desc"));
        const snapshot = await getDocs(q);
        setSkills(snapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Yetenekler çekilemedi:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="home-wrapper fade-in">
      
      {/* Üst Tanıtım (Hero) */}
      <header className="home-hero">
        <h1 className="hero-title">
          Merhaba, ben <span className="highlight">Muhammetjan.</span>
        </h1>
        <p className="hero-subtitle">
          Modern web deneyimleri tasarlayan <span className="role-text">Frontend Geliştirici</span>.
        </p>
      </header>

      {/* BENTO GRID DÜZENİ */}
      <div className="bento-grid">
        
        {/* 1. Büyük Kutu: Projeler */}
        <Link to="/projects" className="bento-box box-large projects-box">
          <div className="box-content">
            <div className="icon-bg"><FaLayerGroup /></div>
            <h3>Tüm Projelerim</h3>
            <p>Geliştirdiğim web siteleri, uygulamalar ve detaylı vaka analizleri.</p>
            <span className="box-link-text">Hepsini Gör &rarr;</span>
          </div>
        </Link>

        {/* 2. Blog Kutusu */}
        <Link to="/blog" className="bento-box box-medium blog-box">
          <div className="box-content">
            <div className="icon-bg"><FaCode /></div>
            <h3>Blog</h3>
            <p>Kodlama notlarım.</p>
          </div>
        </Link>

        {/* 3. Hakkımda Kutusu */}
        <Link to="/hakkimda" className="bento-box box-medium about-box">
          <div className="box-content">
            <div className="icon-bg"><FaUserAstronaut /></div>
            <h3>Hakkımda</h3>
            <p>Benimle tanışın.</p>
          </div>
        </Link>

        {/* 4. Yetenekler Kutusu */}
        {/* 4. Yetenekler Kutusu */}
<div className="bento-box box-wide skills-box">
  <div className="box-content">
    <div className="icon-bg"><FaMicrochip /></div>
    <h3>Yeteneklerim</h3>
    <div className="skills-ticker">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <div key={index} className="home-skill-tag">
            <span className="skill-name">{skill.name}</span>
            {/* YENİ EKLENEN KISIM: YÜZDE GÖSTERGESİ */}
            <span className="skill-percent">%{skill.percent}</span>
            <span className="skill-dot" style={{opacity: skill.percent / 100}}></span>
          </div>
        ))
      ) : (
        <p style={{fontSize:'0.9rem', color:'#666'}}>Yetenek verisi yükleniyor...</p>
      )}
    </div>
  </div>
</div>

        {/* 5. İletişim Kutusu */}
        <div className="bento-box box-full contact-box">
          <div className="box-content row-content">
            <div className="text-part">
              <h3>Birlikte Çalışalım mı?</h3>
              <p>Bir proje fikrin varsa veya tanışmak istersen mesaj atabilirsin.</p>
            </div>
            <div className="action-part">
               <Link to="/iletisim" className="contact-btn">Mesaj Gönder</Link>
               <div className="social-links">
                  <a href="https://github.com/muhammetjan625" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- YENİ BÖLÜM 1: ZAMAN ÇİZELGESİ (TIMELINE) --- */}
      <div className="timeline-section">
        <h2 className="section-title">Yolculuğum</h2>
        
        <div className="timeline">
          {/* Madde 1 */}
          <div className="timeline-item left">
            <div className="timeline-content">
              <div className="timeline-icon"><FaCodeBranch /></div>
              <span className="timeline-date">2026 - Günümüz</span>
              <h3>Freelance & Projeler</h3>
              <p>Modern web teknolojileri ile özgün projeler geliştiriyor, açık kaynak dünyasına katkı sağlıyorum.</p>
            </div>
          </div>

          {/* Madde 2 */}
          <div className="timeline-item right">
            <div className="timeline-content">
              <div className="timeline-icon"><FaGraduationCap /></div>
              <span className="timeline-date">2021- Devam Ediyor</span>
              <h3>Ondokuz Mayıs Üniversitesi</h3>
              <p>Eğitim Fakültesi'nde öğrenim hayatıma devam ederken, frontend dünyasında kendimi geliştiriyorum.</p>
            </div>
          </div>

          {/* Madde 3 */}
          <div className="timeline-item left">
            <div className="timeline-content">
              <div className="timeline-icon"><FaBriefcase /></div>
              <span className="timeline-date">2020</span>
              <h3>Frontend Başlangıcı</h3>
              <p>HTML, CSS ve JavaScript ile web dünyasına ilk adımımı attım ve ilk portfolyomu oluşturdum.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- YENİ BÖLÜM 2: KAYAN TEKNOLOJİLER (MARQUEE) --- */}
      <div className="tech-marquee">
        <div className="marquee-content">
          <span>REACT</span>
          <span>FIREBASE</span>
          <span>JAVASCRIPT</span>
          <span>CSS3</span>
          <span>HTML5</span>
          <span>GIT</span>
          <span>UI/UX</span>
          <span>FIGMA</span>
          <span>TAILWIND</span>
          <span>SUPABASE</span>
          {/* Sonsuz döngü hissi için tekrar ediyoruz */}
          <span>REACT</span>
          <span>FIREBASE</span>
          <span>JAVASCRIPT</span>
          <span>CSS3</span>
          <span>HTML5</span>
          <span>GIT</span>
          <span>UI/UX</span>
          <span>FIGMA</span>
          <span>TAILWIND</span>
          <span>SUPABASE</span>
        </div>
      </div>

    </div>
  );
}

export default HomePage;