import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv';
import './AdminPage.css';

const initialFormState = {
    id: '', title: '', description: '', longDescription: '',
    technologies: '', imageUrl: '', liveUrl: '', repoUrl: ''
};

// ==============================================================================
// 1. PROJE YÖNETİMİ BİLEŞENİ
// ==============================================================================
const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        const q = query(collection(db, "projects"), orderBy("id", "desc"));
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
        setFormData({ ...project, technologies: project.technologies.join(', ') });
        setImageUpload(null);
        window.scrollTo(0, 0);
    };
    
    const cancelEdit = () => {
        setIsEditing(null);
        setFormData(initialFormState);
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
            repoUrl: formData.repoUrl || ''
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
// 2. MESAJ GÖRÜNTÜLEME BİLEŞENİ
// ==============================================================================
const MessagesViewer = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                setMessages(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
            } catch (error) { toast.error("Mesajlar yüklenemedi."); console.error("Mesajları getirme hatası:", error); } 
            finally { setLoading(false); }
        };
        fetchMessages();
    }, []);

    const headers = [ { label: "Gönderen Adı", key: "name" }, { label: "E-posta", key: "email" }, { label: "Mesaj", key: "message" }, { label: "Gönderim Tarihi", key: "createdAt" } ];
    const csvData = messages.map(msg => ({ ...msg, createdAt: msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : '' }));

    if (loading) return <p>Mesajlar yükleniyor...</p>;

    return(
        <div className="glass-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3>Gelen Mesajlar</h3>
                {messages.length > 0 && (<CSVLink data={csvData} headers={headers} filename={"gelen-mesajlar.csv"} className="action-btn edit-btn" target="_blank">Excel'e Aktar</CSVLink>)}
            </div>
            <div className="projects-list-container">
                {messages.length === 0 ? <p>Henüz gelen mesaj yok.</p> :
                    messages.map(msg => (
                        <div key={msg.id} className="glass-card" style={{marginBottom: '1rem', background: 'rgba(0,0,0,0.3)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>
                                <strong>{msg.name}</strong>
                                <small style={{color: '#999'}}>{msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : ''}</small>
                            </div>
                            <p style={{marginBottom: '1rem'}}><a href={`mailto:${msg.email}`} style={{color: '#a0a0a0', textDecoration: 'none'}}>{msg.email}</a></p>
                            <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{msg.message}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

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
            } catch (error) { toast.error("Resim yüklenemedi!", { id: toastId }); setIsSubmitting(false); return; }
        }
        
        try {
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
// 4. ANA ADMINPAGE BİLEŞENİ (SEKME YÖNETİCİSİ)
// ==============================================================================
function AdminPage() {
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();
    const handleLogout = async () => { await signOut(auth); navigate('/login'); };

    return (
        <div className="fade-in-bottom">
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
            </div>

            <div>
                {activeTab === 'projects' && <ProjectsManager />}
                {activeTab === 'messages' && <MessagesViewer />}
                {activeTab === 'about' && <AboutMeEditor />}
            </div>
        </div>
    );
}

export default AdminPage;