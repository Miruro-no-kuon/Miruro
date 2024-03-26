import { createGlobalStyle } from "styled-components";
import logoTextTransparentBlack from "/src/assets/miruro-text-transparent-black.webp";
import logoTextTransparentWhite from "/src/assets/miruro-text-transparent-white.webp";
import logoTransparentBlack from "/src/assets/miruro-transparent-black.webp";
import logoTransparentWhite from "/src/assets/miruro-transparent-white.webp";

// Create global styles using styled-components
const GlobalStyless = createGlobalStyle`
  /* Dark Mode Specific Colors */
  :root.dark-mode {
    --global-primary-bg: #080808;
    --global-primary-bg-tr: rgba(8, 8, 8, 0.9);
    --global-div: #141414;
    --global-border: rgba(245, 245, 245, 0.1);
    --global-text: #e8e8e8;
    --global-card-bg: #181818;
    --global-card-shadow: rgba(0, 0, 0, 0.6);
    --global-card-button-shadow: rgba(255, 255, 255, 0.6);
    --global-primary-skeleton: rgba(85, 85, 85, 0.1);
    --global-secondary-skeleton: rgba(85, 85, 85, 0.3);
    --global-button-bg: #202020;
    --global-button-hover-bg: #292929;
    --global-button-shadow: rgba(0, 0, 0, 0.6);
    --global-button-text: #ebebeb;
    --global-popup-shadow: rgba(0, 0, 0, 0.3);
    --global-genre-button-bg: #222222;
    --global-shadow: rgba(255, 255, 255, 0.08);
    --global-filter: rgba(0, 0, 0, 0.6);
    --global-secondary-bg: #141414;
    --global-tertiary-bg: #222222;
    --global-card-title-bg: #151515;

    --primary-accent: #8080cf;
    --primary-accent-bg: #aeaee4;

    --logo-text-transparent: url(${logoTextTransparentWhite});
    --logo-transparent: url(${logoTransparentWhite});
  }

  /* Light Mode Specific Colors */
  :root {
    --global-primary-bg: #f5f5f5;
    --global-primary-bg-tr: rgba(245, 245, 245, 0.97);
    --global-div: #e0e0e0;
    --global-border: rgba(8, 8, 8, 0.1);
    --global-text: #333333;
    --global-card-bg: #ffffff;
    --global-card-title-bg: #e8e8e8;
    --global-card-shadow: rgba(0, 0, 0, 0.2);
    --global-card-button-shadow: rgba(0, 0, 0, 0.6);
    --global-primary-skeleton: rgba(165, 165, 165, 0.1);
    --global-secondary-skeleton: rgba(165, 165, 165, 0.3);
    --global-button-bg: #e0e0e0;
    --global-button-hover-bg: #c8c8c8;
    --global-button-text: #333333;
    --global-button-shadow: rgba(255, 255, 255, 0.5);
    --global-popup-shadow: rgba(255, 255, 255, 0.5);
    --global-genre-button-bg: #d4d4d4;
    --global-shadow: rgba(0, 0, 0, 0.1);
    --global-filter: rgba(0, 0, 0, 0.6);
    --global-secondary-bg: #e0e0e0;
    --global-tertiary-bg: #eaeaea;
    --global-border-radius: 0.2rem;

    --primary-accent: #8080cf;
    --primary-accent-bg: #aeaee4;

    --logo-text-transparent: url(${logoTextTransparentBlack});
    --logo-transparent: url(${logoTransparentBlack});
  }

  /* Basic app styles */
  body {
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    margin: 0;
    padding: 0 2rem 2rem 2rem;
    max-width: 125rem;
    margin: auto;
    background-color: var(--global-primary-bg);
    color: var(--global-text);
    transition: 0.1s ease;

    @media (max-width: 1000px) {
      padding: 0 0.5rem 0.5rem 0.5rem;
    }
  }

  /* Selection styles */
  ::selection {
    background-color: var(--primary-accent-bg);
    color: var(--primary-accent);
  }

  /* Additional styles */
  video::cue {
    background: rgba(0, 0, 0, 0.5);
    color: #e8e8e8;
    padding: 1rem;
    font-size: 2.5vw;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
      1px 1px 0 #000;
  }
`;
const GlobalStyles = createGlobalStyle`
`;

export default GlobalStyles;
