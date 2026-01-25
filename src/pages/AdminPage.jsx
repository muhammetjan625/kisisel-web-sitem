import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, verifyBeforeUpdateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { CSVLink } from 'react-csv';
import { RiDeleteBin6Line, RiDashboardLine, RiFileCodeLine, RiMessage2Line, RiUserStarLine, RiArticleLine, RiCpuLine, RiSettings3Line } from 'react-icons/ri';
import './AdminPage.css';

// --- YARDIMCI FONKSİYON: SİLME ONAYI İÇİN ÖZEL TOAST ---
// Bu fonksiyonu tüm silme işlemlerinde kullanacağız.
const confirmDeleteToast = (onConfirm) => {
    toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '250px' }}>
            <span style={{ fontWeight: 600 }}>Silmek istediğine emin misin?</span>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm(); // Onaylanırsa silme fonksiyonunu çalıştır
                    }}
                    style={{
                        background: '#ff4757', border: 'none', color: '#fff', 
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Evet, Sil
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        background: 'transparent', border: '1px solid #888', color: '#ccc', 
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer'
                    }}
                >
                    Vazgeç
                </button>
            </div>
        </div>
    ), { duration: 5000, style: { background: '#1e272e', color: '#fff', border: '1px solid #ff4757' } });
};

const initialProjectFormState = {
    id: '', title: '', description: '', longDescription: '',
    technologies: '', imageUrl: '', liveUrl: '', repoUrl: '',
    caseStudy_problem: '', caseStudy_solution: '', caseStudy_process: '', caseStudy_results: ''
};

