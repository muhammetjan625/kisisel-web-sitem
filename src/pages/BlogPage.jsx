import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase config
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FaCalendarAlt, FaClock } from 'react-icons/fa'; // İkonlar
import './BlogPage.css'; // Neon CSS

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Yazıları oluşturulma tarihine göre (en yeni en üstte) çek
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sadece 'published' (yayınlanmış) olanları filtrele (Admin panelinde bu özellik vardı)
        const publishedPosts = postsData.filter(post => post.published === true);
        
        setPosts(publishedPosts);
      } catch (err) {
        console.error("Blog verisi çekilemedi:", err);
        setError("Yazılar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Tarih formatlayıcı fonksiyon
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  // Okuma süresi tahmini (Basitçe: Kelime sayısı / 200)
  const calculateReadTime = (content) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  if (loading) return <div className="blog-container"><h2 className="loading-text">Yükleniyor...</h2></div>;
  if (error) return <div className="blog-container"><h2 className="error-text">{error}</h2></div>;

  return (
    <div className="blog-container fade-in-bottom">
      <header className="blog-header">
        <h1>Blog & Yazılar</h1>
        <p>Teknoloji, yazılım ve deneyimlerim üzerine notlar.</p>
      </header>

      <div className="blog-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            // Link rotası: /blog/slug-adresi (yoksa id)
            <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="blog-card">
              
              <div className="blog-image-wrapper">
                <img 
                  src={post.imageUrl || 'https://via.placeholder.com/600x400?text=Blog+Post'} 
                  alt={post.title} 
                  loading="lazy"
                />
                <div className="blog-overlay">
                  <span className="read-article-btn">Okumaya Başla</span>
                </div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <span className="meta-item">
                    <FaCalendarAlt className="meta-icon"/> {formatDate(post.createdAt)}
                  </span>
                  <span className="meta-item">
                    <FaClock className="meta-icon"/> {calculateReadTime(post.content)} dk okuma
                  </span>
                </div>

                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">
                  {post.excerpt ? post.excerpt.substring(0, 120) + '...' : 'İçerik özeti bulunmuyor.'}
                </p>

                <div className="blog-footer">
                  <span className="read-more-link">Devamını Oku &rarr;</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-posts">Henüz yayınlanmış bir yazı yok.</p>
        )}
      </div>
    </div>
  );
}

export default BlogPage;