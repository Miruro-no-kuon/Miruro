import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserEdit } from 'react-icons/fa';
import { LuConstruction } from 'react-icons/lu';
import { IoLogOutOutline } from 'react-icons/io5';
import Image404URL from '/src/assets/404.webp';
import { useAuth, EpisodeCard } from '../index';
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

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 1rem;

  @media (min-width: 1000px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ProfileContainer = styled.div`
  padding: 0.5rem;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
  flex: 1;
  justify-content: center;
  align-items: center;
  p {
    margin: 0.75rem;
  }
  img {
    border-radius: var(--global-border-radius);
    width: 100px;
  }
`;

const WarningMessage = styled.div`
  background-color: var(--global-div-tr);
  padding: 0.5rem;
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
  flex: 1; // Take up equal space when next to each other
`;

const PreferencesContainer = styled.div`
  max-width: 80rem;
  margin: auto;
  padding: 0.25rem;
`;

const PreferencesTable = styled.table`
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  border-collapse: collapse;
  width: 100%;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 0.75rem;
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
  cursor: pointer;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: var(--global-div);
  color: var(--global-text);
  transition: 0.1s ease-in-out;
  width: 10rem; // Fixed width
  margin: 0 auto; // Center horizontally
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
  padding: 0.25rem;
  cursor: pointer;
  border: none;
  border-radius: var(--global-border-radius);
  transition: background-color 0.2s ease-in-out;
`;

// Warning message styled component

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

  // Profile Page Document Title
  useEffect(() => {
    document.title =
      isLoggedIn && userData ? `Profile - ${userData.name}` : 'Profile';
  }, [isLoggedIn, userData]);

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
      <TopContainer>
        <ProfileContainer>
          {isLoggedIn && userData ? (
            <>
              <img
                src={userData.avatar.large}
                alt={`${userData.name}'s avatar`}
              />
              <p>
                Welcome, <b>{userData.name}</b>
              </p>
              {userData.statistics && (
                <>
                  <p>
                    Anime watched: <b>{userData.statistics.anime.count}</b>
                  </p>
                  <p>
                    Total episodes watched:{' '}
                    <b>{userData.statistics.anime.episodesWatched}</b>
                  </p>
                  <p>
                    Total minutes watched:{' '}
                    <b>{userData.statistics.anime.minutesWatched}</b>
                  </p>
                  <p>
                    Average score:{' '}
                    <b>{userData.statistics.anime.meanScore.toFixed(2)}</b>
                  </p>
                </>
              )}
              <a onClick={logout}>
                <Loginbutton>
                  <b>Log out </b>
                  <IoLogOutOutline />
                </Loginbutton>
              </a>
            </>
          ) : (
            <UserInfoContainer>
              <div style={{ paddingBottom: '2rem' }}>
                <CgProfile size={'5rem'} style={{ marginBottom: '1rem' }} />
                <br />
                <b>Guest User</b>
              </div>
              <a onClick={login}>
                <Loginbutton>
                  <b> Log in with </b>
                  <SiAnilist />
                </Loginbutton>
              </a>
            </UserInfoContainer>
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
      </TopContainer>
      <EpisodeCard />
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
