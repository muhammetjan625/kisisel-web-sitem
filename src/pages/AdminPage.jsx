// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import axios from 'axios';
import './AdminPage.css';

const initialFormState = {
    id: '', title: '', description: '', longDescription: '',
    technologies: '', imageUrl: '', liveUrl: '', repoUrl: ''
};

function AdminPage() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        const q = query(collection(db, "projects"), orderBy("id"));
        const querySnapshot = await getDocs(q);
        setProjects(querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id })));
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleLogout = async () => { await signOut(auth); navigate('/login'); };

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    
    const handleEdit = (project) => { setIsEditing(project.firestoreId); setFormData({ ...project, technologies: project.technologies.join(', ') }); setImageUpload(null); window.scrollTo(0, 0); };
    
    const cancelEdit = () => { setIsEditing(null); setFormData(initialFormState); setImageUpload(null); };

    const handleDelete = async (firestoreId) => {
        if (window.confirm("Bu projeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            try {
                await deleteDoc(doc(db, 'projects', firestoreId));
                alert('Proje başarıyla silindi!');
                fetchProjects();
            } catch (error) {
                console.error("Proje silinirken hata:", error);
                alert("Proje silinirken bir hata oluştu.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id || !formData.title) {
            alert("Lütfen Proje ID ve Başlık alanlarını doldurun.");
            return;
        }
        setIsSubmitting(true);
        let finalImageUrl = formData.imageUrl;

        if (imageUpload) {
            const IMGBB_API_KEY = 'aeac59f4ca41eeeec5c2029f9fd5d018'; // Senin API anahtarın
            const body = new FormData();
            body.set('key', IMGBB_API_KEY);
            body.append('image', imageUpload);
            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', body);
                finalImageUrl = response.data.data.url;
            } catch (error) {
                console.error("ImgBB Resim Yükleme Hatası:", error);
                alert("Resim yüklenemedi!");
                setIsSubmitting(false);
                return;
            }
        }
        
        const projectData = {
            id: Number(formData.id), title: formData.title, description: formData.description || '',
            longDescription: formData.longDescription || '', technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()) : [],
            imageUrl: finalImageUrl || '', liveUrl: formData.liveUrl || '', repoUrl: formData.repoUrl || ''
        };

        try {
            if (isEditing) {
                const projectRef = doc(db, 'projects', isEditing);
                await updateDoc(projectRef, projectData);
                alert('Proje başarıyla güncellendi!');
            } else {
                await addDoc(collection(db, 'projects'), projectData);
                alert('Proje başarıyla eklendi!');
            }
            fetchProjects();
            cancelEdit();
        } catch (error) {
            console.error("Firestore Yazma Hatası:", error);
            alert("Proje kaydedilirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fade-in-bottom">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <h2>Admin Paneli</h2>
                <div>
                    <Link to="/" className="submit-btn" style={{ backgroundColor: '#2980b9', marginRight: '1rem' }}>Siteyi Görüntüle</Link>
                    <button onClick={handleLogout} className="submit-btn" style={{backgroundColor: '#c0392b'}}>Çıkış Yap</button>
                </div>
            </div>

            <div className="glass-card">
                <h3>{isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form-grid">
                        <div className="form-group"><label htmlFor="id">Proje ID (Sıralama)</label><input id="id" name="id" value={formData.id} onChange={handleChange} type="number" required /></div>
                        <div className="form-group"><label htmlFor="title">Proje Başlığı</label><input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
                        <div className="form-group form-group-full"><label htmlFor="description">Kısa Açıklama (Kartlarda Görünecek)</label><input id="description" name="description" value={formData.description} onChange={handleChange} /></div>
                        <div className="form-group form-group-full"><label htmlFor="longDescription">Detaylı Açıklama</label><textarea id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleChange} rows="5"></textarea></div>
                        <div className="form-group form-group-full"><label htmlFor="technologies">Teknolojiler</label><input id="technologies" name="technologies" value={formData.technologies} onChange={handleChange} /><span className="helper-text">Virgülle ayırın (örn: React, CSS, Firebase)</span></div>
                        
                        <div className="form-group form-group-full">
                            <label htmlFor="imageFile">Proje Görseli Yükle</label>
                            <input type="file" id="imageFile" onChange={(event) => { setImageUpload(event.target.files[0]) }} />
                            {isEditing && formData.imageUrl && (
                                <div style={{marginTop: '1rem'}}><p>Mevcut Görsel:</p><img src={formData.imageUrl} alt="Önizleme" width="200" style={{borderRadius: '8px'}}/></div>
                            )}
                        </div>

                        <div className="form-group"><label htmlFor="liveUrl">Canlı Site URL</label><input id="liveUrl" name="liveUrl" value={formData.liveUrl} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="repoUrl">Kaynak Kodu URL</label><input id="repoUrl" name="repoUrl" value={formData.repoUrl} onChange={handleChange} /></div>
                        
                        {isEditing && <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={isSubmitting}>İptal Et</button>}
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Projeyi Güncelle' : 'Projeyi Ekle')}</button>
                    </form>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3>Mevcut Projeler</h3>
                <div className="projects-list-container">
                    {projects.map(p => (
                        <div key={p.firestoreId} className="project-list-item">
                            <p>{p.id} - {p.title}</p>
                            <div className="project-list-actions">
                                <button onClick={() => handleEdit(p)} className="action-btn edit-btn">Düzenle</button>
                                <button onClick={() => handleDelete(p.firestoreId)} className="action-btn delete-btn">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;