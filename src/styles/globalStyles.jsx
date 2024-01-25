import { createGlobalStyle } from "styled-components";
import BLACK_LOGO from "/src/assets/BLACK_TR_LOGO.png";
import WHITE_LOGO from "/src/assets/WHITE_TR_LOGO.png";

const GlobalStyles = createGlobalStyle`

/* Base Colors - Darker Shades for Dark Mode */
:root {
  --global-primary-bg: #080808;
  --global-ad-bg: #141414;
  --global-input-div: #141414;
  --global-text: #e8e8e8;
  --global-card-bg: #181818;
  --global-card-shadow: rgba(0, 0, 0, 0.6);
  --global-primary-skeleton: rgba(85, 85, 85, 0.1);
  --global-secondary-skeleton: rgba(85, 85, 85, 0.3);
  --global-button-bg: #202020;
  --global-button-hover-bg: #292929;
  --global-button-shadow: rgba(0, 0, 0, 0.6);
  --global-button-text: #ebebeb;
  --global-popup-shadow: rgba(0, 0, 0, 0.3);
  --global-genre-button-bg: #222222;
  --global-genre-button-bg: #2a2a2a;
  --global-shadow: rgba(255, 255, 255, 0.08);
  --global-filter: rgba(0, 0, 0, 0.65);
  --global-secondary-bg: #141414;
  --global-tertiary-bg: #222222;
  --global-card-title-bg: #151515;
  --primary-accent: #ffffff;
  --primary-accent-bg: #5900FF;

  /* Logo Images */
  --global-tr-logo: url(${WHITE_LOGO});
}

/* Light Mode Specific Colors */
:root.light-mode {
  --global-primary-bg: #f5f5f5;
  --global-ad-bg: #e0e0e0;
  --global-input-div: #e0e0e0;
  --global-text: #333333;
  --global-card-bg: #ffffff;
  --global-card-title-bg: #e8e8e8;
  --global-card-shadow: rgba(0, 0, 0, 0.2);
  --global-primary-skeleton: rgba(165, 165, 165, 0.1);
  --global-secondary-skeleton: rgba(165, 165, 165, 0.3);
  --global-button-bg: #e0e0e0;
  --global-button-hover-bg: #c8c8c8;
  --global-button-text: #333333;
  --global-button-shadow: rgba(255, 255, 255, 0.5);
  --global-popup-shadow: rgba(255, 255, 255, 0.5);
  --global-genre-button-bg: #d4d4d4;
  --global-genre-button-bg: #bdbdbd;
  --global-shadow: rgba(0, 0, 0, 0.1);
  --global-filter: rgba(0, 0, 0, 0.65);
  --global-secondary-bg: #e0e0e0;
  --global-tertiary-bg: #eaeaea;

  /* Logo Images */
  --global-tr-logo: url(${BLACK_LOGO});

}

/* Basic app styles */
body {
  font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  margin: 0;
  padding: 0 1rem 1rem 1rem;
  max-width: 125rem;
  margin: auto;
  background-color: var(--global-primary-bg);
  color: var(--global-text);
  transition: 0.2s ease;
}

/* Selection styles */
::selection {
  background-color: var(--primary-accent-bg);
  color: var(--primary-accent);
}
`;

export default GlobalStyles;
