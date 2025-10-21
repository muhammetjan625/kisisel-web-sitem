// src/pages/AboutMeEditor.jsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

function AboutMeEditor() {
    const [formData, setFormData] = useState({ bio: '', profileImageUrl: '' });
    const [imageUpload, setImageUpload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAboutData = async () => {
            const docRef = doc(db, 'siteContent', 'aboutMe');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
            }
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
            const body = new FormData();
            body.set('key', IMGBB_API_KEY);
            body.append('image', imageUpload);
            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', body);
                finalImageUrl = response.data.data.url;
            } catch (error) {
                toast.error("Resim yüklenemedi!", { id: toastId });
                setIsSubmitting(false);
                return;
            }
        }
        
        try {
            const docRef = doc(db, 'siteContent', 'aboutMe');
            // setDoc ile dokümanı güncelliyoruz. merge:true eski verileri korur.
            await setDoc(docRef, { 
                bio: formData.bio, 
                profileImageUrl: finalImageUrl 
            }, { merge: true });
            toast.success("Bilgiler başarıyla güncellendi!", { id: toastId });
        } catch (error) {
            toast.error("Bir hata oluştu.", { id: toastId });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div className="glass-card">
            <h3>Hakkımda Sayfasını Düzenle</h3>
            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form-grid" style={{gridTemplateColumns: '1fr'}}>
                    <div className="form-group form-group-full">
                        <label htmlFor="bio">Biyografi Metni</label>
                        <textarea id="bio" rows="10" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
                    </div>
                    <div className="form-group form-group-full">
                        <label htmlFor="profileImage">Profil Fotoğrafı Yükle</label>
                        <input type="file" id="profileImage" onChange={(e) => setImageUpload(e.target.files[0])} />
                        {formData.profileImageUrl && (
                            <div style={{marginTop: '1rem'}}><p>Mevcut Fotoğraf:</p><img src={formData.profileImageUrl} alt="Profil Önizleme" width="150" style={{borderRadius: '50%'}}/></div>
                        )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AboutMeEditor;