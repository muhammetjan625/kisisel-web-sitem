import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaCode, FaLayerGroup, FaUserAstronaut, FaGithub, FaLinkedin } from 'react-icons/fa';

function HomePage() {
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
        
        {/* 1. GÜNCELLENDİ: Büyük Kutu -> Artık 'Projeler' sayfasına gidiyor */}
        <Link to="/projects" className="bento-box box-large projects-box">
          <div className="box-content">
            <div className="icon-bg"><FaLayerGroup /></div>
            <h3>Tüm Projelerim</h3>
            <p>Geliştirdiğim web siteleri, uygulamalar ve detaylı vaka analizleri.</p>
            <span className="box-link-text">Hepsini Gör &rarr;</span>
          </div>
        </Link>

        {/* 2. Orta Kutu: Blog */}
        <Link to="/blog" className="bento-box box-medium blog-box">
          <div className="box-content">
            <div className="icon-bg"><FaCode /></div>
            <h3>Blog & Yazılar</h3>
            <p>Teknoloji ve kodlama üzerine notlarım.</p>
          </div>
        </Link>

        {/* 3. Orta Kutu: Hakkımda */}
        <Link to="/hakkimda" className="bento-box box-medium about-box">
          <div className="box-content">
            <div className="icon-bg"><FaUserAstronaut /></div>
            <h3>Hakkımda</h3>
            <p>Benimle tanışın.</p>
          </div>
        </Link>

        {/* 4. Geniş Kutu: İletişim ve Sosyal */}
        <div className="bento-box box-wide contact-box">
          <div className="box-content row-content">
            <div className="text-part">
              <h3>İletişime Geç</h3>
              <p>Bir proje fikrin mi var?</p>
              <Link to="/iletisim" className="contact-btn">Mesaj Gönder</Link>
            </div>
            <div className="social-links">
              {/* Linkleri kendi adreslerinle güncellemeyi unutma */}
              <a href="https://github.com/muhammetjan625" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;