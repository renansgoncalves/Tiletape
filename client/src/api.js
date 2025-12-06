export async function fetchPlaylist(playlistId) {
  const res = await fetch(`http://localhost:3001/api/playlist/${playlistId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro ao buscar a playlist');
  }
  return res.json(); // Deve retornar { cardBase64, vibrantColor, playlistName }
}
