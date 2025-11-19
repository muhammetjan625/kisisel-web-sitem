import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import './PostDetailPage.css';

function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, "posts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setPost(querySnapshot.docs[0].data());
        } else { console.log("Yazı bulunamadı!"); }
      } catch (error) { console.error("Yazı çekilirken hata:", error); } 
      finally { setLoading(false); }
    };
    fetchPost();
  }, [slug]);

  if (loading) { return <p>Yükleniyor...</p>; }

  if (!post) {
    return (
      <div className="glass-card fade-in-bottom">
        <h2>Yazı Bulunamadı</h2>
        <Link to="/blog" className="back-link">Tüm Yazılara Geri Dön</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-container fade-in-bottom">
      <div className="glass-card">
        <img src={post.imageUrl || 'https://placehold.co/1200x600/0f0c29/e0e0e0?text=Görsel+Yok'} alt={post.title} className="post-cover-image" />
        <h1>{post.title}</h1>
        <div className="post-content"><ReactMarkdown>{post.content}</ReactMarkdown></div>
        <Link to="/blog" className="back-link" style={{marginTop: '2rem'}}>Tüm Yazılara Geri Dön</Link>
      </div>
    </div>
  );
}
export default PostDetailPage;