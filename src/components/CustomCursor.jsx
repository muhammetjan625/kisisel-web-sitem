import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      // Tıklanabilir öğelerin üzerine gelince imleç büyüsün
      if (e.target.closest('a, button, input, textarea, .glass-card')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  // Arkadaki halkanın gecikmeli gelmesi için (Smooth Effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailingPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2, // 0.2 hızı belirler
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
    }, 16); // 60 FPS

    return () => clearInterval(interval);
  }, [position]);

  return (
    <>
      {/* Ana Nokta */}
      <div 
        className="cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Takip Eden Halka */}
      <div 
        className={`cursor-ring ${isHovering ? 'hovered' : ''}`}
        style={{ left: `${trailingPosition.x}px`, top: `${trailingPosition.y}px` }}
      />
    </>
  );
};

export default CustomCursor;