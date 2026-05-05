import React, { useEffect, useState } from 'react';
import { fetchPlaylist } from '../api';
import CardViewer from '../components/PlaylistCard/CardViewer';
import LoadingViewer from '../components/PlaylistCard/LoadingViewer';

export default function PlaylistPage({ playlistId }) {
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylist(playlistId)
      .then(data => setPlaylist(data))
      .catch(err => setError(err.message));
  }, [playlistId]);

  if (error) return <div>Erro: {error}</div>;
  if (!playlist) return <LoadingViewer/>;

  return (
    <CardViewer
      cardBase64={playlist.cardBase64}
      pageBase64={playlist.pageBase64}
      vibrantColor={playlist.vibrantColor}
      playlistName={playlist.playlistName}
    />
  );
}
