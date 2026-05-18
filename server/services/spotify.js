const axios = require('axios');

let cachedToken = null;
let tokenExpirationTime = 0;

async function getSpotifyToken() {
  const currentTime = Date.now();
  
  if (cachedToken && currentTime < tokenExpirationTime) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    cachedToken = response.data.access_token;
    tokenExpirationTime = currentTime + (response.data.expires_in * 1000) - 60000;

    return cachedToken;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw new Error('Failed to authenticate with Spotify');
  }
}

module.exports = { getSpotifyToken };