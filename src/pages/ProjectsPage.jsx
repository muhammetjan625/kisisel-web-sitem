import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode } from 'react-icons/fa';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  // Projeleri Firebase'den Çek
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("id", "desc"));
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Projeler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Modal Aç/Kapa
  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Arka plan kaymasını engelle
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto'; // Kaydırmayı geri aç
  };

  return (
    <>
      {/* 1. ANA İÇERİK (Animasyonlu Kısım) */}
      <div className="projects-wrapper fade-in-bottom">
        <div className="projects-header">
          <h1>Projelerim</h1>
          <p>Fikir aşamasından yayınlanma sürecine kadar geliştirdiğim işler.</p>
        </div>

        {loading ? (
          <p style={{textAlign:'center', color:'#888'}}>Projeler yükleniyor...</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card" onClick={() => openModal(project)}>
                <div className="card-image">
                  <img src={project.imageUrl || 'https://placehold.co/600x400?text=Proje'} alt={project.title} />
                  <div className="card-overlay">
                    <span>Detayları İncele</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{project.title}</h3>
                  <p>{project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                  <div className="card-techs">
                    {project.technologies && project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index}>{tech}</span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && <span>+</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MODAL (POPUP) - ARTIK WRAPPER'IN DIŞINDA! */}
      {/* Bu sayede animasyondan etkilenmez ve ekranın tam ortasında sabit kalır */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content fade-in-up" onClick={(e) => e.stopPropagation()}>
            
            {/* Kapatma Butonu */}
            <button className="close-btn" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <img src={selectedProject.imageUrl || 'https://placehold.co/800x400'} alt={selectedProject.title} className="modal-img" />
              <div className="modal-title-row">
                <h2>{selectedProject.title}</h2>
                <div className="modal-links">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="link-btn live">
                      <FaExternalLinkAlt /> Canlı Site
                    </a>
                  )}
                  {selectedProject.repoUrl && (
                    <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" className="link-btn repo">
                      <FaGithub /> Kodlar
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4><FaCode /> Teknolojiler</h4>
                <div className="modal-tags">
                  {selectedProject.technologies && selectedProject.technologies.map((t, i) => <span key={i}>{t}</span>)}
                </div>
              </div>

              <div className="modal-section">
                <h4>Proje Hakkında</h4>
                <p>{selectedProject.longDescription || selectedProject.description}</p>
              </div>

              {/* Vaka Analizi (Varsa Göster) */}
              {(selectedProject.caseStudy_problem || selectedProject.caseStudy_solution) && (
                <div className="case-study-box">
                  <h3>Vaka Analizi (Case Study)</h3>
                  
                  {selectedProject.caseStudy_problem && (
                    <div className="cs-item">
                      <strong style={{color:'#ff4757'}}>Problem:</strong>
                      <p>{selectedProject.caseStudy_problem}</p>
                    </div>
                  )}
                  
                  {selectedProject.caseStudy_solution && (
                    <div className="cs-item">
                      <strong style={{color:'#2ed573'}}>Çözüm:</strong>
                      <p>{selectedProject.caseStudy_solution}</p>
                    </div>
                  )}
                   
                   {selectedProject.caseStudy_results && (
                    <div className="cs-item">
                      <strong style={{color:'#ffa502'}}>Sonuç:</strong>
                      <p>{selectedProject.caseStudy_results}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsPage;