import React, { useState, useEffect } from 'react';
import './HomePage.css';

import FloatingCards from '../../components/FloatingCards/FloatingCards';
import HeroBadge from '../../components/HeroBadge/HeroBadge';
import SpotifyForm from '../../components/SpotifyForm/SpotifyForm';
import StepsBar from '../../components/StepsBar/StepsBar';

import bg from '../../assets/background.webp';
import red from '../../assets/card1.webp';
import blue from '../../assets/card2.webp';
import pink from '../../assets/card3.webp';
import green from '../../assets/card4.webp';
import purple from '../../assets/card5.webp';
import darkBlue from '../../assets/card6.webp';
import darkRed from '../../assets/card7.webp';
import aqua from '../../assets/card8.webp';
import cd from '../../assets/cd.webp';

export default function HomePage() {
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  useEffect(() => {
    const imagesToPreload = [bg, red, blue, green, pink, purple, darkBlue, darkRed, aqua, cd];

    const preloadSingleImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = resolve;
        img.onerror = resolve;
      });
    };

    Promise.all(imagesToPreload.map(preloadSingleImage)).then(() => {
      setIsAssetsLoaded(true);
    });
  }, []);

  // Captura o movimento global do mouse na tela para o Parallax
  const handleGlobalMouseMove = (e) => {
    const xAxis = (e.clientX / window.innerWidth) - 0.5;
    const yAxis = (e.clientY / window.innerHeight) - 0.5;
    
    e.currentTarget.style.setProperty('--mouse-x', xAxis);
    e.currentTarget.style.setProperty('--mouse-y', yAxis);
  };

  return (
    <div 
      className={`container ${isAssetsLoaded ? 'loaded' : 'loading'}`}
      onMouseMove={handleGlobalMouseMove}
    >
      <img src={bg} className="background" alt="Galaxy background gradient" />

      {/* ISOLAMENTO DO CONTEXTO 3D */}
      <FloatingCards />

      <div className="hero">
        <HeroBadge />
        
        <h1 className="logo">tiletape<span>.</span></h1>
        <h2 className="headline">
          Transforme sua playlist<br/>
          <a>em um <span>pôster icônico!</span></a>
        </h2>

        <SpotifyForm />
        <StepsBar />
      </div>
    </div>
  );
}