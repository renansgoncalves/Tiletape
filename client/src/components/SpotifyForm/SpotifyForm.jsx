import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotifyForm.css'
import cd from '../../assets/cd.webp';

export default function SpotifyForm() {
  const [playlistLink, setPlaylistLink] = useState('');
  const navigate = useNavigate();

  // Processa o envio do formulário e extrai o ID da playlist
  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (!playlistLink.trim()) return;

    let playlistId = playlistLink.trim();
    const matchId = playlistId.match(/playlist\/([a-zA-Z0-9]+)/);
    
    if (matchId && matchId[1]) {
      playlistId = matchId[1];
    }

    navigate(`/playlist/${playlistId}`);
  };

  return (
    <form onSubmit={handleGenerateSubmit} className="form">
      <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      
      <input
        type="text"
        placeholder="Cole o link da sua playlist do Spotify"
        value={playlistLink}
        onChange={(e) => setPlaylistLink(e.target.value)}
      />

      <button type="submit" className="cd-button" aria-label="Gerar card da playlist">
        <img src={cd} className="cd" alt="Spinning CD submit button" />
      </button>
    </form>
  );
}