// ================== 1. DASHBOARD ==================
const Dashboard = ({ setActiveTab }) => {
    const [stats, setStats] = useState({ projects: 0, messages: 0, blogs: 0, skills: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const projSnap = await getDocs(collection(db, "projects"));
                const msgSnap = await getDocs(collection(db, "messages"));
                const blogSnap = await getDocs(collection(db, "posts"));
                const skillSnap = await getDocs(collection(db, "skills"));
                setStats({ projects: projSnap.size, messages: msgSnap.size, blogs: blogSnap.size, skills: skillSnap.size });
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="detail-loading"><p>Veriler Yükleniyor...</p></div>;

    return (
        <div className="dashboard-container fade-in-bottom">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid #ff4757', textAlign:'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', border:'none', padding:0 }}>{stats.messages}</h3>
                    <p style={{ margin: 0, color: '#888' }}>Mesaj</p>
                    <button className="action-btn" style={{marginTop:'10px', width:'100%'}} onClick={() => setActiveTab('messages')}>Git</button>
                </div>
                <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid #2ed573', textAlign:'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', border:'none', padding:0 }}>{stats.projects}</h3>
                    <p style={{ margin: 0, color: '#888' }}>Proje</p>
                    <button className="action-btn" style={{marginTop:'10px', width:'100%'}} onClick={() => setActiveTab('projects')}>Git</button>
                </div>
                <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid #ffa502', textAlign:'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', border:'none', padding:0 }}>{stats.blogs}</h3>
                    <p style={{ margin: 0, color: '#888' }}>Blog</p>
                    <button className="action-btn" style={{marginTop:'10px', width:'100%'}} onClick={() => setActiveTab('blog')}>Git</button>
                </div>
                <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid #66fcf1', textAlign:'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', border:'none', padding:0 }}>{stats.skills}</h3>
                    <p style={{ margin: 0, color: '#888' }}>Yetenek</p>
                    <button className="action-btn" style={{marginTop:'10px', width:'100%'}} onClick={() => setActiveTab('skills')}>Git</button>
                </div>
            </div>
        </div>
    );
};

// ================== 2. PROJE YÖNETİMİ ==================
const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(initialProjectFormState);
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, "projects"), orderBy("id", "desc"));
            const querySnapshot = await getDocs(q);
            setProjects(querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id })));
        } catch (e) { console.error(e); }
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
    const cancelEdit = () => { setIsEditing(null); setFormData(initialProjectFormState); setImageUpload(null); };
    
    // YENİ: TOAST İLE SİLME İŞLEMİ
    const handleDelete = (firestoreId) => {
        confirmDeleteToast(async () => {
            const toastId = toast.loading("Siliniyor...");
            try { 
                await deleteDoc(doc(db, 'projects', firestoreId)); 
                toast.success('Proje başarıyla silindi!', { id: toastId }); 
                fetchProjects(); 
            } catch { 
                toast.error("Silinirken hata oluştu.", { id: toastId }); 
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id || !formData.title) return toast.error("ID ve Başlık zorunlu.");
        setIsSubmitting(true);
        const toastId = toast.loading("Kaydediliyor...");
        let finalImageUrl = formData.imageUrl;
        
        if (imageUpload) {
            const body = new FormData(); body.set('key', 'aeac59f4ca41eeeec5c2029f9fd5d018'); body.append('image', imageUpload);
            try { const response = await axios.post('https://api.imgbb.com/1/upload', body); finalImageUrl = response.data.data.url; } 
            catch { toast.error("Resim yüklenemedi!", { id: toastId }); setIsSubmitting(false); return; }
        }

        const projectData = {
            id: Number(formData.id), title: formData.title, description: formData.description || '', longDescription: formData.longDescription || '',
            technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()) : [],
            imageUrl: finalImageUrl || '', liveUrl: formData.liveUrl || '', repoUrl: formData.repoUrl || '',
            caseStudy_problem: formData.caseStudy_problem || '', caseStudy_solution: formData.caseStudy_solution || '',
            caseStudy_process: formData.caseStudy_process || '', caseStudy_results: formData.caseStudy_results || ''
        };

        try {
            if (isEditing) { await updateDoc(doc(db, 'projects', isEditing), { ...projectData, updatedAt: serverTimestamp() }); toast.success('Proje güncellendi!', { id: toastId }); } 
            else { await addDoc(collection(db, 'projects'), { ...projectData, createdAt: serverTimestamp() }); toast.success('Yeni proje eklendi!', { id: toastId }); }
            fetchProjects(); cancelEdit();
        } catch { toast.error("Hata oluştu.", { id: toastId }); } finally { setIsSubmitting(false); }
    };

    return(
        <>
            <div className="glass-card fade-in-bottom">
                <h3>{isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form-grid">
                        <div className="form-group"><label>Sıra No (ID)</label><input name="id" value={formData.id} onChange={handleChange} type="number" required /></div>
                        <div className="form-group"><label>Proje Başlığı</label><input name="title" value={formData.title} onChange={handleChange} required /></div>
                        <div className="form-group form-group-full"><label>Kısa Açıklama</label><input name="description" value={formData.description} onChange={handleChange} /></div>
                        <div className="form-group form-group-full"><label>Detaylı Açıklama</label><textarea name="longDescription" value={formData.longDescription} onChange={handleChange} rows="3"></textarea></div>
                        <div className="form-group form-group-full"><label>Teknolojiler</label><input name="technologies" value={formData.technologies} onChange={handleChange} /></div>
                        <div className="form-group form-group-full"><label>Proje Görseli</label><input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />{formData.imageUrl && <img src={formData.imageUrl} width="100" style={{marginTop:10}} alt=""/>}</div>
                        <div className="form-group"><label>Canlı Site Linki</label><input name="liveUrl" value={formData.liveUrl} onChange={handleChange} /></div>
                        <div className="form-group"><label>Repo Linki</label><input name="repoUrl" value={formData.repoUrl} onChange={handleChange} /></div>
                        <div className="form-group form-group-full" style={{marginTop:'10px', borderTop:'1px solid #333', paddingTop:'10px'}}><h4>Vaka Analizi</h4></div>
                        <div className="form-group form-group-full"><label>Problem</label><textarea name="caseStudy_problem" value={formData.caseStudy_problem} onChange={handleChange} rows="2"></textarea></div>
                        <div className="form-group form-group-full"><label>Çözüm</label><textarea name="caseStudy_solution" value={formData.caseStudy_solution} onChange={handleChange} rows="2"></textarea></div>
                        {isEditing && <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={isSubmitting}>İptal</button>}
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? '...' : 'Kaydet'}</button>
                    </form>
                </div>
            </div>
            <div className="glass-card fade-in-bottom" style={{ marginTop: '2rem' }}>
                <h3>Mevcut Projeler</h3>
                <div className="projects-list-container">{projects.map(p => (<div key={p.firestoreId} className="project-list-item"><img src={p.imageUrl || 'https://placehold.co/100x60?text=Resim+Yok'} alt="" className="project-list-thumbnail" /><div className="project-list-info"><p>{p.title}</p></div><div className="project-list-actions"><button onClick={() => handleEdit(p)} className="action-btn edit-btn">Düzenle</button><button onClick={() => handleDelete(p.firestoreId)} className="action-btn delete-btn">Sil</button></div></div>))}</div>
            </div>
        </>
    );
}

