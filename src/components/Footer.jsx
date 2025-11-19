// src/components/Footer.jsx

import React from 'react';
import './Footer.css';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'; // İkonları import et

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-floating">
      <div className="footer-glass">
        
        {/* Sol Taraf: Telif Hakkı */}
        <span className="copyright-text">
          &copy; {currentYear} Muhammetjan
        </span>

        {/* Ayırıcı Çizgi */}
        <div className="footer-divider"></div>

        {/* Sağ Taraf: Sosyal İkonlar */}
        <div className="footer-socials">
          <a 
            href="https://github.com/muhammetjan625" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a 
            href="https://www.instagram.com/muhammetjan_m?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.linkedin.com/in/muhammetjan-mustakov-a39121231/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;