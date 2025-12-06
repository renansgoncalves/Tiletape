const { Vibrant } = require('node-vibrant/node');
const ColorThief = require('colorthief');
const axios = require('axios');


const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');


  const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
};


// Função para converter HSL de volta para RGB
const hslToRgb = (h, s, l) => {
  let r, g, b;
  h /= 360; // h deve estar na escala 0-1

  if (s === 0) {
    r = g = b = l; // Acromático
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};


const getColorfulColors = async (imageUrl) => {
  // Baixa imagem como buffer
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');

  // Captura até 1000 cores para ter variedade
  const palette = await ColorThief.getPalette(buffer, 1000);

  const colorsForLog = [];                // Contém as cores distintas
  for (const rgb of palette) {            // Percorre as 1000 cores capturadas
    const [r, g, b] = rgb;
    const [h, s, l] = rgbToHsl(...rgb);
    
    if (!colorsForLog.some(c => Math.abs(rgbToHsl(...c)[0] - h) < 10) && s > 0.1) {   // Captura as cores e usa hue e saturação como critérios para distingui-las
      colorsForLog.push(rgb);
    }
    if (colorsForLog.length >= 10) break;
  }

  return { colorsForLog };
};


const getVibrantColor = async (imageUrl, fallback = '#121212') => {
  try {
    const { colorsForLog } = await getColorfulColors(imageUrl);

    for (const rgb of colorsForLog) {   // Percorre as cores distintas capturadas
      const [r, g, b] = rgb;
      
      let [h, s, l] = rgbToHsl(...rgb);

      if (h >= 205 && h <= 250) {       // Verifica se há um tom de azul
        console.log(`Tom de azul encontrado:\nhue: ${h.toFixed(0)},\nsat: ${(s*100).toFixed(0)}%,\nlum: ${(l*100).toFixed(0)}%.\n`);
        
        // Trata a saturação do tom de azul encontrado
        if (s < 0.3) { s += 0.25; console.log(`Saturação  do azul ajustada para: ${(s*100).toFixed(0)}%.`); }

        // Trata a luminosidade do tom de azul encontrado
        if (l > 0.5) { difL50 = l-0.5; l -= difL50/2; }
        else         { difL50 = 0.5-l; l += difL50/2; }

        console.log(`Luminosidade do azul ajustada para: ${(l*100).toFixed(0)}%.\n`);

        // Retorna o tom de azul e encerra a função
        return rgbToHex(...hslToRgb(h, s, l));
      }
    }

    // Retorna cor capturada pelo "node-vibrant" caso um tom de azul não tenha sido encontrado
    console.log('Retornada cor extraída pelo node-vibrant.\n');
    const palette = await Vibrant.from(imageUrl).getPalette();
    return palette.Vibrant?.hex || fallback;
  } catch (err) {
    console.error('Erro ao extrair cor da capa:', err);
    return fallback;
  }
};

module.exports = { getVibrantColor };
