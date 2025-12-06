const fs = require('fs/promises');
const puppeteer = require('puppeteer');
const { getVibrantColor } = require('./colorExtractor');
const { darkenHexColor } = require('../utils/color');

const generateImage = async (playlistData) => {
  let templateHtml = await fs.readFile('./templates/playlist.html', 'utf8');

  const playlistCoverUrl = playlistData.images[0]?.url || '';
  let vibrantColor = await getVibrantColor(playlistCoverUrl);
  
  // Prepara as faixas
  const tracks = playlistData.tracks.items
    .slice(0, 32)
    .map(item => {
      const track = item.track;
      if (!track) return null;
      return {
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        cover: track.album.images[0]?.url || ''
      };
    })
    .filter(Boolean);

  const total = tracks.length;
  const col1Limit = Math.ceil(total / 2);
  const col1Tracks = tracks.slice(0, col1Limit);
  const col2Tracks = tracks.slice(col1Limit);

  const renderTracks = (arr) =>
    arr
      .map(
        (t) => `<div class="track-item">
  <img src="${t.cover}" alt="${t.title}">
  <div class="track-info">
      <div class="track-title">${t.title}</div>
      <div class="track-artist">${t.artist}</div>
  </div>
</div>`
      )
      .join('');

  const profileBuffer = await fs.readFile('./assets/profile.png');
  const profileBase64 = `data:image/png;base64,${profileBuffer.toString('base64')}`;

  templateHtml = templateHtml
    .replace('{{playlistName}}', playlistData.name)
    .replace('{{playlistOwner}}', playlistData.owner.display_name)
    .replace('{{playlistCoverUrl}}', playlistCoverUrl)
    .replace('{{col1}}', renderTracks(col1Tracks))
    .replace('{{col2}}', renderTracks(col2Tracks))
    .replace('<img id="profileImg" src=""/>', `<img id="profileImg" src="${profileBase64}"/>`)
    .replace(
      '<body style="background-color: #121212;">',
      `<body style="background-color: ${darkenHexColor(vibrantColor, 0.55)};">`
    )
    .replace(
      '<div id="card-container" style="background-color: #282828;">',
      // `<div id="card-container" style="background-image: linear-gradient(to bottom, ${vibrantColor} 0%, ${darkenHexColor(vibrantColor, 0.4)} 35%, ${darkenHexColor(vibrantColor, 0.5)} 65%, ${darkenHexColor(vibrantColor, 0.7)} 100%);">`
      `<div id="card-container" style="background-image: linear-gradient(to bottom, ${vibrantColor} 0%, ${darkenHexColor(vibrantColor, 0.3)} 35%, ${darkenHexColor(vibrantColor, 0.5)} 100%);">`
    );

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 2160, height: 4680, deviceScaleFactor: 1 });
  await page.setContent(templateHtml, { waitUntil: 'networkidle0' });

  const cardElement = await page.$('#card-container');
  const cardBuffer = await cardElement.screenshot({ type: 'png' });
  const pageBuffer = await page.screenshot({ type: 'png', fullPage: true });

  await browser.close();

  return { cardBuffer, pageBuffer, vibrantColor, playlistName: playlistData.name };
};

module.exports = { generateImage };
