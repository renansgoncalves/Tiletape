require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use('/assets', express.static('assets'));

// Importa as rotas
const playlistRoutes = require('./routes/playlist');
app.use('/api/playlist', playlistRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}\n`);
});
