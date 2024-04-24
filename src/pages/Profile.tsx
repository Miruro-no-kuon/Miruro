import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserEdit } from 'react-icons/fa'; // Import FontAwesome user edit icon
import { LuConstruction } from 'react-icons/lu';
import Image404URL from '/src/assets/404.webp';
import { useAuth } from '../hooks/authContext'; // Adjust the import path as necessary
import { SiAnilist } from 'react-icons/si';
import { CgProfile } from 'react-icons/cg';

// Define the interface for preferences
interface Preferences {
  defaultLanguage: string;
  autoskipIntroOutro: string;
  autoPlay: string;
  defaultEpisodeLayout: string;
  rating: string;
  defaultServers: string;
  openKeyboardShortcuts: string;
  restoreDefaultPreferences: string;
  clearContinueWatching: string;
}

// Styled components for the profile settings
const PreferencesContainer = styled.div`
  padding: 0.5rem;
  max-width: 22rem;
  margin: auto;
`;

const PreferencesTable = styled.table`
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  border-collapse: collapse;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 0.5rem;
`;

const StyledButton = styled.button<{ isSelected: boolean }>`
  background: var(--global-div);
  color: var(--global-text);
  padding: 0.4rem;
  cursor: pointer;
  border: none;
  border-radius: var(--global-border-radius);
  transition: background-color 0.2s ease-in-out;
`;

const Loginbutton = styled.div`
  border-radius: var(--global-border-radius);
  display: flex;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: var(--global-div);
  color: var(--global-text);
  transition: 0.1s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }

  svg {
    margin-left: 0.5rem;
    font-size: 1.25rem;
  }
`;

const StyledSelect = styled.select`
  background: var(--global-div);
  color: var(--global-text);
  margin: 0.25rem;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  border: none;
  border-radius: var(--global-border-radius);
  transition: background-color 0.2s ease-in-out;
`;

// Warning message styled component
const WarningMessage = styled.div`
  background-color: var(--global-div);
  padding: 0.5rem;
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
`;

const ProfileContainer = styled.div`
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
  img {
    border-radius: var(--global-border-radius);
    width: 100px;
  }
`;
// Profile component
const Profile: React.FC = () => {
  const { isLoggedIn, userData, login, logout } = useAuth();

  // Initial state for preferences
  const [preferences, setPreferences] = useState<Preferences>({
    defaultLanguage: 'Sub',
    autoskipIntroOutro: 'Disabled',
    autoPlay: 'Disabled',
    defaultEpisodeLayout: 'Auto',
    rating: 'Anilist',
    defaultServers: 'Default',
    openKeyboardShortcuts: 'Open',
    restoreDefaultPreferences: 'Restore',
    clearContinueWatching: 'Clear',
  });

  // Action handlers for non-toggling buttons
  const performAction = (actionName: keyof Preferences) => {
    alert(`Action performed: ${actionName}`);
    // Here you would handle the action specific to the button
  };

  // Function to handle preference change
  const handlePreferenceChange = (
    preferenceName: keyof Preferences,
    value: string,
  ) => {
    setPreferences({ ...preferences, [preferenceName]: value });
  };

  // Determine if a button should toggle or perform an action
  const isActionPreference = (key: string): boolean => {
    return [
      'openKeyboardShortcuts',
      'restoreDefaultPreferences',
      'clearContinueWatching',
    ].includes(key);
  };

  return (
    <PreferencesContainer>
      <ProfileContainer>
        {isLoggedIn && userData ? (
          <>
            <img
              src={userData.avatar.large}
              alt={`${userData.name}'s avatar`}
            />
            <p>Welcome, {userData.name}</p>
            {userData.statistics && (
              <>
                <p>Anime watched: {userData.statistics.anime.count}</p>
                <p>
                  Total episodes watched:{' '}
                  {userData.statistics.anime.episodesWatched}
                </p>
                <p>
                  Total minutes watched:{' '}
                  {userData.statistics.anime.minutesWatched}
                </p>
                <p>
                  Average score:{' '}
                  {userData.statistics.anime.meanScore.toFixed(2)}
                </p>
              </>
            )}
            <a onClick={logout}>
              <Loginbutton>Log out</Loginbutton>
            </a>
          </>
        ) : (
          <div>
            <CgProfile size={'5rem'} />
            <br></br>
            <br></br>
            <b>Guest User</b>
            <br></br>
            <br></br>
            <a onClick={login}>
              <Loginbutton>
                Log in with <SiAnilist />
              </Loginbutton>
            </a>
          </div>
        )}
      </ProfileContainer>
      <WarningMessage>
        <LuConstruction style={{ color: 'orange' }} /> This page is currently{' '}
        <strong style={{ color: 'orange' }}>under construction</strong>. We
        appreciate your patience as we work to bring you new features!
        <br />
        <br />
        <img
          src={Image404URL}
          alt='404 Error'
          style={{
            borderRadius: 'var(--global-border-radius)',
            maxWidth: '100%',
          }}
        />
      </WarningMessage>
      <h3>SETTINGS</h3>
      <PreferencesTable>
        <tbody>
          {Object.entries(preferences).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{getReadablePreferenceName(key)}</TableCell>
              <TableCell>
                {isMultipleChoicePreference(key) ? (
                  <StyledSelect
                    value={value}
                    onChange={(e) =>
                      handlePreferenceChange(
                        key as keyof Preferences,
                        e.target.value,
                      )
                    }
                  >
                    {getOptionsForPreference(key).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </StyledSelect>
                ) : (
                  <StyledButton
                    isSelected={value === 'Enabled'}
                    onClick={() =>
                      isActionPreference(key)
                        ? performAction(key as keyof Preferences)
                        : handlePreferenceChange(
                            key as keyof Preferences,
                            value === 'Enabled' ? 'Disabled' : 'Enabled',
                          )
                    }
                  >
                    <FaUserEdit />
                    {' ' + value}
                  </StyledButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </PreferencesTable>
    </PreferencesContainer>
  );
};

// Function to check if preference is multiple choice
const isMultipleChoicePreference = (key: string): boolean => {
  const multipleChoicePreferences = [
    'defaultLanguage',
    'defaultEpisodeLayout',
    'rating',
    'defaultServers',
  ];
  return multipleChoicePreferences.includes(key);
};

// Function to get options for a preference
const getOptionsForPreference = (key: string): string[] => {
  switch (key) {
    case 'defaultLanguage':
      return ['Sub', 'Dub'];
    case 'defaultEpisodeLayout':
      return ['Auto', 'Compact', 'Detailed'];
    case 'rating':
      return ['Anilist', 'IMDb', 'MyAnimeList'];
    case 'defaultServers':
      return ['Default', 'Vidstreaming', 'Gogo'];
    default:
      return [];
  }
};

// Function to get readable preference name
const getReadablePreferenceName = (key: string): string => {
  switch (key) {
    case 'defaultLanguage':
      return 'Default Language';
    case 'autoskipIntroOutro':
      return 'Autoskip Intro/Outro';
    case 'autoPlay':
      return 'Auto Play';
    case 'defaultEpisodeLayout':
      return 'Default Episode Layout';
    case 'rating':
      return 'Rating Source';
    case 'defaultServers':
      return 'Default Servers';
    case 'openKeyboardShortcuts':
      return 'Open Keyboard Shortcuts';
    case 'restoreDefaultPreferences':
      return 'Restore Default Preferences';
    case 'clearContinueWatching':
      return 'Clear Continue Watching';
    default:
      return '';
  }
};

export default Profile;
