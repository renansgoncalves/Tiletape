# tiletape.

Transforme sua playlist em um pôster icônico! Acesse a aplicação no ar aqui: https://tiletape.vercel.app/ 🔗

![Preview](client/src/assets/preview.png)

O **tiletape.** é uma aplicação full-stack construída para gerar cards visuais de alta qualidade a partir de playlists do Spotify. O sistema realiza a leitura da playlist, extrai ativamente uma paleta de cores baseada na capa e gera um pôster customizado pronto para download. A arquitetura é dividida de forma limpa entre uma aplicação frontend em React e uma API backend em Node.js.

## 💡 Funcionalidades

* **Transformação de links:** O usuário insere a URL da playlist do Spotify e a aplicação faz o resto.
* **Extração de cores:** A capa da playlist é baixada pelo sistema, que utiliza as bibliotecas `node-vibrant` e `colorthief` para gerar uma paleta de cores temática.
* **Ajuste automático de contraste:** A fim de evitar cores muito claras (flashbangs), foram implementadas lógicas que tratam as cores extraídas, garantindo legibilidade do texto branco no card gerado.
* **Geração de imagens (headless browser):** O backend injeta os dados da playlist em um template HTML (`playlist.html`) e utiliza o `puppeteer` para capturar e gerar um card em alta resolução.
* **Visualização 3D dinâmica:** No frontend, o card renderizado responde interativamente aos movimentos do mouse ou toque do usuário, criando um efeito visual de inclinação e brilho em 3D.
* **Download simples:** Com um único clique no botão de ação, o usuário consegue baixar a imagem gerada no formato `.png`.

## 🛠️ Tecnologias utilizadas

### Frontend
* **React & Vite:** Para a renderização de interface rápida e empacotamento.
* **React Router DOM:** Para gerenciar a navegação entre a `HomePage` e a `PlaylistPage`.
* **CSS:** Estilização modularizada em arquivos como `CardViewer.css` e `HomePage.css`, incluindo cálculos de variáveis CSS dinâmicas para animações de rotação e luz.

### Backend
* **Node.js & Express:** Configuração de rotas de API e servidor rodando na porta 3001.
* **Puppeteer:** Ferramenta central para simular a página do layout do poster e realizar os screenshots.
* **Autenticação Spotify:** Integração via protocolo Client Credentials para obtenção de Token na API do Spotify.
* **Node-Vibrant e ColorThief:** Usados no serviço `colorExtractor.js` para analisar o Buffer da imagem e obter os códigos hexadecimais dominantes.

## 📁 Estrutura do projeto

Abaixo está o detalhamento dos principais diretórios do repositório:

```text
└── ./
    ├── client/                # Aplicação Frontend
    │   ├── src/
    │   │   ├── components/    # Componentes reutilizáveis (CardViewer, LoadingViewer)
    │   │   ├── pages/         # Páginas principais (HomePage, PlaylistPage)
    │   │   └── utils/         # Funções utilitárias como escurecimento de cores
    │   └── vite.config.js     # Configuração de proxy do Vite
    │
    └── server/                # API Backend
        ├── routes/            # Definição das rotas (playlist.js, download.js)
        ├── services/          # Lógica de negócio (spotify, imageGenerator, colorExtractor)
        ├── templates/         # Molde HTML do card para o Puppeteer (playlist.html)
        └── index.js           # Ponto de entrada do servidor Express
```

## 🚀 Para execução local

Para a aplicação funcionar adequadamente, você precisará do Node.js (v18+) e de credenciais de desenvolvedor da API do Spotify.

Para configurar suas credenciais do Spotify Developers, você deve criar um arquivo `.env` dentro da pasta `server/` contendo o seguinte:

```
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
PORT=3001
```

Feito isso, basta instalar e rodar os serviços seguindo este simples passo a passo:

1. Abra o terminal na pasta `server/` para iniciar a API:

```
cd server
npm install
npm start
```

2. Em outro terminal, na pasta `client/`, inicie a interface do Frontend:

```
cd client
npm install
npm run dev
```

3. Acesse `http://localhost:5173` no navegador para visualizar o projeto rodando localmente.

## 🌐 Deploy

A arquitetura do projeto já está preparada para ambientes de produção modernos, contando com **Vercel** para hospedagem do Frontend, e **Render/Docker** para hospedagem do Backend.