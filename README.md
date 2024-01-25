<div align="center">
  <a href="https://your-website-url">
    <img src="https://your-logo-url" alt="logo" width="180"/>
  </a>
</div>

<h1 align="center">
  <a href="https://your-website-url">Your Anime Streaming Website</a>
</h1>

<p align="center">
  <i>Migrating to TypeScript! More active development <a href="https://github.com/YourGitHubUsername/YourRepoName/tree/beta">on the beta branch</a></i>

<br />
<br />

 <a href="https://github.com/YourGitHubUsername/YourRepoName/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/YourGitHubUsername/YourRepoName" alt="license"/>
  </a>
  <a href="https://github.com/YourGitHubUsername/YourRepoName/fork">
    <img src="https://img.shields.io/github/forks/YourGitHubUsername/YourRepoName?style=social" alt="fork"/>
  </a>
  <a href="https://github.com/YourGitHubUsername/YourRepoName">
    <img src="https://img.shields.io/github/stars/YourGitHubUsername/YourRepoName?style=social" alt="stars"/>
  </a>
  
</p>

<p align="center">
 <img src="https://placeholder-image-url" alt="main">
</p>

<details>
<summary>More Screenshots</summary>

<h3 align="center">Home page after you login</h3>
<img src="https://placeholder-image-url"/>

<h3 align="center">Profile Page</h3>
<img src="https://placeholder-image-url"/>

<h3 align="center">Info page for PC/Mobile</h3>
<p align="center">
<img src="https://placeholder-image-url"/>
</p>

<h3 align="center">Watch Page</h3>
<p align="center">Normal Mode</p>
<img src="https://placeholder-image-url"/>
<br/>
<p align="center">Theater Mode</p>
<img src="https://placeholder-image-url"/>
 
<h3 align="center">Manga Reader</h3>
<img src="https://placeholder-image-url"/>

</details>

> **Warning:** If you are not familiar with JavaScript or any other programming language related to this project, please learn it first before attempting to work on this project. **I won't be able to help anyone who doesn't know how to do basic stuff.**

## Introduction

<p><a href="https://your-website-url">Your Website Name</a> is an anime streaming website made possible by the <a href="https://github.com/consumet">Consumet API</a>, built with <a href="https://github.com/vercel/next.js/">Next.js</a> and <a href="https://github.com/tailwindlabs/tailwindcss">Tailwind</a>, featuring a sleek and modern design. It offers Anilist integration to help you keep track of your favorite anime series. Your Website Name is entirely free and does not display any ads, making it a great option for those who want an uninterrupted viewing experience.</p>

## Features

- General
  - Free ad-supported streaming service
  - Dub Anime support
  - User-friendly interface
  - Auto sync with AniList
  - Add Anime/Manga to your AniList
  - Scene Searching powered by [trace.moe](https://trace.moe)
  - PWA supported
  - Mobile responsive
  - Fast page load
- Watch Page
  - Player
    - Autoplay next episode
    - Skip op/ed button
    - Theater mode
  - Comment section
- Profile page to see your watch list

## To Do List

- [x] Add PWA support
- [x] Connect to consumet API to fetch episodes data
- [x] Implement skip op/ed button on supported anime
- [x] Create README file
- [x] Integrate Anilist API for anime tracking
  - [x] Ability to auto track anime after watching >= 90% through the video
  - [x] Create a user profile page to see lists of anime watched
  - [x] Ability to edit list inside detail page
- [x] Working on Manga pages

## Bug Report

If you encounter any issues or bug on the site please head to [issues](https://github.com/YourGitHubUsername/YourRepoName/issues) and create a bug report there.

## For Local Development

> If you want to self-host this app, please note that it is only allowed for personal use. Commercial use is not permitted, and including ads on your self-hosted site may result in actions such as site takedown.

1. Clone this repository using :

```bash
git clone https://github.com/YourGitHubUsername/YourRepoName.git
```

2. Install package using npm :

```bash
npm install
```

3. Create `.env` file in the root folder and put this inside the file :

```bash
## AniList
CLIENT_ID="get the id from here https://anilist.co/settings/developer"
CLIENT_SECRET="get the secret from here https://anilist.co/settings/developer"
GRAPHQL_ENDPOINT="https://graphql.anilist.co"

## NextAuth
NEXTAUTH_SECRET='run this cmd in your bash terminal (openssl rand -base64 32) with no bracket, and paste it here'
NEXTAUTH_URL="for development use http://localhost:3000/ and for production use your domain url"

## NextJS
PROXY_URI="This is what I use for proxying video https://github.com/chaycee/M3U8Proxy. Don't put / at the end of the url."
API_URI="host your own API from this repo https://github.com/consumet/api.consumet.org. Don't put / at the end of the url."
DISQUS_SHORTNAME='put your disqus shortname here (optional)'

## Prisma
DATABASE_URL="Your postgresql connection url"

## Redis
# If you don't want to use redis, just comment the REDIS_URL (press ctrl + / on windows or cmd + / on mac)
REDIS_URL="rediss://username:password@host:port"
```

4. Add this endpoint as Redirect Url on AniList Developer :

```bash
https://your-website-domain/api/auth/callback/AniListProvider
```

5. Generate Prisma :

```bash
npx prisma migrate dev
npx prisma generate

### NOTE
# If you get a vercel build error related to prisma that says prisma detected but no initialized just change the following line in package.json line number 8
"build": "next build" to > "build": "npx prisma migrate deploy && npx prisma generate && next build"
```

6. Start local server :

```bash
npm run dev
```

## Credits

- [Consumet API](https://github.com/consumet/api.consumet.org) for anime sources
- [AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs) for anime details source
- [Anify API](https://anify.tv/discord) for manga sources
- [miru](https://github.com/ThaUnknown/miru/) for inspiring me making this site

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

> This means that if you choose to use or host this site for your own purposes, you are also required to release the source code of any modifications or improvements you make to this project. This open-source ethos is central to the project's philosophy.

## Contact

Thank You for passing by!!

If you have any questions or feedback, please reach out to us at [contact@your-website-url](mailto:contact@your-website-url?subject=[YourWebsite]%20-%20Your%20Subject), or you can join our [discord sever](https://discord.gg/your-discord-link).
<br>
or you can DM me on Discord `YourDiscordUsername#1234`.

[![Discord Banner](https://discordapp.com/api/guilds/your-discord-server-id/widget.png?style=banner2)](https://discord.gg/your-discord-link)

## Support This Project

✨ [Star this project](https://github.com/YourGitHubUsername/YourRepoName)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/your-ko-fi-link)  
<a href="https://trakteer.id/your-trakteer-id" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-5.png" height="36" style="border: 0px; height: 36px;" alt="Trakteer Saya"></a>
