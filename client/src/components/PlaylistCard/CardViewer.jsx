import React, { useRef, useState, useEffect } from 'react';
import './CardViewer.css';
import { darkenHexColor } from '../../utils/color';

export default function CardViewer({ cardBase64, pageBase64, cardBox, vibrantColor, colorPalette, playlistName }) {
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const shinePos = useRef({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  
  const [activeColor, setActiveColor] = useState(vibrantColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--vibrant-color', activeColor);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeColor]);

  const updateCardStyle = (rotateX, rotateY, shineX, shineY, isHoveringState) => {
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      cardRef.current.style.setProperty('--shine-x', `${shineX}%`);
      cardRef.current.style.setProperty('--shine-y', `${shineY}%`);
      cardRef.current.style.setProperty('--shine-opacity', isHoveringState ? '0.3' : '0.2');
      cardRef.current.style.transition = isHoveringState 
        ? 'transform 0.3s ease-out' 
        : 'transform 0.5s ease-in-out';
    }
  };

  const handleMouseMove = (e) => {
    if (!isHovering) setIsHovering(true);
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const rect = cardRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 15;

    const targetX = 100 - (x / rect.width) * 100;
    const targetY = 100 - (y / rect.height) * 100;

    shinePos.current.x += (targetX - shinePos.current.x) * 0.05;
    shinePos.current.y += (targetY - shinePos.current.y) * 0.05;

    animationFrameRef.current = requestAnimationFrame(() => {
      updateCardStyle(rotateX, rotateY, shinePos.current.x, shinePos.current.y, true);
    });
  };

  const handleTouchStart = () => {
    setIsHovering(true);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isHovering) setIsHovering(true);
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5; 
    const rotateY = ((x - centerX) / centerX) * 8;

    const targetX = 100 - (x / rect.width) * 100;
    const targetY = 100 - (y / rect.height) * 100;

    shinePos.current.x += (targetX - shinePos.current.x) * 0.1;
    shinePos.current.y += (targetY - shinePos.current.y) * 0.1;

    animationFrameRef.current = requestAnimationFrame(() => {
      updateCardStyle(rotateX, rotateY, shinePos.current.x, shinePos.current.y, true);
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const animateReset = () => {
      const dx = 50 - shinePos.current.x;
      const dy = 50 - shinePos.current.y;

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        shinePos.current = { x: 50, y: 50 };
        updateCardStyle(0, 0, 50, 50, false);
        return; 
      }

      shinePos.current.x += dx * 0.1;
      shinePos.current.y += dy * 0.1;

      updateCardStyle(0, 0, shinePos.current.x, shinePos.current.y, false);
      animationFrameRef.current = requestAnimationFrame(animateReset);
    };

    animationFrameRef.current = requestAnimationFrame(animateReset);
  };

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // CAMADA 1 (O Fundo do Story): Pinta a tela inteira com a cor sólida escura
      ctx.fillStyle = darkenHexColor(activeColor, 0.55);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // CAMADA 2 (O Fundo do Card): Pinta o degradê APENAS onde o card está!
      if (cardBox) {
        const gradient = ctx.createLinearGradient(0, cardBox.y, 0, cardBox.y + cardBox.height);
        gradient.addColorStop(0, activeColor);
        gradient.addColorStop(0.45, darkenHexColor(activeColor, 0.2));
        gradient.addColorStop(1, darkenHexColor(activeColor, 0.4));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Cria um molde do tamanho exato do card com arredondamento de 78px nas quinas
        ctx.roundRect(cardBox.x, cardBox.y, cardBox.width, cardBox.height, 78);
        ctx.fill();
      }
      
      // CAMADA 3 (O Carimbo): Joga a imagem transparente (textos, capas e sombra) por cima de tudo
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${playlistName}_tile.png`;
      link.click();
    };
    
    // Voltamos a puxar a imagem gigante da página inteira!
    img.src = `data:image/png;base64,${pageBase64}`;
  };

  const uniqueColors = colorPalette ? Array.from(new Set(Object.values(colorPalette))) : [];

  return (
    <div
      className="viewer-container"
      style={{
        backgroundColor: darkenHexColor(activeColor, 0.55),
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        transition: 'background-color 0.5s ease' 
      }}
    >
      <div
        className="card-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <div
          className="card-final"
          ref={cardRef}
          style={{
             '--shine-color': darkenHexColor(activeColor, -0.3),
             backgroundImage: `linear-gradient(to bottom, ${activeColor} 0%, ${darkenHexColor(activeColor, 0.2)} 45%, ${darkenHexColor(activeColor, 0.4)} 100%)`,
             borderRadius: '16px',
             // Removido o overflow: hidden para o botão poder vazar para os lados!
          }}
        >
          {/* Botão flutuante perfeitamente ancorado no topo esquerdo do card */}
          <button
            className="download-btn-floating"
            onClick={downloadCard}
            aria-label={`Download playlist card ${playlistName}`}
            title={`Baixar card de ${playlistName}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <img
            src={`data:image/png;base64,${cardBase64}`}
            alt={playlistName}
          />
        </div>
      </div>

      {uniqueColors.length > 1 && (
        <div className="palette-container">
          <div className="palette-swatches">
            {uniqueColors.map((hexValue, index) => (
              <button
                key={index}
                className={`color-swatch ${activeColor === hexValue ? 'active' : ''}`}
                style={{ backgroundColor: hexValue }}
                onClick={() => setActiveColor(hexValue)}
                aria-label={`Change background to color ${hexValue}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}