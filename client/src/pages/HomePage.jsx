import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Nunito:wght@400;600&display=swap" rel="stylesheet" />

import card1 from '../assets/card1.png';
import card2 from '../assets/card2.png';
import card3 from '../assets/card3.png';
import card4 from '../assets/card4.png';
import cd from '../assets/cd.png';

function HomePage() {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!link.trim()) return;

    let playlistId = link.trim();

    if (playlistId.includes('spotify.com/playlist/')) {
      playlistId = playlistId.split('playlist/')[1].split('?')[0];
    }

    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div className="container">
      <div className='gradient'/>
      
      {/* CARDS ESQUERDA */}
      <img src={card1} className="card card-left-1" />
      <img src={card2} className="card card-left-2" />

      {/* CARDS DIREITA */}
      <img src={card3} className="card card-right-1" />
      <img src={card4} className="card card-right-2" />

      {/* CONTEÚDO CENTRAL */}
      <div className="content">
        <h1>surasic</h1>

        <p>Cole o link da playlist para gerar um card interativo</p>

        <form onSubmit={handleGenerate} className="form">
          <input
            type="text"
            placeholder="https://open.spotify.com/playlist/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <button type="submit" className="cd-button">
            <img src={cd} className="cd" alt="cd" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;