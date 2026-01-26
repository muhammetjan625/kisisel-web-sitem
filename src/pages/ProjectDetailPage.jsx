import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FaGithub, FaExternalLinkAlt, FaCode, FaArrowLeft, FaLayerGroup } from 'react-icons/fa';
import './ProjectDetailPage.css';

function ProjectDetailPage() {
  const { id } = useParams(); // URL'den gelen kimlik (örn: 0MNzV... veya 1)
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let foundProject = null;

        // --- YÖNTEM 1: Önce URL'deki kodu "Gerçek ID" (Karmaşık Kod) sanıp ara ---
        // (Şu an senin projelerinde oluşan linkler böyle)
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // ID'yi de veriye ekle ki kaybolmasın
          foundProject = { ...docSnap.data(), id: docSnap.id };
        } 
        else {
          // --- YÖNTEM 2: Bulamazsa, "Sayısal ID" (1, 2, 3) sanıp ara ---
          // (Eğer elle 1, 2, 3 yazıp girmeye çalışırsan veya linkler değişirse)
          const q = query(collection(db, "projects"), where("id", "==", Number(id)));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            foundProject = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
          }
        }

        if (foundProject) {
          setProject(foundProject);
        } else {
          console.log("Aranan ID:", id); // Konsola hata ayıklama için yazdırır
          setError("Proje bulunamadı.");
        }

      } catch (err) {
        console.error("Hata:", err);
        setError("Veri çekilirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if(id) fetchProject();
  }, [id]);

  // Yükleniyor...
  if (loading) return (
    <div className="detail-loading" style={{textAlign:'center', marginTop:'5rem', color:'#fff'}}>
        <div className="loading-spinner"></div>
        <h2 style={{marginTop:'1rem'}}>Proje Yükleniyor...</h2>
    </div>
  );

  // Hata Ekranı
  if (error || !project) {
    return (
      <div className="detail-error" style={{textAlign:'center', marginTop:'5rem', color:'#fff'}}>
        <h1 style={{fontSize:'3rem', color:'#ff4757'}}>404</h1>
        <h2>{error || "Proje Bulunamadı"}</h2>
        <p style={{color:'#888'}}>Aradığınız proje silinmiş veya linki değişmiş olabilir.</p>
        <Link to="/projects" className="back-link-btn" style={{
            display:'inline-block', marginTop:'20px', padding:'10px 25px', 
            background:'transparent', border:'1px solid #66fcf1', color:'#66fcf1', 
            textDecoration:'none', borderRadius:'50px'
        }}>
            ← Projelere Dön
        </Link>
      </div>
    );
  }

  // --- PROJE DETAYI ---
  return (
    <div className="project-detail-container fade-in-bottom">
      
      {/* Üst Başlık */}
      <header className="project-header">
        <div className="header-top">
            <Link to="/projects" className="back-text"><FaArrowLeft /> Geri</Link>
        </div>
        <h1>{project.title}</h1>
        <p className="project-summary">{project.description}</p>
        
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="header-link-btn live">
              <FaExternalLinkAlt /> Canlı Site
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="header-link-btn github">
              <FaGithub /> Kaynak Kodu
            </a>
          )}
        </div>
      </header>

      {/* Büyük Görsel */}
      <div className="project-main-image glass-card">
        <img src={project.imageUrl || 'https://placehold.co/1200x600'} alt={project.title} />
      </div>

      {/* İçerik */}
      <div className="project-content-wrapper">
        
        {/* SOL: Ana İçerik */}
        <div className="project-main-content">
          <div className="content-box glass-card">
            <h2>Proje Hakkında</h2>
            <div className="long-description">
              <p>{project.longDescription || project.description || "Detaylı açıklama bulunmuyor."}</p>
            </div>
          </div>

          {/* Vaka Analizi (Sadece veri varsa görünür) */}
          {(project.caseStudy_problem || project.caseStudy_solution) && (
            <div className="content-box glass-card case-study">
                <h2><FaLayerGroup/> Vaka Analizi</h2>
                {project.caseStudy_problem && (
                    <div className="case-item problem">
                        <h4>Problem</h4>
                        <p>{project.caseStudy_problem}</p>
                    </div>
                )}
                {project.caseStudy_solution && (
                    <div className="case-item solution">
                        <h4>Çözüm</h4>
                        <p>{project.caseStudy_solution}</p>
                    </div>
                )}
            </div>
          )}
        </div>

        {/* SAĞ: Teknolojiler */}
        <aside className="project-sidebar">
          <div className="sidebar-box glass-card">
            <h3>Kullanılan Teknolojiler</h3>
            <div className="tech-tags-cloud">
              {project.technologies && project.technologies.length > 0 ? (
                  project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag-pill">
                        <FaCode className="tech-icon"/> {tech}
                    </span>
                  ))
              ) : (
                  <span style={{color:'#888'}}>Belirtilmemiş</span>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default ProjectDetailPage;