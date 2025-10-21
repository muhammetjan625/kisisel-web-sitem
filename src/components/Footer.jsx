// src/components/Footer.jsx

import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer glass-card">
      <div className="footer-content">
        {/* Telif hakkı satırını standart formata getiriyoruz */}
        <p>&copy; {currentYear} Muhammetjan. Tüm Hakları Saklıdır.</p>
        
        <div className="social-links">
          {/* Eklediğin güncel linkleri koruyoruz */}
          <a href="https://github.com/muhammetjan625" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.instagram.com/muhammetjan_m?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/in/muhammetjan-mustakov-a39121231/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;