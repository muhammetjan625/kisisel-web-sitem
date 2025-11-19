import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("id", "desc"));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Projeler çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="projects-loading"><h2>Projeler Yükleniyor...</h2></div>;

  return (
    <div className="projects-container fade-in-bottom">
      <header className="projects-header">
        <h1>Tüm Projelerim</h1>
        <p>Kodladığım, tasarladığım ve geliştirdiğim işlerin bir koleksiyonu.</p>
      </header>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.firestoreId} className="project-card-neon">
            
            {/* Üst Kısım: Görsel ve Overlay */}
            <div className="project-image-box">
              <img 
                src={project.imageUrl || 'https://via.placeholder.com/400x250'} 
                alt={project.title} 
              />
              <div className="project-overlay">
                {/* Detay sayfasına gitmek için buton */}
                <Link to={`/project/${project.id}`} className="overlay-btn">
                  Detayları Gör
                </Link>
              </div>
            </div>

            {/* Alt Kısım: İçerik */}
            <div className="project-content">
              <div className="project-title-row">
                <h3>{project.title}</h3>
                <div className="project-links-mini">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" title="GitHub">
                      <FaGithub />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" title="Canlı Site">
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              <p className="project-desc">
                {project.description ? project.description.substring(0, 100) + '...' : 'Açıklama yok.'}
              </p>

              <div className="project-tech-stack">
                {project.technologies && Array.isArray(project.technologies) ? (
                  project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="neon-tag"><FaCode className="tiny-icon"/> {tech}</span>
                  ))
                ) : (
                  <span className="neon-tag">Tech</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;