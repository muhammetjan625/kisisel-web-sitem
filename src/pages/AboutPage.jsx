// src/pages/AboutPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css'; // Sayfaya özel stil dosyasını import ediyoruz

// react-icons kütüphanesinden kullanacağımız ikonları import ediyoruz
import { FaReact, FaJsSquare, FaCss3Alt, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiFirebase } from 'react-icons/si';

// Yeteneklerimizi bir dizi içinde tanımlayalım. Bu sayede kolayca yönetebiliriz.
const skills = [
  { name: 'React', icon: <FaReact color="#61DAFB" /> },
  { name: 'JavaScript', icon: <FaJsSquare color="#F7DF1E" /> },
  { name: 'CSS3', icon: <FaCss3Alt color="#1572B6" /> },
  { name: 'Node.js', icon: <FaNodeJs color="#339933" /> },
  { name: 'Firebase', icon: <SiFirebase color="#FFCA28" /> },
  { name: 'Git', icon: <FaGitAlt color="#F05032" /> },
];

function AboutPage() {
  return (
    <div className="glass-card fade-in-bottom">
      <div className="about-layout">
        
        {/* Sütun 1: Profil Fotoğrafı */}
        <div className="profile-picture-container">
          <img src="/images/profile.jpg" alt="Profil Fotoğrafı" className="profile-picture" />
        </div>

        {/* Sütun 2: Hakkımda Metni ve CTA */}
        <div className="about-text-container">
          <h2>Hakkımda</h2>
          <p>
            Merhaba! Ben [Adınız Soyadınız]. Teknolojiye ve tasarıma büyük bir tutkuyla bağlı, devamlı öğrenen bir geliştiriciyim. 
            Kullanıcı dostu arayüzler ve verimli backend çözümleri oluşturarak fikirleri hayata geçirmeyi seviyorum.
          </p>
          <p>
            Bu portfolyo sitesi, React ve Firebase gibi modern web teknolojileriyle neler yapabildiğimi gösteren canlı bir projedir. 
            Yeni zorlukların üstesinden gelmek ve kendimi sürekli geliştirmek en büyük motivasyonum.
          </p>
          <Link to="/" className="cta-button">Projelerime Göz Atın</Link>
        </div>
      </div>

      {/* Yetenekler Bölümü */}
      <div className="skills-section">
        <h3>Yeteneklerim</h3>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-item">
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;