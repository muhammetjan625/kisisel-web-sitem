// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase yapılandırmamızı import ediyoruz
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import '../App.css';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 'projects' koleksiyonuna referans oluştur ve 'id' alanına göre sırala
        const projectsCollectionRef = collection(db, 'projects');
        const q = query(projectsCollectionRef, orderBy("id"));
        
        const querySnapshot = await getDocs(q);
        const projectsList = querySnapshot.docs.map(doc => ({
          // doc.id Firestore'un otomatik verdiği ID, biz kendi 'id' alanımızı kullanacağız
          ...doc.data(),
          firestoreId: doc.id 
        }));
        setProjects(projectsList);
      } catch (error) {
        console.error("Projeler çekilirken hata oluştu: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Boş dependency array, bu etkinin sadece bileşen yüklendiğinde çalışmasını sağlar

  if (loading) {
    return <div className="loading-message">Projeler Yükleniyor...</div>;
  }

  return (
    <section className="fade-in-bottom">
      <h2>Projelerim</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="glass-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <Link to={`/project/${project.id}`} className="project-link">
              Detayları Gör
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomePage;