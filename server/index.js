const os = require('os');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

try {
  const username = os.userInfo().username.toLowerCase();
  if (username.includes('labsfiap')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('[!] Ambiente da faculdade detectado: Verificação de certificado TLS desativada.');
  }
} catch (err) {
  console.log('[-] Verificação de usuário ignorada (Ambiente de Produção/Linux).');
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use('/assets', express.static('assets'));

// Importa as rotas
const playlistRoutes = require('./routes/playlist');
app.use('/api/playlist', playlistRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}\n`);
});