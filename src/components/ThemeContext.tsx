import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => useContext(ThemeContext)!;

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() =>
    getInitialThemePreference(),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const getInitialThemePreference = (): boolean => {
  const storedThemePreference = localStorage.getItem('themePreference');
  if (storedThemePreference) {
    return storedThemePreference === 'dark';
  }
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};
