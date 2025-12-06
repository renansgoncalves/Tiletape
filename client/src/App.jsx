import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlaylistPage from './pages/PlaylistPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/playlist/:playlistId" element={<PlaylistPageWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper para extrair o playlistId da URL
import { useParams } from 'react-router-dom';
function PlaylistPageWrapper() {
  const { playlistId } = useParams();
  return <PlaylistPage playlistId={playlistId} />;
}

export default App;
