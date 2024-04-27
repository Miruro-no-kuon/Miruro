// src/services/authService.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed via npm or yarn
import { UserData } from './userInfo'; // Assuming this is the correct path

// Constants for AniList OAuth, ideally should be loaded from environment variables
const clientId = import.meta.env.VITE_CLIENT_ID || 'default_client_id';
const clientSecret =
  import.meta.env.VITE_CLIENT_SECRET || 'default_client_secret';
const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'default_redirect_uri';

/**
 * Generates a new CSRF token for each session
 * @returns {string} A UUID v4 CSRF token
 */
export const generateCsrfToken = (): string => {
  return uuidv4();
};

/**
 * Builds the authorization URL with CSRF protection
 * @param {string} csrfToken CSRF token for state parameter
 * @returns {string} URL to redirect user to AniList OAuth login page
 */

// authService.ts
export const buildAuthUrl = (csrfToken: string): string => {
  const scope = encodeURIComponent('');
  const state = encodeURIComponent(csrfToken);
  const encodedRedirectUri = encodeURIComponent(redirectUri);

  return `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${encodedRedirectUri}&state=${state}`;
};

/**
 * Requests an access token from AniList using the authorization code
 * @param {string} code The authorization code received from AniList after user consent
 * @returns {Promise<string>} A promise that resolves to the access token
 */
export const getAccessToken = async (code: string): Promise<string> => {
  const url = 'https://anilist.co/api/v2/oauth/token';
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };

  try {
    const response = await axios.post(url, payload);
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('Access token not found in the response');
    }
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw new Error('Failed to obtain access token');
  }
};

// src/services/authService.js
export const fetchUserData = async (accessToken: string): Promise<UserData> => {
  try {
    const response = await axios.post(
      'https://graphql.anilist.co',
      {
        query: `
          query {
              Viewer {
                  id
                  name
                  avatar {
                      large
                  }
                  statistics {
                      anime {
                          count
                          episodesWatched
                          meanScore
                          minutesWatched
                      }
                  }
              }
          }
      `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return response.data.data.Viewer; // Ensure the structure matches UserData interface
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

// Query to fetch currently watching anime
export const fetchWatchingAnime = async (accessToken: string) => {
  try {
    const response = await axios.post(
      'https://graphql.anilist.co',
      {
        query: `
          query {
            Viewer {
              animeList(status: WATCHING) {
                media {
                  id
                  title {
                    userPreferred
                  }
                  coverImage {
                    extraLarge
                  }
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return response.data.data.Viewer.animeList.media;
  } catch (error) {
    console.error('Error fetching currently watching anime:', error);
    throw new Error('Failed to fetch currently watching anime');
  }
};
