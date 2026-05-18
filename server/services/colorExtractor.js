const { Vibrant } = require('node-vibrant/node');
const ColorThief = require('colorthief');
const axios = require('axios');

const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

// Função para converter Hexadecimal de volta para RGB
const hexToRgb = (hex) => {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

// Função para converter RGB para HSL
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

// Central de processamento e LOG de todas as cores
const enhanceColorForUI = (hexString, colorLabel) => {
  if (!hexString) {
    console.log(`\n[${colorLabel}] No color extracted from image.`);
    return null;
  }

  const [r, g, b] = hexToRgb(hexString);
  let [h, s, l] = rgbToHsl(r, g, b);

  console.log(`\n--- Processing [${colorLabel}] ---`);
  console.log(`Original -> H: ${h.toFixed(0)}, S: ${(s * 100).toFixed(0)}%, L: ${(l * 100).toFixed(0)}%`);

  // Ajustes de Matiz (Hue) para corrigir tons marrons
  //if (h >= 10 && h <= 30) { 
  //  console.log(`Hue adjusted from ${h.toFixed(0)} to 10 (Neutralizing brown to red).`);
  //  h = 10;
  //} else if (h > 30 && h <= 50) { 
  //  console.log(`Hue adjusted from ${h.toFixed(0)} to 50 (Neutralizing brown to green).`);
  //  h = 50;
  //}

  // A REGRA DE OURO PARA O DEGRADÊ INTEIRO: Preserva a saturação, mas segura a luz em 35%
  // Transforma cores "Flashbang" em "Tons de Joia" (Cores profundas e ricas)
  if (s >= 0.8 && l > 0.35) {
    console.log(`High saturation and brightness detected! Saturation kept at ${(s * 100).toFixed(0)}%.`);
    console.log(`Lightness adjusted from ${(l * 100).toFixed(0)}% to 35% for full-card white text readability.`);
    l = 0.35;
  } else {
    // Pipeline Padrão para cores normais ou opacas
    const satHalfDif = (0.7 - s) / 2;

    // Ajustes de Saturação (Saturation)
    if (s < 0.5 && l < 0.75) { 
      console.log(`Saturation boosted from ${(s * 100).toFixed(0)}% to ${((s + satHalfDif) * 100).toFixed(0)}%.`);
      s += satHalfDif;
    } else if (s > 0.7 && l < 0.75) { 
      console.log(`Saturation capped from ${(s * 100).toFixed(0)}% to 70%.`);
      s = 0.7;
    }

    // Ajustes de Luminosidade (Lightness)
    if (s <= 0.5) { 
      console.log(`Lightness adjusted from ${(l * 100).toFixed(0)}% to 40% (Pastel tone handling).`);
      l = 0.4;
    } else {
      console.log(`Lightness adjusted from ${(l * 100).toFixed(0)}% to 30% (Standard dark mode).`);
      l = 0.3;
    }
  }

  console.log(`Final    -> H: ${h.toFixed(0)}, S: ${(s * 100).toFixed(0)}%, L: ${(l * 100).toFixed(0)}%`);

  return rgbToHex(...hslToRgb(h, s, l));
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
    
    // A saturação das cores deve ser maior do que 40%
    if (!colorsForLog.some(c => Math.abs(rgbToHsl(...c)[0] - h) < 10) && s >= 0.4) { 
      colorsForLog.push(rgb);
    }
    if (colorsForLog.length >= 10) break;
  }

  return { colorsForLog };
};

const getVibrantColor = async (imageUrl, fallback = '#121212') => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
    });
    
    const buffer = Buffer.from(response.data);
    let colorThiefProcessed = null;

    try {
      const palette = await ColorThief.getPalette(buffer, 1000);
      const colorsForLog = [];                
      for (const rgb of palette) {            
        const [r, g, b] = rgb;
        const [h, s, l] = rgbToHsl(...rgb);
        if (!colorsForLog.some(c => Math.abs(rgbToHsl(...c)[0] - h) < 10) && s >= 0.4) { 
          colorsForLog.push(rgb);
        }
        if (colorsForLog.length >= 10) break;
      }
      
      if (colorsForLog.length > 0) {
        const firstColorHex = rgbToHex(...colorsForLog[0]);
        colorThiefProcessed = enhanceColorForUI(firstColorHex, 'Custom Thief');
      }
    } catch (ctErr) {
      console.log('[!] ColorThief falhou no servidor. Pulando etapa...', ctErr.message);
    }

    console.log('\nExtracting extra palette options using node-vibrant:');
    
    const vibrantPalette = await Vibrant.from(buffer).getPalette();

    return {
      customThief: colorThiefProcessed || enhanceColorForUI(vibrantPalette.Vibrant?.hex, 'Fallback Thief') || fallback,
      vibrant: enhanceColorForUI(vibrantPalette.Vibrant?.hex, 'Vibrant') || fallback,
      darkVibrant: enhanceColorForUI(vibrantPalette.DarkVibrant?.hex, 'Dark Vibrant') || fallback,
      lightVibrant: enhanceColorForUI(vibrantPalette.LightVibrant?.hex, 'Light Vibrant') || fallback,
      muted: enhanceColorForUI(vibrantPalette.Muted?.hex, 'Muted') || fallback,
    };

  } catch (err) {
    console.error('Error during cover color extraction:', err.message);
    return {
      customThief: fallback,
      vibrant: fallback,
      darkVibrant: fallback,
      lightVibrant: fallback,
      muted: fallback
    };
  }
};

module.exports = { getVibrantColor };