const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateImage } = require('../services/imageGenerator');

const { getSpotifyToken, getUserProfileImage } = require('../services/spotify');

router.get('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const token = await getSpotifyToken();

    // Busca os dados da playlist na API do Spotify
    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('\x1b[1;34m%s\x1b[0m', `\nVez da playlist ${playlistResponse.data.name}.\n`);

    // Extrai o ID do dono da playlist e busca a foto dele
    const ownerId = playlistResponse.data.owner.id;
    const ownerImageUrl = await getUserProfileImage(ownerId, token);

    const { cardBuffer, pageBuffer, vibrantColor, playlistName } = await generateImage(
      playlistResponse.data, 
      ownerImageUrl
    );

    res.json({
      cardBase64: cardBuffer.toString('base64'),
      pageBase64: pageBuffer.toString('base64'),
      vibrantColor,
      playlistName
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Falha ao processar playlist.' });
  }
});

module.exports = router;