import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("id", "desc"));
        const s = await getDocs(q);
        
        // --- DÜZELTİLEN KISIM ---
        // Eskiden: id: doc.id yapınca senin girdiğin "1, 2" numarasını eziyordu.
        // Şimdi: firestoreId diye ayrı bir alana alıyoruz, senin "id" alanına dokunmuyoruz.
        setProjects(s.docs.map(doc => ({ 
            ...doc.data(), 
            firestoreId: doc.id 
        }))); 
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if(loading) return <div style={{textAlign:'center', marginTop:'5rem', color:'#fff'}}>Yükleniyor...</div>;

  return (
    <div className="projects-wrapper fade-in-bottom">
      <div className="projects-header">
        <h1>Projelerim</h1>
        <p>Kodladığım son işler ve vaka analizleri.</p>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          // Artık p.id senin verdiğin sayı (1, 2, 3...) olduğu için link /projects/1 şeklinde olacak
          <Link to={`/projects/${p.id}`} key={p.firestoreId} className="project-card" style={{textDecoration:'none'}}>
            <div className="card-image">
              <img src={p.imageUrl || 'https://placehold.co/600x400'} alt={p.title} />
              <div className="card-overlay">
                <span>Detayları Gör <FaArrowRight /></span>
              </div>
            </div>
            <div className="card-content">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="card-tags">
                 {p.technologies && p.technologies.slice(0, 3).map((t,i) => <span key={i}>{t}</span>)}
                 {p.technologies && p.technologies.length > 3 && <span>+</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;