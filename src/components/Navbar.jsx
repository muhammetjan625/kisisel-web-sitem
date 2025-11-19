import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sayfa kaydırıldığında navbar'ın görünümünü değiştirmek için
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar-floating ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-glass">
        
        {/* Marka / Logo */}
        <div className="navbar-brand">
          <Link to="/" onClick={handleLinkClick}>
            M<span className="highlight">.</span>Mustakov
          </Link>
        </div>

        {/* Hamburger Buton */}
        <button 
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menüyü Aç/Kapat"
        >
          <div className="bar bar-1"></div>
          <div className="bar bar-2"></div>
          <div className="bar bar-3"></div>
        </button>

        {/* Açılır Menü (Dropdown Card) */}
        <ul className={`nav-dropdown-card ${menuOpen ? 'visible' : ''}`}>
          <li><Link to="/" onClick={handleLinkClick}>Ana Sayfa</Link></li>
          
          {/* YENİ EKLENEN LİNK */}
          <li><Link to="/projects" onClick={handleLinkClick}>Projeler</Link></li>
          
          <li><Link to="/case-studies" onClick={handleLinkClick}>Vaka Analizleri</Link></li>
          <li><Link to="/blog" onClick={handleLinkClick}>Blog</Link></li>
          <li><Link to="/hakkimda" onClick={handleLinkClick}>Hakkımda</Link></li>
          <li><Link to="/iletisim" onClick={handleLinkClick}>İletişim</Link></li>
        </ul>
        
      </div>
    </nav>
  );
}

export default Navbar;