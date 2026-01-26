import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaSearch } from 'react-icons/fa';
import './BlogPage.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Yazıları tarihe göre yeniden eskiye sırala
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(postsData);
      } catch (error) {
        console.error("Blog yazıları çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Arama Filtresi
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="blog-loading">Yazılar Yükleniyor...</div>;

  return (
    <div className="blog-page-wrapper fade-in-bottom">
      
      {/* Başlık ve Arama */}
      <div className="blog-header">
        <h1>Blog & Notlar</h1>
        <p>Yazılım, teknoloji ve deneyimlerim üzerine paylaşımlar.</p>
        
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Yazılarda ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Yazı Listesi */}
      <div className="blog-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.imageUrl || 'https://placehold.co/600x400?text=Blog'} alt={post.title} />
                <div className="blog-overlay">
                  <span>Oku <FaArrowRight /></span>
                </div>
              </div>
              
              <div className="blog-content">
                <div className="blog-date">
                  <FaCalendarAlt /> 
                  {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                </div>
                <h3>{post.title}</h3>
                <p>
                  {post.content 
                    ? post.content.substring(0, 100) + '...' 
                    : 'İçerik önizlemesi bulunmuyor.'}
                </p>
                <span className="read-more">Devamını Oku</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-posts">
            <p>Henüz yazı bulunamadı veya arama kriterine uymuyor.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default BlogPage;