const API_BASE_URL = 'https://spotifyplaylist-9zmq.onrender.com';

export async function fetchPlaylist(playlistId) {
  const res = await fetch(`${API_BASE_URL}/api/playlist/${playlistId}`);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro ao buscar a playlist');
  }
  
  return res.json(); // Deve retornar { cardBase64, vibrantColor, playlistName }
}