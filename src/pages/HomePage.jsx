import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import './HomePage.css';
// İkonlar
import { FaCode, FaLayerGroup, FaUserAstronaut, FaGithub, FaLinkedin, FaMicrochip, FaGraduationCap, FaBriefcase, FaCodeBranch, FaArrowRight } from 'react-icons/fa';

function HomePage() {
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]); // Yeni: Hizmetler State'i

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Yetenekleri Çek
        const sQ = query(collection(db, "skills"), orderBy("percent", "desc"));
        const sSnap = await getDocs(sQ);
        setSkills(sSnap.docs.map(doc => doc.data()));

        // 2. Referansları Çek
        const tQ = query(collection(db, "testimonials"), orderBy("createdAt", "desc"), limit(6));
        const tSnap = await getDocs(tQ);
        setTestimonials(tSnap.docs.map(doc => ({...doc.data(), id: doc.id})));

        // 3. Hizmetleri Çek (YENİ)
        const svQ = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const svSnap = await getDocs(svQ);
        setServices(svSnap.docs.map(doc => ({...doc.data(), id: doc.id})));

      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };
    fetchData();
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
        <Link to="/about" className="bento-box box-medium about-box">
          <div className="box-content">
            <div className="icon-bg"><FaUserAstronaut /></div>
            <h3>Hakkımda</h3>
            <p>Benimle tanışın.</p>
          </div>
        </Link>

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
               <Link to="/contact" className="contact-btn">Mesaj Gönder</Link>
               <div className="social-links">
                  <a href="https://github.com/muhammetjan625" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- YENİ BÖLÜM: HİZMETLER --- */}
      {/* Eğer admin panelinden hizmet eklediysen burası görünür */}
      {services.length > 0 && (
          <>
            <div className="section-title" style={{marginTop:'5rem', textAlign:'center'}}>
                <h2>Hizmetlerim</h2>
                <p>Size nasıl yardımcı olabilirim?</p>
            </div>
            <div className="services-grid" style={{
                display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', 
                gap:'1.5rem', marginTop:'2rem', padding:'0 1rem'
            }}>
                {services.map(s => (
                    <div key={s.id} className="glass-card" style={{
                        padding:'2rem', borderRadius:'16px', borderTop:'4px solid #66fcf1', 
                        textAlign:'center', background:'rgba(11, 12, 16, 0.6)'
                    }}>
                        <div style={{fontSize:'3rem', marginBottom:'1rem'}}>{s.icon}</div>
                        <h3 style={{color:'#fff', marginBottom:'0.5rem'}}>{s.title}</h3>
                        <p style={{color:'#8892b0', fontSize:'0.95rem'}}>{s.description}</p>
                    </div>
                ))}
            </div>
          </>
      )}

      {/* --- ZAMAN ÇİZELGESİ (TIMELINE) --- */}
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

      {/* --- KAYAN TEKNOLOJİLER (MARQUEE) --- */}
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

      {/* --- REFERANSLAR BÖLÜMÜ --- */}
      <div className="section-title" style={{marginTop:'4rem', textAlign:'center'}}>
        <h2>Referanslar</h2>
      </div>
      <div className="testimonials-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem', marginTop:'2rem'}}>
        {testimonials.map(t => (
            <div key={t.id} className="glass-card" style={{padding:'1.5rem', borderRadius:'12px', background:'rgba(11,12,16,0.6)'}}>
                <div style={{color:'#66fcf1', fontSize:'2rem'}}>“</div>
                <p style={{fontStyle:'italic', color:'#c5c6c7', marginBottom:'1rem'}}>{t.comment}</p>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><h4 style={{margin:0, color:'#fff'}}>{t.name}</h4><small style={{color:'#888'}}>{t.company}</small></div>
                    <div style={{color:'#ffa502'}}>{"★".repeat(t.rating)}</div>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
}

export default HomePage;