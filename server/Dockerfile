# Usa a imagem oficial do Puppeteer, que já vem com o Node.js e o Chromium instalados
FROM ghcr.io/puppeteer/puppeteer:latest

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependências (como o usuário pptruser, padrão da imagem)
COPY --chown=pptruser:pptruser package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia o restante do código do backend
COPY --chown=pptruser:pptruser . .

# Expõe a porta que o seu servidor Express utiliza
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "index.js"]