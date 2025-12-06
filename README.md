## 🎵 Spotify Playlist Project

This project is a full-stack application designed to transform Spotify playlists into aesthetically pleasing, comprehensive, and shareable visual "cards". The application consumes data from the Spotify API, analyzes the playlist cover's color palette, and generates a server-side pre-rendered card, which is displayed on the frontend with advanced interactivity.

### 🚀 Data Flow Overview

The journey from a simple URL to a 3D interactive card follows a rigorous and optimized flow. Once a user provides a valid Spotify playlist URL, the application begins the process:

* **Spotify Integration:** Retrieval of playlist metadata (name, creator) and tracklist details (album art, title, artist).
* **Dynamic Color Algorithm:** Utilizes 'Color Thief' and 'Node-Vibrant' libraries to extract dominant colors from the playlist cover.
    * The first library scans the cover specifically for blue tones. If found, they undergo saturation and luminosity post-processing before being sent.
    * If no blue is found, the second library takes over to capture and send a highlight color from the cover without specific tone preference.
* **Card Image Generation (SSR):** Once metadata and colors are captured, the card, based on an HTML and CSS template, is pre-rendered on the backend before being sent to the frontend, ensuring optimization and visual consistency across all devices.
* **Interactive Visualization:** The card in the browser reacts to mouse movement with a three-dimensional rotation effect and dynamic glow.
* **Export:** A dedicated "Download Card" feature allows users to save the generated artwork locally.

---

### 🏗️ Technical Architecture

The project operates on a client-server architecture (Monorepo), separating interface and data processing responsibilities.

#### ⚙️ Backend (Server-side)
The API development was designed to support image processing and external requests with high performance:
* **Node.js & Express:** Core of the API and route management (`routes/`).
* **External API Consumption:** The `spotify.js` service communicates with the Spotify API to fetch data.
* **Color Extraction:** Through `colorExtractor.js`, the cover image is processed using 'Color Thief' and 'Node-Vibrant', including circumstantial post-processing.
* **Server-Side Image Manipulation (Puppeteer):** The rendering engine operates via `imageGenerator.js` using the Puppeteer library, compiling data into the template (`templates/playlist.html`) to render the asset.

#### 🎨 Frontend (Client-side)
The interface is polished with a focus on user experience and advanced interactivity:
* **React & Vite:** Framework for building a fast and reactive user interface.
* **Advanced CSS 3D:** Utilization of 3D transformations (`transform`, `rotateX`, `rotateY`) to create a holographic card effect.
* **Modular Componentization:** A modular structure for maintainability (`components/PlaylistCard`, `pages/PlaylistPage`).

---

### 💻 Installation & Setup

Follow the commands below to clone the monorepo and initialize both the Node.js API and the React client.

```bash
# Clone the repository to your local machine
git clone (https://github.com/your-username/spotify-playlist.git)
cd spotify-playlist

# -----------------------------------
# Backend Setup
# -----------------------------------
cd backend

# Install server dependencies
npm install

# Start the Express server
npm run dev

# -----------------------------------
# Frontend Setup
# -----------------------------------
# Open a new terminal instance and navigate to the client folder
cd ../frontend

# Install Vite/React dependencies
npm install

# Start the frontend development server
npm run dev
```

#### 🔑 Environment Variables
Create a `.env` file in the backend root directory to securely store your external API credentials:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID="your_client_id_here"
SPOTIFY_CLIENT_SECRET="your_client_secret_here"

# Server Configuration
PORT=3000
```
