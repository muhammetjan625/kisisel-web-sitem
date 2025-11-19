import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bir linke tıklandığında veya markaya basıldığında menüyü kapat
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-brand">
        <Link to="/" onClick={handleLinkClick}>Muhammetjan Mustakov</Link>
      </div>

      {/* Hamburger Menü Butonu 
        - Artık menü açıkken (menuOpen) 'active' class'ı alıyor.
      */}
      <button 
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)} // State'i tersine çevir
        aria-label="Menü"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Link Listesi
        - 'active' class'ını alarak görünür hale geliyor.
      */}
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li onClick={handleLinkClick}><Link to="/">Ana Sayfa</Link></li>
        <li onClick={handleLinkClick}><Link to="/blog">Blog</Link></li>
        <li onClick={handleLinkClick}><Link to="/case-studies">Vaka Analizleri</Link></li>
        <li onClick={handleLinkClick}><Link to="/hakkimda">Hakkımda</Link></li>
        <li onClick={handleLinkClick}><Link to="/iletisim">İletişim</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;