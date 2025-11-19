import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv'; // Excel çıktısı için
import { RiDeleteBin6Line } from 'react-icons/ri'; // Silme ikonu
import './AdminPage.css';

// initialProjectFormState'e yeni case study alanlarını ekliyoruz (başlangıçta boş)
const initialProjectFormState = {
    id: '', title: '', description: '', longDescription: '',
    technologies: '', imageUrl: '', liveUrl: '', repoUrl: '',
    caseStudy_problem: '', caseStudy_solution: '', caseStudy_process: '', caseStudy_results: ''
};

// ==============================================================================
// 1. PROJE YÖNETİMİ BİLEŞENİ
// ==============================================================================
const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(initialProjectFormState);
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        const q = query(collection(db, "projects"), orderBy("id", "desc")); // Yeniden eskiye sırala
        const querySnapshot = await getDocs(q);
        setProjects(querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id })));
    };

    useEffect(() => { fetchProjects(); }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (project) => {
        setIsEditing(project.firestoreId);
        // Mevcut verileri forma doldur, array olan teknolojileri string'e çevir
        setFormData({ ...project, technologies: project.technologies.join(', ') });
        setImageUpload(null);
        window.scrollTo(0, 0);
    };
    
    const cancelEdit = () => {
        setIsEditing(null);
        setFormData(initialProjectFormState);
        setImageUpload(null);
    };

    const handleDelete = async (firestoreId) => {
        if (window.confirm("Bu projeyi kalıcı olarak silmek istediğinizden emin misiniz?")) {
            const toastId = toast.loading("Proje siliniyor...");
            try {
                await deleteDoc(doc(db, 'projects', firestoreId));
                toast.success('Proje başarıyla silindi!', { id: toastId });
                fetchProjects();
            } catch (error) {
                toast.error("Proje silinirken bir hata oluştu.", { id: toastId });
                console.error("Proje silme hatası:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id || !formData.title) { return toast.error("Lütfen Proje ID ve Başlık alanlarını doldurun."); }
        setIsSubmitting(true);
        const toastId = toast.loading("Proje kaydediliyor...");
        let finalImageUrl = formData.imageUrl;

        if (imageUpload) {
            const IMGBB_API_KEY = 'aeac59f4ca41eeeec5c2029f9fd5d018';
            const body = new FormData();
            body.set('key', IMGBB_API_KEY);
            body.append('image', imageUpload);
            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', body);
                finalImageUrl = response.data.data.url;
            } catch (error) {
                toast.error("Resim yüklenemedi!", { id: toastId });
                setIsSubmitting(false);
                console.error("ImgBB Hatası:", error);
                return;
            }
        }
        
        const projectData = {
            id: Number(formData.id),
            title: formData.title,
            description: formData.description || '',
            longDescription: formData.longDescription || '',
            technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()) : [],
            imageUrl: finalImageUrl || '',
            liveUrl: formData.liveUrl || '',
            repoUrl: formData.repoUrl || '',
            // Yeni Vaka Analizi Alanları
            caseStudy_problem: formData.caseStudy_problem || '',
            caseStudy_solution: formData.caseStudy_solution || '',
            caseStudy_process: formData.caseStudy_process || '',
            caseStudy_results: formData.caseStudy_results || ''
        };

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'projects', isEditing), projectData);
                toast.success('Proje güncellendi!', { id: toastId });
            } else {
                await addDoc(collection(db, 'projects'), projectData);
                toast.success('Proje eklendi!', { id: toastId });
            }
            fetchProjects();
            cancelEdit();
        } catch (error) {
            toast.error("Proje kaydedilirken bir hata oluştu.", { id: toastId });
            console.error("Firestore Hatası:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return(
        <>
            <div className="glass-card">
                <h3>{isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form-grid">
                        <div className="form-group"><label htmlFor="id_proj">Proje ID (Sıralama)</label><input id="id_proj" name="id" value={formData.id} onChange={handleChange} type="number" required /></div>
                        <div className="form-group"><label htmlFor="title_proj">Proje Başlığı</label><input id="title_proj" name="title" value={formData.title} onChange={handleChange} required /></div>
                        
                        <div className="form-group form-group-full"><label htmlFor="description_proj">Kısa Açıklama</label><input id="description_proj" name="description" value={formData.description} onChange={handleChange} /></div>
                        <div className="form-group form-group-full"><label htmlFor="longDescription_proj">Detaylı Açıklama</label><textarea id="longDescription_proj" name="longDescription" value={formData.longDescription} onChange={handleChange} rows="5"></textarea></div>
                        
                        <div className="form-group form-group-full"><label htmlFor="technologies_proj">Teknolojiler</label><input id="technologies_proj" name="technologies" value={formData.technologies} onChange={handleChange} /><span className="helper-text">Virgülle ayırın</span></div>
                        <div className="form-group form-group-full"><label htmlFor="imageFile_proj">Proje Görseli Yükle</label><input type="file" id="imageFile_proj" onChange={(event) => { setImageUpload(event.target.files[0]) }} />{isEditing && formData.imageUrl && (<div style={{marginTop: '1rem'}}><p>Mevcut Görsel:</p><img src={formData.imageUrl} alt="Önizleme" width="200" style={{borderRadius: '8px'}}/></div>)}</div>
                        
                        <div className="form-group"><label htmlFor="liveUrl_proj">Canlı Site URL</label><input id="liveUrl_proj" name="liveUrl" value={formData.liveUrl} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="repoUrl_proj">Kaynak Kodu URL</label><input id="repoUrl_proj" name="repoUrl" value={formData.repoUrl} onChange={handleChange} /></div>

                        {/* YENİ EKLENEN VAKA ANALİZİ BÖLÜMÜ */}
                        <div className="form-group form-group-full" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', marginTop: '1rem' }}><h4>Vaka Analizi Detayları (İsteğe Bağlı)</h4></div>
                        <div className="form-group form-group-full"><label>Problem / Zorluk</label><textarea name="caseStudy_problem" value={formData.caseStudy_problem} onChange={handleChange} rows="3" placeholder="Hangi sorunu çözdün?"></textarea></div>
                        <div className="form-group form-group-full"><label>Çözüm Yöntemi</label><textarea name="caseStudy_solution" value={formData.caseStudy_solution} onChange={handleChange} rows="3" placeholder="Nasıl bir çözüm ürettin?"></textarea></div>
                        <div className="form-group form-group-full"><label>Süreç</label><textarea name="caseStudy_process" value={formData.caseStudy_process} onChange={handleChange} rows="3" placeholder="Geliştirme süreci nasıldı?"></textarea></div>
                        <div className="form-group form-group-full"><label>Sonuçlar</label><textarea name="caseStudy_results" value={formData.caseStudy_results} onChange={handleChange} rows="3" placeholder="Hangi sonuçları elde ettin?"></textarea></div>

                        {isEditing && <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={isSubmitting}>İptal Et</button>}
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Projeyi Güncelle' : 'Projeyi Ekle')}</button>
                    </form>
                </div>
            </div>
            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3>Mevcut Projeler</h3>
                <div className="projects-list-container">{projects.map(p => (<div key={p.firestoreId} className="project-list-item"><img src={p.imageUrl || 'https://via.placeholder.com/100x60?text=GörselYok'} alt={p.title} className="project-list-thumbnail" /><div className="project-list-info"><p>{p.id} - {p.title}</p></div><div className="project-list-actions"><button onClick={() => handleEdit(p)} className="action-btn edit-btn">Düzenle</button><button onClick={() => handleDelete(p.firestoreId)} className="action-btn delete-btn">Sil</button></div></div>))}</div>
            </div>
        </>
    );
}

// ==============================================================================
// 2. MESAJ GÖRÜNTÜLEME BİLEŞENİ (GÜNCELLENDİ)
// ==============================================================================
const MessagesViewer = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setMessages(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
        } catch (error) {
            console.error('Mesajları getirme hatası:', error);
            toast.error('Mesajlar yüklenemedi.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchMessages(); }, []);

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('Bu mesajı kalıcı olarak silmek istediğinizden emin misiniz?')) return;
        const toastId = toast.loading('Mesaj siliniyor...');
        try {
            await deleteDoc(doc(db, 'messages', messageId));
            toast.success('Mesaj başarıyla silindi!', { id: toastId });
            fetchMessages();
        } catch (error) {
            console.error('Mesaj silme hatası:', error);
            toast.error('Mesaj silinirken bir hata oluştu.', { id: toastId });
        }
    };

    // CSV için başlıklar
    const headers = [
        { label: 'Gönderen Adı', key: 'name' },
        { label: 'E-posta', key: 'email' },
        { label: 'Mesaj', key: 'message' },
        { label: 'Gönderim Tarihi', key: 'createdAt' }
    ];

    // CSV verisini formatla
    const csvData = messages.map(msg => ({
        ...msg,
        createdAt: msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : ''
    }));

    if (loading) return <p>Mesajlar yükleniyor...</p>;

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Gelen Mesajlar</h3>
                {messages.length > 0 && (
                    <CSVLink data={csvData} headers={headers} filename={"gelen-mesajlar.csv"} className="action-btn edit-btn" target="_blank">
                        Excel'e Aktar
                    </CSVLink>
                )}
            </div>

            <div className="messages-list">
                {messages.length === 0 ? <p>Henüz gelen mesaj yok.</p> : messages.map(msg => (
                    <div key={msg.id} className="message-card">
                        <div className="message-header">
                            <div className="message-avatar">{msg.name ? msg.name[0].toUpperCase() : '?'}</div>
                            <div className="message-sender">
                                <strong>{msg.name}</strong>
                                <p><a href={`mailto:${msg.email}`} style={{ color: '#a0a0a0', textDecoration: 'none' }}>{msg.email}</a></p>
                            </div>
                            <div className="message-meta">
                                <small style={{ color: '#999' }}>{msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : ''}</small>
                                <button className="delete-message-btn" title="Mesajı Sil" onClick={() => handleDeleteMessage(msg.id)}>
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                        <p className="message-body" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==============================================================================
// 3. HAKKIMDA SAYFASI DÜZENLEME BİLEŞENİ
// ==============================================================================
const AboutMeEditor = () => {
    const [formData, setFormData] = useState({ bio: '', profileImageUrl: '' });
    const [imageUpload, setImageUpload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAboutData = async () => {
            const docRef = doc(db, 'siteContent', 'aboutMe');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) { setFormData(docSnap.data()); }
            setLoading(false);
        };
        fetchAboutData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Bilgiler kaydediliyor...");
        let finalImageUrl = formData.profileImageUrl;

        if (imageUpload) {
            const IMGBB_API_KEY = 'aeac59f4ca41eeeec5c2029f9fd5d018';
            const body = new FormData(); body.set('key', IMGBB_API_KEY); body.append('image', imageUpload);
            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', body);
                finalImageUrl = response.data.data.url;
            } catch (error) { console.error(error); toast.error("Resim yüklenemedi!", { id: toastId }); setIsSubmitting(false); return; }
        }
        
        try {
            // 'siteContent' koleksiyonunda 'aboutMe' adında tek bir doküman tutuyoruz
            const docRef = doc(db, 'siteContent', 'aboutMe');
            await setDoc(docRef, { bio: formData.bio, profileImageUrl: finalImageUrl }, { merge: true });
            toast.success("Bilgiler başarıyla güncellendi!", { id: toastId });
        } catch (error) { toast.error("Bir hata oluştu.", { id: toastId }); console.error(error); } 
        finally { setIsSubmitting(false); }
    };

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div className="glass-card">
            <h3>Hakkımda Sayfasını Düzenle</h3>
            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form-grid" style={{gridTemplateColumns: '1fr'}}>
                    <div className="form-group form-group-full"><label htmlFor="bio">Biyografi Metni</label><textarea id="bio" rows="10" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea></div>
                    <div className="form-group form-group-full"><label htmlFor="profileImage">Profil Fotoğrafı Yükle</label><input type="file" id="profileImage" onChange={(e) => setImageUpload(e.target.files[0])} />{formData.profileImageUrl && (<div style={{marginTop: '1rem'}}><p>Mevcut Fotoğraf:</p><img src={formData.profileImageUrl} alt="Profil Önizleme" width="150" style={{borderRadius: '50%'}}/></div>)}</div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}</button>
                </form>
            </div>
        </div>
    );
};

