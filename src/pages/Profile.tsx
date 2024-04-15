import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserEdit } from 'react-icons/fa'; // Import FontAwesome user edit icon
import { LuConstruction } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md'; // Import Material Design settings icon
import Image404URL from '/src/assets/404.webp';

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
  padding: 0.25rem;
`;

const StyledButton = styled.button<{ isSelected: boolean }>`
  background: var(--global-div);
  color: var(--global-text);
  margin: 0.25rem;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  border: none;
  border-radius: var(--global-border-radius);
  transition: background-color 0.2s ease-in-out;
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

// Profile component
const Profile: React.FC = () => {
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

      <h3>
        <MdSettings />
        SETTINGS
      </h3>
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
