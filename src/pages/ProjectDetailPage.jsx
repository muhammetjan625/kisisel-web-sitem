import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase config dosyanızın yolu
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import './ProjectDetailPage.css'; // Stil dosyamız
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'; // İkonlar

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
        // Gelen projectId'yi Number() ile sayıya çevirmek önemli.
        const q = query(
          collection(db, "projects"), 
          where("id", "==", Number(projectId)),
          limit(1) // ID benzersiz olduğu için 1 tane getirmesi yeterli
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
  }, [projectId]); // projectId değiştikçe tekrar çalışır

  // Vaka analizi verisinin olup olmadığını kontrol et
  const hasCaseStudy = project && project.caseStudy_problem && project.caseStudy_problem.trim() !== '';

  // Yüklenme durumu
  if (loading) {
    return <div className="detail-loading"><h2>Proje Yükleniyor...</h2></div>;
  }

  // Hata durumu
  if (error) {
    return <div className="detail-error"><h2>{error}</h2><Link to="/">Ana Sayfaya Dön</Link></div>;
  }

  // Proje bulunamadıysa (fetch bitti ama 'project' hala null)
  if (!project) {
    return <div className="detail-error"><h2>Proje bulunamadı.</h2><Link to="/">Ana Sayfaya Dön</Link></div>;
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
          <h2>Proje Detayları</h2>
          {/* Admin panelindeki 'longDescription' alanı */}
          {/* Bu alanı HTML olarak render etmek riskli olabilir,
              eğer admin panelinde HTML yazıyorsanız, 'dangerouslySetInnerHTML'
              kullanmanız gerekir. Şimdilik düz metin olarak basıyoruz. */}
          <div className="long-description">
            <p>{project.longDescription}</p>
          </div>
        </div>

        <aside className="project-sidebar">
          <h3>Kullanılan Teknolojiler</h3>
          <div className="tech-tags">
            {project.technologies && project.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>
        </aside>
      </div>

      {/* === VAKA ANALİZİ BÖLÜMÜ (KOŞULLU) === */}
      {hasCaseStudy && (
        <section className="case-study-section">
          <h2>Vaka Analizi</h2>
          
          <div className="case-study-box">
            <h4>Problem</h4>
            <p>{project.caseStudy_problem}</p>
          </div>
          
          <div className="case-study-box">
            <h4>Uygulanan Çözüm</h4>
            <p>{project.caseStudy_solution}</p>
          </div>
          
          {project.caseStudy_process && (
            <div className="case-study-box">
              <h4>Geliştirme Süreci</h4>
              <p>{project.caseStudy_process}</p>
            </div>
          )}

          {project.caseStudy_results && (
            <div className="case-study-box results">
              <h4>Elde Edilen Sonuçlar</h4>
              <p>{project.caseStudy_results}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ProjectDetailPage;