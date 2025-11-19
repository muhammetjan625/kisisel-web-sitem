import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { db } from '../firebase'; // Firebase config dosyanız
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './CaseStudiesPage.css'; // Havalı CSS dosyamız

function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Tüm projeleri en yeni eklenenden (ID'si büyük olandan) başlayarak çek
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, orderBy("id", "desc"));
        const querySnapshot = await getDocs(q);
        
        // 2. Gelen projeleri işle
        const allProjects = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id 
        }));

        // 3. Sadece 'caseStudy_problem' alanı dolu olanları filtrele
        // (Yani admin panelinden vaka analizi girilmiş olanlar)
        const filteredStudies = allProjects.filter(p => 
          p.caseStudy_problem && p.caseStudy_problem.trim() !== ""
        );
        
        setCaseStudies(filteredStudies);

      } catch (err) {
        console.error("Firebase sorgu hatası:", err);
        setError('Vaka analizleri çekilirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Yüklenme durumu (Siyah ekranda beyaz yazı yerine daha şık bir loading koyabiliriz ama şimdilik bu yeterli)
  if (loading) {
    return (
      <div className="case-studies-container">
        <div className="case-studies-header">
          <h1>Vaka Çalışmaları</h1>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="case-studies-container">
        <div className="case-studies-header">
          <h1>Hata</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="case-studies-container fade-in-bottom">
      <div className="case-studies-header">
        <h1>Vaka Çalışmaları</h1>
        <p>Geliştirdiğim projelerde karşılaştığım zorluklar ve çözüm süreçleri</p>
      </div>
      
      <div className="case-studies-grid">
        {caseStudies.length > 0 ? (
          caseStudies.map((study) => (
            <Link 
              to={`/project/${study.id}`} 
              key={study.firestoreId} 
              className="case-study-card"
            >
              <div className="case-study-image">
                {/* Resim yoksa placeholder göster */}
                <img src={study.imageUrl || 'https://via.placeholder.com/400x250?text=GörselYok'} alt={study.title} />
                
                {/* CSS ile çalışan Overlay */}
                <div className="case-study-overlay">
                  <span className="read-more-btn">Detaylı İncele</span>
                </div>
              </div>
              
              <div className="case-study-content">
                <h3>{study.title}</h3>
                {/* Kartta kısa açıklama gösterelim */}
                <p>{study.description}</p>
                
                <div className="case-study-tags">
                  {/* Teknolojileri virgülle ayırıp etiket yapalım */}
                  {study.technologies && Array.isArray(study.technologies) && study.technologies.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                  {/* Eğer string olarak geliyorsa (Admin panelinden bazen string gelebilir) */}
                  {study.technologies && typeof study.technologies === 'string' && study.technologies.split(',').map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '2rem'}}>
            <p style={{fontSize: '1.2rem', color: '#666'}}>Henüz yayınlanmış bir vaka analizi bulunmuyor.</p>
            <p style={{fontSize: '0.9rem', color: '#999'}}>Admin panelinden projelerinize "Vaka Analizi" detaylarını ekleyerek burada görünmelerini sağlayabilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseStudiesPage;