import React, { useRef, useState, useEffect } from 'react';
import './CardViewer.css';
import { darkenHexColor } from '../../utils/color';

// Componente principal que exibe o card da playlist
export default function CardViewer({ cardBase64, pageBase64, vibrantColor, playlistName }) {
  const cardRef = useRef(null);
  const shineIntervalRef = useRef(null);

  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [cardTransform, setCardTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [cardHeight, setCardHeight] = useState(0);

  // Atualiza variável CSS global + cleanup
  useEffect(() => {
    document.documentElement.style.setProperty('--vibrant-color', vibrantColor);

    return () => {
      if (shineIntervalRef.current) {
        clearInterval(shineIntervalRef.current);
        shineIntervalRef.current = null;
      }
    };
  }, [vibrantColor]);

  // Mouse move → efeito 3D + brilho
  const handleMouseMove = (e) => {
    if (!isHovering) setIsHovering(true);

    if (shineIntervalRef.current) {
      clearInterval(shineIntervalRef.current);
      shineIntervalRef.current = null;
    }

    const rect = cardRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 15;

    setCardTransform({ rotateX, rotateY });

    const targetX = 100 - (x / rect.width) * 100;
    const targetY = 100 - (y / rect.height) * 100;

    setShine(prev => ({
      x: prev.x + (targetX - prev.x) * 0.05,
      y: prev.y + (targetY - prev.y) * 0.05
    }));
  };

  // Mouse leave → reset suave
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCardTransform({ rotateX: 0, rotateY: 0 });

    if (shineIntervalRef.current) clearInterval(shineIntervalRef.current);

    shineIntervalRef.current = setInterval(() => {
      setShine(prev => {
        const dx = 50 - prev.x;
        const dy = 50 - prev.y;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          clearInterval(shineIntervalRef.current);
          shineIntervalRef.current = null;
          return { x: 50, y: 50 };
        }

        return {
          x: prev.x + dx * 0.01,
          y: prev.y + dy * 0.01
        };
      });
    }, 16);
  };

  // Download da imagem
  const downloadCard = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${pageBase64}`;
    link.download = `${playlistName}_pagina.png`;
    link.click();
  };

  // Render
  return (
    <div
      className="viewer-container"
      style={{
        backgroundColor: darkenHexColor(vibrantColor, 0.55),
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="card-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height: cardHeight }}
      >
        <div
          className="card"
          ref={cardRef}
          style={{
            '--shine-x': `${shine.x}%`,
            '--shine-y': `${shine.y}%`,
            '--shine-color': darkenHexColor(vibrantColor, -0.3),
            '--shine-opacity': isHovering ? 0.3 : 0.2,
            transform: `rotateX(${-cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg)`,
            transition: isHovering
              ? 'transform 0.3s ease-out'
              : 'transform 0.5s ease-in-out',
          }}
        >
          <img
            src={`data:image/png;base64,${cardBase64}`}
            alt={playlistName}
            onLoad={() => {
              if (cardRef.current) {
                setCardHeight(cardRef.current.offsetHeight);
              }
            }}
          />
        </div>
      </div>

      <button
        className="download-btn"
        onClick={downloadCard}
        aria-label={`Baixar card da playlist ${playlistName}`}
      >
        Baixar Card
      </button>
    </div>
  );
}