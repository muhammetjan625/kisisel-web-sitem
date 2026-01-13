import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaClock } from 'react-icons/fa';
import './BlogPage.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // Seçili yazı (Detay görünümü için)

  // Yazıları Çek
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Blog yazıları çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Tarih Formatlama Fonksiyonu
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Eğer bir yazı seçiliyse "Okuma Modu"nu göster
  if (selectedPost) {
    return (
      <div className="blog-wrapper fade-in">
        <div className="blog-detail-container">
          <button className="back-btn" onClick={() => setSelectedPost(null)}>
            <FaArrowLeft /> Listeye Dön
          </button>

          <article className="blog-content">
            <div className="detail-header">
              <span className="post-date">{formatDate(selectedPost.createdAt)}</span>
              <h1>{selectedPost.title}</h1>
              <div className="post-meta">
                <span><FaUser /> Admin</span>
                <span><FaClock /> 5 dk okuma</span>
              </div>
            </div>

            <img 
              src={selectedPost.imageUrl || 'https://placehold.co/800x400?text=Blog+Gorsel'} 
              alt={selectedPost.title} 
              className="detail-image" 
            />

            <div className="post-body">
              {/* Satır başlarını koruyarak metni göster */}
              {selectedPost.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Varsayılan: Liste Görünümü
  return (
    <div className="blog-wrapper fade-in-bottom">
      <div className="blog-header">
        <h1>Blog & Yazılar</h1>
        <p>Teknoloji, kodlama ve deneyimlerim üzerine notlar.</p>
      </div>

      {loading ? (
        <p className="loading-text">Yazılar yükleniyor...</p>
      ) : (
        <div className="blog-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="blog-card" onClick={() => setSelectedPost(post)}>
                <div className="blog-img-box">
                  <img src={post.imageUrl || 'https://placehold.co/600x400?text=Yazi'} alt={post.title} />
                  <div className="blog-overlay">OKU</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    <FaCalendarAlt /> {formatDate(post.createdAt)}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt ? post.excerpt.substring(0, 100) + '...' : 'İçeriği görüntülemek için tıklayın.'}</p>
                  <span className="read-more">Devamını Oku &rarr;</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts">Henüz hiç yazı eklenmemiş.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogPage;