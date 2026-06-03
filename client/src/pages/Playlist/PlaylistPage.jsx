import React, { useEffect, useState } from 'react';
import { fetchPlaylist } from '../../api/api';
import CardViewer from '../../components/CardViewer/CardViewer';
import LoadingViewer from '../../components/LoadingViewer/LoadingViewer';

export default function PlaylistPage({ playlistId }) {
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylist(playlistId)
      .then(data => setPlaylist(data))
      .catch(err => setError(err.message));
  }, [playlistId]);

  if (error) return <div>Error: {error}</div>;
  
  if (!playlist) return <LoadingViewer />;

  return (
    <CardViewer
      cardBase64={playlist.cardBase64}
      pageBase64={playlist.pageBase64}
      cardBox={playlist.cardBox}
      vibrantColor={playlist.vibrantColor}
      colorPalette={playlist.colorPalette}
      playlistName={playlist.playlistName}
    />
  );
}