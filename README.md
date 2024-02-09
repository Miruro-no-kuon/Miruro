# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

<p align="center">
  <a href="https://www.miruro.com" target="_blank">
    <img src="https://raw.githubusercontent.com/Miruro-no-kuon/Miruro/main/src/assets/miruro-transparent-white.png" alt="Logo" width="200"/>
  </a>
</p>

<h1 align="center">
    MIRURO<a href="https://www.miruro.com">.com</a>
  <p align="center">
    <img src="https://discordapp.com/api/guilds/1199699127190167643/widget.png?style=shield" alt="Discord Shield"/>
  </p>
</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/></a>
  <a href="#"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/></a>
  <a href="#"><img src="https://img.shields.io/badge/vite-%239269fe.svg?style=for-the-badge&logo=vite&logoColor=yellow&border"/></a>
  <a href="#"><img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/cloudflare-white.svg?style=for-the-badge&logo=cloudflare&logoColor=orange"/></a>
</p>

## What is Miruro?

<p><a href="https://www.miruro.com">Miruro</a> is an anime streaming website made possible by the <a href="https://github.com/consumet">Consumet API</a>, built with  <a href="https://react.dev/">React⚛️</a> and <a href="https://vitejs.dev/">Vite⚡</a>, featuring a sleek and modern design. It offers Anilist integration to help you keep track of your favorite anime series. Your Website Name is entirely free and does not display any ads, making it a great option for those who want an uninterrupted viewing experience.</p>

## Features 🪴

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

## Installation 🛠️

### Before starting installation ⚠️

> Before we proceed with the installation, we strongly recommend using `Bun` for a seamless and efficient setup. While `Node.js` is an alternative, Bun provides a comprehensive solution tailored for our project.

### 1. Clone this repository using

```bash
git clone https://github.com/Miruro-no-kuon/Miruro.git
```

```bash
cd Miruro
```

### 2. Installation

### Basic Pre-Requisites

As you might expect, Miruro relies on Node.js. However, for optimal performance, Miruro leverages Bun to achieve the fastest response times possible.

#### Download and install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Download and install Node.js

- [Download Node.js](https://nodejs.org/)

#### Verify the installation

```bash
bun -v
node -v
npm -v
```

### Install Dependencies

The following are custom installation commands, you can allways do it manually.

```bash
npm iu
or
npm install && cd server && npm install
```

or

```bash
bun iu
or
bun install && cd server && npm install
```

### Copy the `.env.example` contents to `.env` in the root folder

```bash
cp .env.example .env
```

### 3. Run on development &/or production

```bash
npm run dev
npm start
```

or

```bash
bun run dev
bun start
```

## For Local Development 💻

Please be aware that self-hosting this application is strictly limited to personal use only. Commercial utilization is prohibited, and the inclusion of advertisements on your self-hosted website may lead to consequences, including potential site takedown measures.

## License 📝

This project is licensed under the Custom BY-NC [License](LICENSE). You are free to use, share, and modify the code for non-commercial purposes with proper attribution to the original author(s). Commercial use is not allowed. For details, see the [LICENSE](LICENSE) file. Feel free to contact the author(s) for questions or additional permissions.

## Bug Report 🐞

If you encounter any issues or bug on the site please head to [issues](https://github.com/Miruro-no-kuon/Miruro-no-Kuon/issues) and create a bug report there.

## Contact 📧

If you have any questions or feedback, please reach out to us at [miruro@proton.me](mailto:miruro@proton.me), or you can join our [Discord Sever](https://discord.com/invite/4kfypZ96K4).

- Visit our website at **[miruro.com](https://www.miruro.com)**

- Follow us on **[Twitter](https://twitter.com/miruro_official)**

- Join our **[Subreddit](https://www.reddit.com/r/miruro)**

- Join our **[Discord](https://discord.gg/4kfypZ96K4)**

<a href="https://discord.com/invite/Uaaw6R8y">

  ![Discord Banner 2](https://discordapp.com/api/guilds/1199699127190167643/widget.png?style=banner2)
</a>

## Support & Contributions 🤲

⭐️ [Star this project](https://github.com/Miruro-no-kuon/Miruro-no-Kuon) ⭐️

Feel free to contribute to this project! Whether you're an experienced developer or have been in the field for a while, your help is valuable.

## Star History 📈

<div align="left">
    <img src="https://api.star-history.com/svg?repos=Miruro-no-kuon/Miruro&type=Date" alt="Star History Chart" style="max-width: 70%;" />
</div>

### Note for Beginners 💬

> If you're new to JavaScript or programming in general, no worries! Take some time to familiarize yourself with the basics before diving into this project. I'm here to help answer any questions you might have along the way. Don't hesitate to reach out, and let's learn and build together! 😊
