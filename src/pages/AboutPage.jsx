// src/pages/AboutPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AboutPage.css';
import { FaReact, FaJsSquare, FaCss3Alt, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiFirebase } from 'react-icons/si';

const skills = [
  { name: 'React', icon: <FaReact color="#61DAFB" /> },
  { name: 'JavaScript', icon: <FaJsSquare color="#F7DF1E" /> },
  { name: 'CSS3', icon: <FaCss3Alt color="#1572B6" /> },
  { name: 'Node.js', icon: <FaNodeJs color="#339933" /> },
  { name: 'Firebase', icon: <SiFirebase color="#FFCA28" /> },
  { name: 'Git', icon: <FaGitAlt color="#F05032" /> },
];

function AboutPage() {
  const [aboutData, setAboutData] = useState({ bio: '', profileImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      // 'siteContent' koleksiyonundan 'aboutMe' dokümanını çekiyoruz
      const docRef = doc(db, 'siteContent', 'aboutMe');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAboutData(docSnap.data());
      } else {
        console.log("Hakkımda bilgisi bulunamadı!");
      }
      setLoading(false);
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="glass-card fade-in-bottom">
      <div className="about-layout">
        <div className="profile-picture-container">
          <img 
            src={aboutData.profileImageUrl || '/images/profile.jpg'} 
            alt="Profil Fotoğrafı" 
            className="profile-picture" 
          />
        </div>
        <div className="about-text-container">
          <h2>Hakkımda</h2>
          {/* Biyografi metnini Firestore'dan gelen veriyle değiştiriyoruz */}
          <p style={{whiteSpace: 'pre-wrap'}}>{aboutData.bio}</p>
          <Link to="/" className="cta-button">Projelerime Göz Atın</Link>
        </div>
      </div>
      <div className="skills-section">
        <h3>Yeteneklerim</h3>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-item">
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;