// ==============================================================================
// 4. BLOG YÖNETİMİ BİLEŞENİ
// ==============================================================================
const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', imageUrl: '', published: true });
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

    const fetchPosts = async () => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id })));
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'title') {
            setFormData(prev => ({ ...prev, title: value, slug: slugify(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };
    
    const handleEdit = (post) => { setIsEditing(post.firestoreId); setFormData(post); setImageUpload(null); window.scrollTo(0, 0); };
    const cancelEdit = () => { setIsEditing(null); setFormData({ title: '', slug: '', excerpt: '', content: '', imageUrl: '', published: true }); setImageUpload(null); };

    const handleDelete = async (firestoreId) => {
        if (window.confirm("Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?")) {
            const toastId = toast.loading("Yazı siliniyor...");
            try {
                await deleteDoc(doc(db, 'posts', firestoreId));
                toast.success('Yazı başarıyla silindi!', { id: toastId });
                fetchPosts();
            } catch (error) { console.error('Yazı silme hatası:', error); toast.error("Yazı silinirken bir hata oluştu.", { id: toastId }); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) { return toast.error("Lütfen Başlık ve İçerik alanlarını doldurun."); }
        setIsSubmitting(true);
        const toastId = toast.loading("Yazı kaydediliyor...");
        let finalImageUrl = formData.imageUrl;
        if (imageUpload) { /* ... resim yükleme mantığı aynı ... */ }
        
        // resim yükleme (imgbb) - aynı mantık projelerde kullanıldı
        if (imageUpload) {
            const IMGBB_API_KEY = 'aeac59f4ca41eeeec5c2029f9fd5d018';
            const body = new FormData(); body.set('key', IMGBB_API_KEY); body.append('image', imageUpload);
            try {
                const resp = await axios.post('https://api.imgbb.com/1/upload', body);
                finalImageUrl = resp.data.data.url;
            } catch (error) { console.error('ImgBB Hatası:', error); toast.error('Resim yüklenemedi.', { id: toastId }); setIsSubmitting(false); return; }
        }

        const postData = { ...formData, imageUrl: finalImageUrl || '' };

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'posts', isEditing), { ...postData, updatedAt: serverTimestamp() });
                toast.success('Yazı güncellendi!', { id: toastId });
            } else {
                await addDoc(collection(db, 'posts'), { ...postData, createdAt: serverTimestamp() });
                toast.success('Yazı eklendi!', { id: toastId });
            }
            fetchPosts(); cancelEdit();
        } catch (error) { console.error("Firestore Hatası:", error); toast.error("Bir hata oluştu.", { id: toastId }); } 
        finally { setIsSubmitting(false); }
    };
    
    return (
        <>
            <div className="glass-card">
                <h3>{isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h3>
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form-grid">
                        <div className="form-group"><label>Başlık</label><input name="title" value={formData.title} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Slug</label><input name="slug" value={formData.slug} onChange={handleChange} /></div>
                        <div className="form-group form-group-full"><label>Özet</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3}></textarea></div>
                        <div className="form-group form-group-full"><label>İçerik (HTML/Markdown)</label><textarea name="content" value={formData.content} onChange={handleChange} rows={8}></textarea></div>
                        <div className="form-group form-group-full"><label>Görsel Yükle</label><input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />{formData.imageUrl && (<div style={{marginTop: '1rem'}}><img src={formData.imageUrl} alt="önizleme" width={200} style={{borderRadius: 8}}/></div>)}</div>
                        <div className="form-group"><label>Yayınla</label><input type="checkbox" name="published" checked={formData.published} onChange={handleChange} /></div>
                        {isEditing && <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={isSubmitting}>İptal</button>}
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Yazıyı Ekle')}</button>
                    </form>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3>Mevcut Yazılar</h3>
                <div className="projects-list-container">
                    {posts.length === 0 ? <p>Henüz yazı yok.</p> : posts.map(p => (
                        <div key={p.firestoreId} className="project-list-item">
                            <img src={p.imageUrl || 'https://via.placeholder.com/100x60?text=GörselYok'} alt={p.title} className="project-list-thumbnail" />
                            <div className="project-list-info"><p>{p.title} <br/><small style={{color:'#888'}}>{p.slug}</small></p></div>
                            <div className="project-list-actions">
                                <button onClick={() => handleEdit(p)} className="action-btn edit-btn">Düzenle</button>
                                <button onClick={() => handleDelete(p.firestoreId)} className="action-btn delete-btn">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


// ==============================================================================
// 4. ANA ADMINPAGE BİLEŞENİ (SEKME YÖNETİCİSİ)
// ==============================================================================
function AdminPage() {
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();
    const handleLogout = async () => { await signOut(auth); navigate('/login'); };

    return (
        <div className="admin-page-wrapper fade-in-bottom">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <h2>Admin Paneli</h2>
                <div>
                    <Link to="/" className="submit-btn" style={{ backgroundColor: '#2980b9', marginRight: '1rem' }}>Siteyi Görüntüle</Link>
                    <button onClick={handleLogout} className="submit-btn" style={{ backgroundColor: '#c0392b' }}>Çıkış Yap</button>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projeleri Yönet</button>
                <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Gelen Mesajlar</button>
                <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>Hakkımda Sayfası</button>
                <button className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>Blog Yönetimi</button>
            </div>

            <div>
                {activeTab === 'projects' && <ProjectsManager />}
                {activeTab === 'messages' && <MessagesViewer />}
                {activeTab === 'about' && <AboutMeEditor />}
                {activeTab === 'blog' && <BlogManager />}
            </div>
        </div>
    );
}

export default AdminPage;