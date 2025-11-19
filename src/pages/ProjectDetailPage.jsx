import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase config dosyanızın yolu
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import './ProjectDetailPage.css'; // Stil dosyamız
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa'; // İkonlar

function ProjectDetailPage() {
  const { projectId } = useParams(); // URL'den 'projectId'yi alır
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Admin panelinde 'id' olarak kaydettiğiniz sayısal ID'ye göre sorgu yapıyoruz.
        const q = query(
          collection(db, "projects"), 
          where("id", "==", Number(projectId)),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Proje bulunamadı.');
          console.warn('Eşleşen proje ID bulunamadı:', projectId);
        } else {
          // Bulunan ilk dokümanı alıyoruz
          setProject(querySnapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Firebase sorgu hatası:", err);
        setError('Veri çekilirken bir hata oluştu.');
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  // Yüklenme durumu
  if (loading) {
    return <div className="detail-loading"><h2>Proje Yükleniyor...</h2></div>;
  }

  // Hata durumu
  if (error) {
    return <div className="detail-error"><h2>{error}</h2><Link to="/projects">Projelere Dön</Link></div>;
  }

  // Proje bulunamadıysa
  if (!project) {
    return <div className="detail-error"><h2>Proje bulunamadı.</h2><Link to="/projects">Projelere Dön</Link></div>;
  }

  return (
    <div className="project-detail-container fade-in-bottom">
      <header className="project-header">
        <h1>{project.title}</h1>
        <p className="project-summary">{project.description}</p>
        
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="header-link-btn">
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

      <div className="project-main-image">
        <img src={project.imageUrl} alt={project.title} />
      </div>

      <div className="project-content-wrapper">
        <div className="project-main-content">
          <h2>Proje Hakkında</h2>
          <div className="long-description">
            <p>{project.longDescription || "Bu proje için detaylı açıklama bulunmuyor."}</p>
          </div>
        </div>

        <aside className="project-sidebar">
          <h3>Kullanılan Teknolojiler</h3>
          <div className="tech-tags">
            {project.technologies && project.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">
                <FaCode className="tech-icon" style={{marginRight: '5px'}}/> 
                {tech}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* Vaka Analizi bölümü tamamen kaldırıldı. */}
      
      <div style={{textAlign: 'center', marginTop: '4rem'}}>
        <Link to="/projects" className="back-link">← Tüm Projelere Dön</Link>
      </div>
    </div>
  );
}

export default ProjectDetailPage;