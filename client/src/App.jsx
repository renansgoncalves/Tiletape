import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import PlaylistPage from './pages/PlaylistPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rota original para exibir o card da playlist */}
        <Route path="/playlist/:playlistId" element={<PlaylistPageWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper para extrair o playlistId da URL
function PlaylistPageWrapper() {
  const { playlistId } = useParams();
  return <PlaylistPage playlistId={playlistId} />;
}

export default App;