const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateImage } = require('../services/imageGenerator');
const { getSpotifyToken } = require('../services/spotify');

router.get('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const token = await getSpotifyToken();

    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('\x1b[1;34m%s\x1b[0m', `\nVez da playlist ${playlistResponse.data.name}.\n`);

    const { cardBuffer, pageBuffer, vibrantColor, playlistName } = await generateImage(playlistResponse.data);

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