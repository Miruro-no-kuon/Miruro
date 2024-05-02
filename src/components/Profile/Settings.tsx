import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useSettings } from '../../index';
interface Preferences {
  defaultLanguage: string;
  titleLanguage: string;
  characterNameLanguage: string;
  ratingSource: string;
  openKeyboardShortcuts: string;
  autoskipIntroOutro: string;
  autoPlay: string;
  autoNext: string;
  defaultServers: string;
  restoreDefaultPreferences: string;
  clearContinueWatching: string;
  openButton: string;
}

const Goback = styled.div`
  border-radius: var(--global-border-radius);
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  background-color: var(--global-div);
  color: var(--global-text);
  width: 3rem;
  margin-right: 0.75rem;
  &:active {
    transform: scale(0.975);
  }
`;

const SettingsDiv = styled.div`
  gap: 1rem;
  max-width: 45rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto; /* This centers the div horizontally */
`;

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
  display: flex;
  color: var(--global-text);
  font-size: 1.5rem;
  margin: 0rem;
  margin-top: 1rem;
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
  const navigate = useNavigate();
  const { settings, setSettings } = useSettings();

  const [preferences, setPreferences] = useState<Preferences>({
    defaultLanguage: settings.defaultLanguage,
    titleLanguage: 'Romaji',
    characterNameLanguage: 'Romaji',
    ratingSource: 'Anilist',
    openKeyboardShortcuts: 'Open',
    autoskipIntroOutro: settings.autoSkip ? 'Enabled' : 'Disabled',
    autoPlay: settings.autoPlay ? 'Enabled' : 'Disabled',
    autoNext: settings.autoNext ? 'Enabled' : 'Disabled',
    defaultServers: 'Default',
    restoreDefaultPreferences: 'Restore',
    clearContinueWatching: 'Clear',
    openButton: 'Open',
  });

  useEffect(() => {
    setPreferences((prev) => ({
      ...prev,
      defaultLanguage: settings.defaultLanguage,
      autoskipIntroOutro: settings.autoSkip ? 'Enabled' : 'Disabled',
      autoPlay: settings.autoPlay ? 'Enabled' : 'Disabled',
      autoNext: settings.autoNext ? 'Enabled' : 'Disabled',
    }));
  }, [settings]);

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
    setPreferences((prev) => ({
      ...prev,
      [preferenceName]: value,
    }));

    switch (preferenceName) {
      case 'autoskipIntroOutro':
        setSettings({ autoSkip: value === 'Enabled' });
        break;
      case 'autoPlay':
        setSettings({ autoPlay: value === 'Enabled' });
        break;
      case 'autoNext':
        setSettings({ autoNext: value === 'Enabled' });
        break;
      case 'defaultLanguage':
        setSettings({ defaultLanguage: value });
        break;
      case 'defaultServers':
        setSettings({ defaultServers: value });
        break;
    }
  };

  const formatPreferenceName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const handleGoback = () => {
    navigate('/profile');
  };

  // Profile Page Document Title
  useEffect(() => {
    document.title = `Settings | Profile`;
  });

  return (
    <SettingsDiv>
      <Title>
        <Goback onClick={handleGoback}>
          <IoArrowBack />
        </Goback>
        Settings
      </Title>
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
                {key === 'openKeyboardShortcuts' ? (
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
    </SettingsDiv>
  );
};
