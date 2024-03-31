import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';

const PreferencesContainer = styled.div`
  margin: 0 auto;
  margin-top: 2rem;
  margin-bottom: 0rem;
  display: block;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  padding: 1rem;
  padding-top: 0.25rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 40rem;
  font-size: 1rem;
  @media (max-width: 500px) {
    margin-top: 1rem;
    margin-bottom: 0rem;
    font-size: 0.9rem;
  }
  h2 {
    align-items: left;
    text-align: left;
  }
`;

interface StyledButtonProps {
  isSelected: boolean;
  isInputToggle?: boolean; // Define isInputToggle as an optional prop
}

const StyledButton = styled.button<StyledButtonProps>`
  background: ${({ isSelected }) =>
    isSelected ? 'var(--primary-accent)' : 'var(--global-div)'};
  margin-right: 0.5rem;
  color: var(--global-text);
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: var(--global-border-radius);
  transition: background-color 0.3s;
  border: none;
  font-size: 1rem;
  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'var(--primary-accent)' : 'var(--primary-accent)'};
  }
  &:focus {
    outline: none;
  }
  svg {
    font-size: 1.5rem;
    padding-bottom: 0rem;
  }
  svg {
    font-size: 1.5rem;
    padding-bottom: 0rem;
  }
  @media (max-width: 500px) {
    font-size: 0.9rem;

    svg {
      font-size: 1rem;
      padding-bottom: 0rem;
    }
    display: flex;
    margin: ${({ isInputToggle }) => (isInputToggle ? '0' : '0')};
  }
  clear {
  }
`;

const PreferencesTable = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 1rem;
  p {
    font-size: 0.8rem;
    margin: 0rem;
  }
  @media (max-width: 500px) {
    padding: 0.5rem;
  }
`;

interface StyledDropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const StyledDropdown: React.FC<StyledDropdownProps> = ({
  options,
  selectedOption,
  onSelect,
}) => (
  <>
    {options.map((option) => (
      <StyledButton
        key={option}
        isSelected={selectedOption === option}
        onClick={() => onSelect(option)}
      >
        {option}
      </StyledButton>
    ))}
  </>
);

const getInitialThemePreference = () => {
  const storedThemePreference = localStorage.getItem('themePreference');
  if (storedThemePreference) {
    return storedThemePreference === 'dark';
  } else {
    // Check system theme when no preference is stored in localStorage
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }
};

const saveThemePreference = (isDarkMode: any) => {
  localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
};

const Profile = () => {
  // Other useState hooks remain unchanged...
  const [isDarkMode, setIsDarkMode] = useState(getInitialThemePreference());

  useEffect(() => {
    // Apply the theme based on the isDarkMode state
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    // Save the theme preference to localStorage whenever it changes
    saveThemePreference(isDarkMode);
  }, [isDarkMode]);

  // Function to set the theme to dark mode
  const setDarkTheme = () => {
    setIsDarkMode(true);
  };

  // Function to set the theme to light mode
  const setLightTheme = () => {
    setIsDarkMode(false);
  };

  const [defaultLanguage, setDefaultLanguage] = useState('Sub');
  const [autoskipIntroOutro, setAutoskipIntroOutro] = useState('Disabled');
  const [autoPlay, setAutoPlay] = useState('Disabled');
  const [defaultEpisodeLayout, setDefaultEpisodeLayout] = useState('Auto');
  const [rating, setRating] = useState('Anilist');
  const [defaultServers, setDefaultServers] = useState('Default');

  return (
    <PreferencesContainer>
      <h2>
        Profile Settings
        {/* <StyledButton isSelected={false}>Save</StyledButton> */}
      </h2>
      <PreferencesTable>
        <tbody>
          <TableRow>
            <TableCell>Theme</TableCell>
            <TableCell>
              <StyledButton
                isSelected={!isDarkMode}
                onClick={setLightTheme}
                className='svg'
              >
                <FiSun />
              </StyledButton>
              <StyledButton
                isSelected={isDarkMode}
                onClick={setDarkTheme}
                className='svg'
              >
                <FiMoon />
              </StyledButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Default language</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Sub', 'Dub']}
                selectedOption={defaultLanguage}
                onSelect={setDefaultLanguage}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Autoskip Intro/Outro</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Disabled', 'Enabled']}
                selectedOption={autoskipIntroOutro}
                onSelect={setAutoskipIntroOutro}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>AutoPlay</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Disabled', 'Enabled']}
                selectedOption={autoPlay}
                onSelect={setAutoPlay}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Default episode layout</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Auto', 'Grid', 'List', 'Image']}
                selectedOption={defaultEpisodeLayout}
                onSelect={setDefaultEpisodeLayout}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Default servers</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Default', 'Vidstreaming', 'GogoAnime']}
                selectedOption={defaultServers}
                onSelect={setDefaultServers}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rating MAL/Anilist</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Anilist', 'MyAnimeList']}
                selectedOption={rating}
                onSelect={setRating}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Open Keyboard Shortcuts</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Open']}
                selectedOption={'Open'}
                onSelect={() => {}}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Restore default preferences</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Restore']}
                selectedOption={'Restore'}
                onSelect={() => {}}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clear Continue Watching</TableCell>
            <TableCell>
              <StyledDropdown
                options={['Clear']}
                selectedOption={'Clear'}
                onSelect={() => {}}
              />
            </TableCell>
          </TableRow>
        </tbody>
      </PreferencesTable>
    </PreferencesContainer>
  );
};

export default Profile;
