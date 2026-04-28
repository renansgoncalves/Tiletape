import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault(); // Evita que a página recarregue ao submeter o formulário
    
    if (!link.trim()) return;

    let playlistId = link.trim();

    // Se o utilizador colar o link completo, extraímos apenas o ID
    if (playlistId.includes('spotify.com/playlist/')) {
      // Divide o link onde diz 'playlist/' e pega na segunda parte, 
      // depois remove qualquer parâmetro que venha depois do '?' (como ?si=...)
      playlistId = playlistId.split('playlist/')[1].split('?')[0];
    }

    // Navega para a rota que já existia no seu projeto
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>Spotify Playlist Card</h1>
      <p style={{ marginBottom: '30px', color: '#b3b3b3' }}>Cole o link da sua playlist para gerar um card interativo.</p>
      
      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="https://open.spotify.com/playlist/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{
            padding: '12px 20px',
            width: '350px',
            borderRadius: '25px',
            border: 'none',
            outline: 'none',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          style={{
            padding: '12px 24px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#1DB954', // Verde Spotify
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Gerar Card
        </button>
      </form>
    </div>
  );
}

export default HomePage;