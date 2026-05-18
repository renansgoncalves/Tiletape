const fs = require('fs/promises');
const puppeteer = require('puppeteer');
const { getVibrantColor } = require('./colorExtractor');
const { darkenHexColor } = require('../utils/color');

// Singleton para a instância do navegador
let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--ignore-certificate-errors'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    });
  }
  return browserInstance;
}

const generateImage = async (playlistData) => {
  // Pega a instância reaproveitável
  const browser = await getBrowserInstance();
  
  // Abre APENAS uma nova página (aba) e não o Chromium inteiro
  const page = await browser.newPage();
  
  // O bloco try...finally garante que a página será fechada mesmo se a extração de dados falhar
  try {
    let templateHtml = await fs.readFile('./templates/playlist.html', 'utf8');

    const playlistCoverUrl = playlistData.images[0]?.url || '';
    
    // Agora recebemos o objeto completo de cores (A Paleta Inteira)
    const colorPalette = await getVibrantColor(playlistCoverUrl);
    
    // Define a cor principal utilizando a lógica matemática que afinamos (customThief)
    const vibrantColor = colorPalette.customThief;
    
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

    const totalTracksLength = tracks.length;
    const col1Limit = Math.ceil(totalTracksLength / 2);
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
        '<body style="background-color: transparent;">'
      )
      .replace(
        '<div id="card-container" style="background-color: #282828;">',
        `<div id="card-container" style="background-color: transparent">`
      );

    // Ajusta a página e injeta o conteúdo
    await page.setViewport({ width: 2160, height: 4680, deviceScaleFactor: 1 });
    await page.setContent(templateHtml, { waitUntil: 'load', timeout: 90000 });

    const cardElement = await page.$('#card-container');
    const cardBox = await cardElement.boundingBox();
    const cardBuffer = await cardElement.screenshot({ type: 'png', omitBackground: true });
    const pageBuffer = await page.screenshot({ type: 'png', fullPage: true, omitBackground: true });

    return { 
      cardBuffer, 
      pageBuffer, 
      cardBox,
      vibrantColor, // Mantém a cor principal para não quebrar rotas antigas
      colorPalette, // Exporta o cardápio inteiro de cores para o Frontend!
      playlistName: playlistData.name 
    };

  } finally {
    // Garante que APENAS a aba (page) será fechada, mantendo o navegador aberto
    await page.close();
  }
};

module.exports = { generateImage };