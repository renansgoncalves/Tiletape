require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Spotify CLIENT_ID ou CLIENT_SECRET não definidos no .env');
}

// Retorna token de acesso do Spotify
const getSpotifyToken = async () => {
  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authString}`
    },
    data: 'grant_type=client_credentials'
  });

  return response.data.access_token;
};

module.exports = { getSpotifyToken };
