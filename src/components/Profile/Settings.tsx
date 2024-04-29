import React, { useState } from 'react';
import styled from 'styled-components';

interface Preferences {
  defaultLanguage: string;
  titleLanguage: string;
  characterNameLanguage: string;
  ratingSource: string;
  openKeyboardShortcuts: string;
  autoskipIntroOutro: string;
  autoPlay: string;
  autoNext: string; // Added new setting
  defaultServers: string;
  restoreDefaultPreferences: string;
  clearContinueWatching: string;
  openButton: string;
}

const PreferencesTable = styled.table`
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  border-collapse: collapse;
  width: 100%;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 1rem;
`;

const Title = styled.h2`
  color: var(--global-text);
  font-size: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  color: var(--global-text);
  font-size: 1.25rem;
  margin: 1rem;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--global-secondary-bg);
  margin-top: 1rem;
  margin-bottom: 1rem;
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

const StyledSelect = styled.select`
  background: var(--global-div);
  color: var(--global-text);
  padding: 0.25rem;
  cursor: pointer;
  border: none;
  border-radius: var(--global-border-radius);
  transition: background-color 0.2s ease-in-out;
`;

export const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    defaultLanguage: 'Sub',
    titleLanguage: 'Romaji',
    characterNameLanguage: 'Romaji',
    ratingSource: 'Anilist',
    openKeyboardShortcuts: 'Open',
    autoskipIntroOutro: 'Disabled',
    autoPlay: 'Disabled',
    autoNext: 'Disabled',
    defaultServers: 'Default',
    restoreDefaultPreferences: 'Restore',
    clearContinueWatching: 'Clear',
    openButton: 'Open',
  });

  const getOptionsForPreference = (key: string): string[] => {
    switch (key) {
      case 'defaultLanguage':
        return ['Sub', 'Dub'];
      case 'titleLanguage':
        return [
          'English (Attack on Titan)',
          'Romaji (Shingeki no Kyojin)',
          'Native (進撃の巨人)',
        ];
      case 'characterNameLanguage':
        return ['Romaji (Zoldyck Killua)', 'Native (キルア=ゾルディック)'];
      case 'ratingSource':
        return ['Anilist', 'IMDb', 'MyAnimeList'];
      case 'autoskipIntroOutro':
        return ['Enabled', 'Disabled'];
      case 'autoPlay':
        return ['Enabled', 'Disabled'];
      case 'defaultServers':
        return ['Default', 'Vidstreaming', 'Gogo'];
      case 'autoNext':
        return ['Enabled', 'Disabled'];
      default:
        return [];
    }
  };

  const handlePreferenceChange = (
    preferenceName: keyof Preferences,
    value: string,
  ) => {
    if (
      preferenceName === 'restoreDefaultPreferences' ||
      preferenceName === 'clearContinueWatching'
    ) {
      if (confirm(`Are you sure you want to ${value.toLowerCase()}?`)) {
        console.log(`${value} confirmed`);
      }
    } else {
      setPreferences({ ...preferences, [preferenceName]: value });
      if (
        ['autoskipIntroOutro', 'autoPlay', 'autoNext'].includes(preferenceName)
      ) {
        localStorage.setItem(preferenceName, value);
      }
    }
  };

  const formatPreferenceName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div>
      <Title>Settings</Title>
      <PreferencesTable>
        <SectionTitle>General</SectionTitle>
        <tbody>
          {[
            'titleLanguage',
            'characterNameLanguage',
            'ratingSource',
            'openKeyboardShortcuts',
          ].map((key) => (
            <TableRow key={key}>
              <TableCell>{formatPreferenceName(key)}</TableCell>
              <TableCell>
                {key === 'openKeyboardShortcuts' ? ( // Render disabled button for 'openButton'
                  <StyledButton isSelected={true} disabled={true}>
                    {preferences[key as keyof Preferences]}
                  </StyledButton>
                ) : (
                  <StyledSelect
                    value={preferences[key as keyof Preferences]}
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
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
        <Divider />
        <SectionTitle>Media</SectionTitle>
        <tbody>
          {[
            'defaultLanguage',
            'defaultServers',
            'autoskipIntroOutro',
            'autoPlay',
            'autoNext',
          ].map((key) => (
            <TableRow key={key}>
              <TableCell>{formatPreferenceName(key)}</TableCell>
              <TableCell>
                <StyledSelect
                  value={preferences[key as keyof Preferences]}
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
              </TableCell>
            </TableRow>
          ))}
        </tbody>
        <Divider />
        <SectionTitle>Other</SectionTitle>
        <tbody>
          {[
            { key: 'restoreDefaultPreferences', text: 'Restore' },
            { key: 'clearContinueWatching', text: 'Clear' },
          ].map(({ key, text }) => (
            <TableRow key={key}>
              <TableCell>{formatPreferenceName(key)}</TableCell>
              <TableCell>
                <StyledButton
                  isSelected={true}
                  onClick={() =>
                    handlePreferenceChange(key as keyof Preferences, text)
                  }
                >
                  {text}
                </StyledButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </PreferencesTable>
    </div>
  );
};
