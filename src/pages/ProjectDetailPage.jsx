// src/pages/ProjectDetailPage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ProjectDetailPage.css';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      // 'projects' koleksiyonu içinde 'id' alanı bizim projectId'mize eşit olanı bul
      const q = query(collection(db, "projects"), where("id", "==", Number(projectId)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Dokümanı bulduk ve state'e atadık
        setProject(querySnapshot.docs[0].data());
      } else {
        console.log("No such document!");
        setProject(null); // Proje bulunamadı
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]); // projectId değiştiğinde bu fonksiyonu tekrar çalıştır

  if (loading) {
    return <div className="loading-message">Proje Detayları Yükleniyor...</div>;
  }

  if (!project) {
    return (
      <div className="glass-card fade-in-bottom">
        <h2>Proje Bulunamadı</h2>
        <p>Aradığınız proje mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-container fade-in-bottom">
      <div className="glass-card">
        <div className="project-layout">
          {/* Sütun 1: Görsel */}
          <div className="project-image-container">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} className="project-image" />
            ) : (
              <div className="placeholder-image">Görsel Yok</div>
            )}
          </div>

          {/* Sütun 2: Detaylar */}
          <div className="project-info">
            <h1>{project.title}</h1>
            <p className="long-description">{project.longDescription}</p>
            
            <h3>Kullanılan Teknolojiler:</h3>
            <div className="technologies-list">
              {project.technologies && project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>

            <div className="action-buttons">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Canlı Demo</a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Kaynak Kodu</a>}
            </div>
            
          </div>
        </div>
        <Link to="/" className="back-link">Tüm Projelere Geri Dön</Link>
      </div>
    </div>
  );
}

export default ProjectDetailPage;