<p align="center">
  <a href="https://www.miruro.com" target="_blank">
    <img src="https://raw.githubusercontent.com/Miruro-no-kuon/Miruro/main/src/assets/miruro-transparent-white.png" alt="Logo" width="200"/>
  </a>
</p>

<h3 align="center">
    <a href="https://www.miruro.com">Miruro.com</a>
</h3>

## What is Miruro?

<p><a href="https://www.miruro.com">Miruro</a> is an anime streaming website made possible by the <a href="https://github.com/consumet">Consumet API</a>, built with  <a href="https://react.dev/">React⚛️</a> and <a href="https://vitejs.dev/">Vite⚡</a>, featuring a sleek and modern design. It offers Anilist integration to help you keep track of your favorite anime series. Your Website Name is entirely free and does not display any ads, making it a great option for those who want an uninterrupted viewing experience.</p>

## Features

- General
  - Free ad-supported streaming service
  - Dub Anime support
  - User-friendly interface
  - Add Anime/Manga to your AniList
  - Mobile responsive
  - Fast page load
- Watch Page
  - Player
    - Autoplay next episode
    - Skip op/ed button
    - Theater mode
  - Comment section
- Profile page to see your watch list
- Profile page to see your continue watching
- Check new commits to see new features and changes!

<div style="text-align: left;">
  <h3>Home Page</h3>

  <img src="https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/home-page.webp" alt="Home Page" style="max-width: 70%;" >
  <details>
  <summary>View More</summary>
  <h3>Splash Page</h3>
  <br>
  <img src="https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/splash-page.webp" alt="Splash Page" style="max-width: 70%;">

  <h3>Watch Page</h3>
  <img src="https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/watch-page.webp" alt="Watch Page" style="max-width: 70%;">

  <h3>Footer</h3>
  <img src="https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/footer.webp" alt="Footer" style="max-width: 70%;">
  </details>
</div>

## Installation

### Before starting installation ⚠️

> Before proceeding with the installation, it is strongly recommended to use Bun for a seamless and efficient setup. While npm is an alternative, Bun provides a comprehensive solution that is tailored for our project.

### 1. Clone this repository using :

```bash
git clone https://github.com/Miruro-no-kuon/Miruro.git
```

```bash
cd Miruro
```

### 2. Install dependencies (Its recommended to run it on bun but it can run on npm)

#### Download and install Node.js

- [Download Node.js](https://nodejs.org/)

#### Verify the installation:

```bash
node -v
npm -v
```

#### Install Dependencies

```bash
npm install
```

#### Install Bun (Recommended)

```bash
bun install
```

### 3. Create `.env` file in the root folder and put this inside the file :

```bash
## AniList
# VITE_BACKEND_URL: The base URL of the primary backend server.
# Set this to the URL of your primary backend server in a production environment.
# Example: VITE_BACKEND_URL="https://api.consumet.org"
VITE_BACKEND_URL="https://api.consumet.org"

# VITE_BACKEND_URL_2: The base URL of a secondary backend server (if applicable).
# You can use a secondary backend server for specific features or redundancy.
# Set this to the URL of your secondary backend server in a production environment.
# Example: VITE_BACKEND_URL_2="https://api.anify.tv/"
# Note: You have a commented out local development URL, which is useful for testing locally.
# Example (local development): VITE_BACKEND_URL_2="http://localhost:3060/"
VITE_BACKEND_URL_2="https://api.anify.tv/"

# VITE_API_KEY: Your API key for authentication with the backend servers.
# Set this to your actual API key in a production environment.
# Example: VITE_API_KEY="12345678-12345678-12345678"
VITE_API_KEY=""

# PORT: The port number on which your server (if applicable) should listen.
# Set this to the desired port number in a production environment.
# Example: PORT=5173
PORT=5173
```

### 4. Start local server :

#### Npm

```bash
npm run dev
```

#### Bun (Recommended)

```bash
bun run dev
```

## For Local Development 💻

Please be aware that self-hosting this application is strictly limited to personal use only. Commercial utilization is prohibited, and the inclusion of advertisements on your self-hosted website may lead to consequences, including potential site takedown measures.

## License

This project is licensed under the Custom BY-NC [License](LICENSE). You are free to use, share, and modify the code for non-commercial purposes with proper attribution to the original author(s). Commercial use is not allowed. For details, see the [LICENSE](LICENSE) file. Feel free to contact the author(s) for questions or additional permissions.

## Contact

Thank You for passing by!!

If you have any questions or feedback, please reach out to us at [miruro@proton.me](mailto:miruro@proton.me), or you can join our [Discord Sever](https://discord.com/invite/4kfypZ96K4).

- Visit our website at **[miuro.com](https://www.miruro.com)**
- Join our **[Discord](https://discord.gg/4kfypZ96K4)**

- Follow us on **[Twitter](https://twitter.com/miruro_official)**

- Join our **[Subreddit](https://www.reddit.com/r/miruro)**

## Bug Report

If you encounter any issues or bug on the site please head to [issues](https://github.com/Miruro-no-kuon/Miruro-no-Kuon/issues) and create a bug report there.

## Support This Project

✨ [Star this project](https://github.com/Miruro-no-kuon/Miruro-no-Kuon)

## Note for Beginners:

> If you're new to JavaScript or programming in general, no worries! Take some time to familiarize yourself with the basics before diving into this project. I'm here to help answer any questions you might have along the way. Don't hesitate to reach out, and let's learn and build together! 😊