// ================== 3. YETENEKLER YÖNETİCİSİ ==================
const SkillsManager = () => {
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({ name: '', percent: 50 });
    const [loading, setLoading] = useState(false);

    const fetchSkills = async () => {
        try {
            const q = query(collection(db, "skills"), orderBy("percent", "desc"));
            const snap = await getDocs(q);
            setSkills(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch(e) { console.error("Yetenek hatası:", e); }
    };
    useEffect(() => { fetchSkills(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if(!formData.name) return toast.error("Yetenek adı gerekli");
        setLoading(true);
        try {
            await addDoc(collection(db, "skills"), { name: formData.name, percent: Number(formData.percent) });
            toast.success("Yetenek eklendi!");
            setFormData({ name: '', percent: 50 });
            fetchSkills();
        } catch (error) { toast.error("Hata oluştu."); } finally { setLoading(false); }
    };

    // YENİ: TOAST İLE SİLME
    const handleDelete = (id) => {
        confirmDeleteToast(async () => {
            try { await deleteDoc(doc(db, "skills", id)); toast.success("Yetenek silindi."); fetchSkills(); } 
            catch { toast.error("Silinemedi."); }
        });
    };

    return (
        <div className="glass-card fade-in-bottom">
            <h3>Yetenek Yönetimi</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form-grid" style={{gridTemplateColumns:'1fr'}}>
                        <div className="form-group form-group-full"><label>Yetenek Adı</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Örn: React" required /></div>
                        <div className="form-group form-group-full"><label>Seviye (%{formData.percent})</label><input type="range" min="0" max="100" value={formData.percent} onChange={(e) => setFormData({...formData, percent: e.target.value})} style={{width:'100%', marginTop:'10px'}} /></div>
                        <button type="submit" className="submit-btn" disabled={loading}>{loading ? '...' : 'Ekle'}</button>
                    </form>
                </div>
                <div className="skills-list" style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'400px', overflowY:'auto'}}>
                    {skills.length === 0 && <p style={{color:'#666'}}>Henüz yetenek yok.</p>}
                    {skills.map(s => (
                        <div key={s.id} style={{background:'rgba(0,0,0,0.3)', padding:'15px', borderRadius:'12px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid rgba(255,255,255,0.05)'}}>
                            <div style={{flex:1, marginRight:'15px'}}>
                                <div style={{color:'#fff', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>{s.name} <span style={{color:'#66fcf1'}}>{s.percent}%</span></div>
                                <div style={{height:'6px', background:'#333', borderRadius:'3px', marginTop:'8px', overflow:'hidden'}}><div style={{width:`${s.percent}%`, height:'100%', background:'linear-gradient(90deg, #66fcf1, #45a29e)'}}></div></div>
                            </div>
                            <button onClick={() => handleDelete(s.id)} className="delete-message-btn"><RiDeleteBin6Line/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ================== 4. MESAJLAR ==================
const MessagesViewer = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchMessages = async () => {
        setLoading(true);
        try { const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc')); const s = await getDocs(q); setMessages(s.docs.map(d => ({ ...d.data(), id: d.id }))); } 
        catch { toast.error('Mesajlar çekilemedi.'); } finally { setLoading(false); }
    };
    useEffect(() => { fetchMessages(); }, []);
    
    // YENİ: TOAST İLE SİLME
    const handleDeleteMessage = (id) => { 
        confirmDeleteToast(async () => {
            await deleteDoc(doc(db, 'messages', id)); toast.success('Mesaj silindi!'); fetchMessages(); 
        });
    };
    
    const csvData = messages.map(msg => ({ ...msg, createdAt: msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : '' }));
    if (loading) return <p>Yükleniyor...</p>;
    return (
        <div className="glass-card fade-in-bottom">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3>Mesajlar</h3>{messages.length > 0 && <CSVLink data={csvData} filename={"mesajlar.csv"} className="action-btn edit-btn" target="_blank">Excel İndir</CSVLink>}</div>
            <div className="messages-list">{messages.length === 0 ? <p>Mesaj yok.</p> : messages.map(msg => (<div key={msg.id} className="message-card"><div className="message-header"><div className="message-sender"><strong>{msg.name}</strong> <small>({msg.email})</small></div><button className="delete-message-btn" onClick={() => handleDeleteMessage(msg.id)}><RiDeleteBin6Line /></button></div><p className="message-body">{msg.message}</p><small style={{color:'#666'}}>{msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : ''}</small></div>))}</div>
        </div>
    );
};

// ================== 5. BLOG YÖNETİMİ ==================
const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', imageUrl: '', published: true });
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchPosts = async () => { 
        try { const q = query(collection(db, "posts"), orderBy("createdAt", "desc")); const s = await getDocs(q); setPosts(s.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }))); } catch (e) { console.error(e); }
    };
    useEffect(() => { fetchPosts(); }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true);
        let finalImageUrl = formData.imageUrl;
        if (imageUpload) {
            const body = new FormData(); body.set('key', 'aeac59f4ca41eeeec5c2029f9fd5d018'); body.append('image', imageUpload);
            try { const res = await axios.post('https://api.imgbb.com/1/upload', body); finalImageUrl = res.data.data.url; } catch { toast.error("Resim hatası"); setIsSubmitting(false); return; }
        }
        const postData = { ...formData, imageUrl: finalImageUrl || '', slug: formData.title.toLowerCase().replace(/ /g, '-') };
        try { if (isEditing) await updateDoc(doc(db, 'posts', isEditing), { ...postData, updatedAt: serverTimestamp() }); else await addDoc(collection(db, 'posts'), { ...postData, createdAt: serverTimestamp() }); toast.success("İşlem tamam!"); fetchPosts(); setIsEditing(null); setFormData({ title: '', slug: '', excerpt: '', content: '', imageUrl: '', published: true }); } catch { toast.error("Hata!"); } finally { setIsSubmitting(false); }
    };
    
    // YENİ: TOAST İLE SİLME
    const handleDelete = (id) => { 
        confirmDeleteToast(async () => {
            await deleteDoc(doc(db, 'posts', id)); toast.success("Yazı silindi."); fetchPosts(); 
        });
    };
    
    return (
        <><div className="glass-card fade-in-bottom"><h3>{isEditing ? 'Düzenle' : 'Yeni Yazı'}</h3><div className="admin-form-container"><form onSubmit={handleSubmit} className="admin-form-grid"><div className="form-group"><label>Başlık</label><input value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} required /></div><div className="form-group form-group-full"><label>İçerik</label><textarea value={formData.content} onChange={(e)=>setFormData({...formData, content:e.target.value})} rows="5"></textarea></div><div className="form-group"><label>Görsel</label><input type="file" onChange={(e)=>setImageUpload(e.target.files[0])} /></div><div className="form-group"><label>Yayınla <input type="checkbox" checked={formData.published} onChange={(e)=>setFormData({...formData, published:e.target.checked})} /></label></div><button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? '...' : 'Kaydet'}</button></form></div></div><div className="glass-card" style={{marginTop:'2rem'}}><h3>Yazılar</h3><div className="projects-list-container">{posts.map(p=>(<div key={p.firestoreId} className="project-list-item"><p>{p.title}</p><div className="project-list-actions"><button onClick={()=>{setIsEditing(p.firestoreId);setFormData(p)}} className="action-btn edit-btn">Düzenle</button><button onClick={()=>handleDelete(p.firestoreId)} className="action-btn delete-btn">Sil</button></div></div>))}</div></div></>
    );
};

// ================== 6. HAKKIMDA ==================
const AboutMeEditor = () => {
    const [formData, setFormData] = useState({ bio: '', profileImageUrl: '', cvUrl: '' });
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { 
        const f = async () => { 
            try { 
                const d = await getDoc(doc(db, 'siteContent', 'aboutMe')); 
                if (d.exists()) {
                    const data = d.data();
                    setFormData({ ...data, cvUrl: data.cvUrl || '' }); 
                } 
            } catch (e) { console.error(e); } 
        }; 
        f(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true);
        let finalImageUrl = formData.profileImageUrl;
        if (imageUpload) {
            const body = new FormData(); body.set('key', 'aeac59f4ca41eeeec5c2029f9fd5d018'); body.append('image', imageUpload);
            try { const res = await axios.post('https://api.imgbb.com/1/upload', body); finalImageUrl = res.data.data.url; } catch { toast.error("Resim hatası"); setIsSubmitting(false); return; }
        }
        try { 
            await setDoc(doc(db, 'siteContent', 'aboutMe'), { 
                bio: formData.bio, 
                profileImageUrl: finalImageUrl,
                cvUrl: formData.cvUrl 
            }, { merge: true }); 
            toast.success("Profil ve CV kaydedildi!"); 
        } catch { toast.error("Hata!"); } finally { setIsSubmitting(false); }
    };

    return (
        <div className="glass-card fade-in-bottom">
            <h3>Hakkımda Düzenle</h3>
            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form-grid" style={{gridTemplateColumns:'1fr'}}>
                    <div className="form-group form-group-full"><label>Biyografi</label><textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="6"></textarea></div>
                    <div className="form-group form-group-full"><label>CV Linki (PDF)</label><input type="text" placeholder="Drive linki" value={formData.cvUrl} onChange={(e) => setFormData({...formData, cvUrl: e.target.value})} /><p className="helper-text">Drive linkini 'herkese açık' yapmayı unutma.</p></div>
                    <div className="form-group form-group-full"><label>Fotoğraf</label><input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />{formData.profileImageUrl && <img src={formData.profileImageUrl} width="100" style={{marginTop:10, borderRadius:50}} alt=""/>}</div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>Kaydet</button>
                </form>
            </div>
        </div>
    );
};

// ================== 7. AYARLAR ==================
const SettingsManager = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => { if(auth.currentUser) setEmail(auth.currentUser.email); }, []);
    const handleUpdateProfile = async (e) => {
        e.preventDefault(); if(!currentPassword) return toast.error("Mevcut şifre gerekli.");
        setLoading(true);
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
            if (email !== user.email) { await verifyBeforeUpdateEmail(user, email); toast.success("Email doğrulama linki gönderildi."); }
            if (password) { await updatePassword(user, password); toast.success("Şifre güncellendi."); }
            setCurrentPassword(''); setPassword('');
        } catch(e) { toast.error("Hata: " + e.code); } finally { setLoading(false); }
    };
    return (
        <div className="glass-card fade-in-bottom"><h3>Ayarlar</h3><div className="admin-form-container" style={{maxWidth:'500px'}}><form onSubmit={handleUpdateProfile} className="admin-form-grid" style={{gridTemplateColumns:'1fr'}}><div className="form-group form-group-full"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="form-group form-group-full"><label>Yeni Şifre</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div><div className="form-group form-group-full"><label style={{color:'#ff4757'}}>Mevcut Şifre</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div><button type="submit" className="submit-btn" disabled={loading}>Kaydet</button></form></div></div>
    );
};

