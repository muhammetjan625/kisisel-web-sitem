import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './PostDetailPage.css'; // Birazdan oluşturacağız

function PostDetailPage() {
  const { slug } = useParams(); // URL'den slug'ı al (örn: "react-nedir")
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Slug'a göre dökümanı ara
        const q = query(collection(db, "posts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // İlk eşleşen dökümanı al
          const docData = querySnapshot.docs[0].data();
          setPost({ ...docData, id: querySnapshot.docs[0].id });
        } else {
          setPost(null); // Bulunamadı
        }
      } catch (error) {
        console.error("Yazı çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="loading-screen">Yazı Yükleniyor...</div>;

  if (!post) {
    return (
      <div className="not-found-container">
        <h2>Yazı Bulunamadı</h2>
        <Link to="/blog" className="back-btn">Blog'a Dön</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-wrapper fade-in-bottom">
      
      {/* Üst Görsel */}
      <div className="post-header-image">
        <img src={post.imageUrl || 'https://placehold.co/1200x600'} alt={post.title} />
        <div className="post-header-overlay"></div>
        <div className="post-header-content">
          <Link to="/blog" className="back-link"><FaArrowLeft /> Blog'a Dön</Link>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span><FaCalendarAlt /> {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('tr-TR') : 'Tarih Yok'}</span>
            <span><FaClock /> 5 dk okuma</span>
          </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="post-content-container glass-card">
        <div className="post-body">
          {/* Paragrafları düzgün göstermek için basit bir yöntem */}
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

    </div>
  );
}

export default PostDetailPage;