import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import '../App.css';
import './BlogPage.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts');
        const q = query(postsCollectionRef, where("published", "==", true), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const postsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, slug: doc.data().slug || doc.id }));
        setPosts(postsList);
      } catch (error) {
        console.error("Blog yazıları çekilirken hata oluştu: ", error);
        // Eğer Firestore'un index gerektirdiği bir hata dönerse, fallback olarak tüm yazıları çekip client-side filtre uygula
        // (küçük ölçekli bloglar için kabul edilebilir bir çözüm; büyük projelerde indeks oluşturmak en iyisidir)
        try {
          const postsCollectionRef = collection(db, 'posts');
          const allSnapshot = await getDocs(postsCollectionRef);
          const postsList = allSnapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id, slug: doc.data().slug || doc.id }))
            .filter(p => p.published === true)
            .sort((a, b) => {
              const ta = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
              const tb = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
              return tb - ta;
            });
          setPosts(postsList);
        } catch (err2) {
          console.error('Blog için fallback veri çekme başarısız:', err2);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) { return <div className="loading-message">Yazılar Yükleniyor...</div>; }

  return (
    <section className="fade-in-bottom">
      <h2>Blog</h2>
      <div className="projects-grid" style={{marginTop: '2rem'}}>
        {posts.length === 0 ? <p>Henüz yayınlanmış bir yazı yok.</p> :
          posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card-link">
              <div className="glass-card blog-card">
                <img src={post.imageUrl || 'https://placehold.co/400x200/0f0c29/e0e0e0?text=Görsel+Yok'} alt={post.title} className="blog-card-image" />
                <div className="blog-card-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="read-more">Devamını Oku →</span>
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </section>
  );
}
export default BlogPage;