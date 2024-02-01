<p align="center">
  <img src="https://raw.githubusercontent.com/Miruro-no-kuon/Miruro/rise/src/assets/miruro-transparent-white.png" alt="Logo" width="200"/>
</p>
<h3 align="center">
    <a href="https://www.miruro.com">Miruro</a>
</h1>


## Introduction

<p><a href="https://miruro.com">Miruro</a> is an anime streaming website made possible by the <a href="https://github.com/consumet">Consumet API</a>, built with  <a href="https://react.dev/">React⚛️</a> and <a href="https://vitejs.dev/">Vite⚡</a>, featuring a sleek and modern design. It offers Anilist integration to help you keep track of your favorite anime series. Your Website Name is entirely free and does not display any ads, making it a great option for those who want an uninterrupted viewing experience.</p>

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

| Splash Page | Home Page |
|-------------|-----------|
| ![Splash Page](https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/splash-page.webp) | ![Home Page](https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/home-page.webp) |

| Watch Page | Footer |
|------------|--------|
| ![Watch Page](https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/watch-page.webp) | ![Footer](https://raw.githubusercontent.com/Miruro-no-kuon/.github/main/profile/footer.webp) |

## For Local Development

> If you want to self-host this app, please note that it is only allowed for personal use. Commercial use is not permitted, and including ads on your self-hosted site may result in actions such as site takedown.

### 1. Clone this repository using :

```bash
git clone https://github.com/Miruro-no-kuon/Miruro.git
```

### 2. Install dependencies (Its recommended to run it on bun but it can run on npm)

####    Install Node.js and npm
- [Download Node.js](https://nodejs.org/)
#### Verify the installation: 
- node -v 
- npm -v
#### Install Vite
- //////
####    Install Bun
- //////

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

# IS_SERVERLESS: A flag indicating whether the application is running in a serverless environment.
# Set this to "true" when deploying your application as a serverless function (e.g., on Vercel).
# Set this to "false" when running your application on a traditional server.
# Example (serverless environment): IS_SERVERLESS=true
IS_SERVERLESS=false
```

### 4. Start local server :

```bash
bun run dev
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

> This means that if you choose to use or host this site for your own purposes, you are also required to release the source code of any modifications or improvements you make to this project. This open-source ethos is central to the project's philosophy.

## Bug Report

If you encounter any issues or bug on the site please head to [issues](https://github.com/Miruro-no-kuon/Miruro-no-Kuon/issues) and create a bug report there.

## Contact

Thank You for passing by!!

If you have any questions or feedback, please reach out to us at [miruro@proton.me](mailto:miruro@proton.me), or you can join our [Discord Sever](https://discord.com/invite/4kfypZ96K4).


- Visit our website at **[miuro.com](https://miruro.com)**
  
- Join our **[Discord](https://discord.gg/4kfypZ96K4)**

- Follow us on **[Twitter](https://twitter.com/miruro_official)** 

- Join our **[Subreddit](https://www.reddit.com/r/miruro)**

## Support This Project

✨ [Star this project](https://github.com/Miruro-no-kuon/Miruro-no-Kuon)


### Note for Beginners: 
> If you're new to JavaScript or programming in general, no worries! Take some time to familiarize yourself with the basics before diving into this project. I'm here to help answer any questions you might have along the way. Don't hesitate to reach out, and let's learn and build together! 😊
