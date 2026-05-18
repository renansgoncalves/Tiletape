// A API usará a variável de ambiente se existir, ou o localhost como padrão
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchPlaylist(playlistId) {
  const res = await fetch(`${API_BASE_URL}/api/playlist/${playlistId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro ao buscar a playlist');
  }
    return res.json();
  // Deve retornar { cardBase64, vibrantColor, playlistName }
}