// ================== ANA ADMIN SAYFASI ==================
function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const handleLogout = async () => { await signOut(auth); navigate('/login'); };

    return (
        <div className="admin-page-wrapper">
            <Toaster position="top-right" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <h2>Admin Paneli</h2>
                <div>
                    <Link to="/" className="submit-btn" style={{ backgroundColor: '#2980b9', marginRight: '1rem', border:'1px solid #2980b9' }}>Siteye Dön</Link>
                    <button onClick={handleLogout} className="submit-btn" style={{ backgroundColor: '#c0392b', border:'1px solid #c0392b', color:'#fff' }}>Çıkış</button>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><RiDashboardLine style={{marginBottom:-2, marginRight:5}}/> Genel</button>
                <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}><RiFileCodeLine style={{marginBottom:-2, marginRight:5}}/> Projeler</button>
                <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}><RiCpuLine style={{marginBottom:-2, marginRight:5}}/> Yetenekler</button>
                <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}><RiMessage2Line style={{marginBottom:-2, marginRight:5}}/> Mesajlar</button>
                <button className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}><RiArticleLine style={{marginBottom:-2, marginRight:5}}/> Blog</button>
                <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}><RiUserStarLine style={{marginBottom:-2, marginRight:5}}/> Hakkımda</button>
                <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><RiSettings3Line style={{marginBottom:-2, marginRight:5}}/> Ayarlar</button>
            </div>

            <div>
                {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                {activeTab === 'projects' && <ProjectsManager />}
                {activeTab === 'skills' && <SkillsManager />}
                {activeTab === 'messages' && <MessagesViewer />}
                {activeTab === 'about' && <AboutMeEditor />}
                {activeTab === 'blog' && <BlogManager />}
                {activeTab === 'settings' && <SettingsManager />}
            </div>
        </div>
    );
}

export default AdminPage;