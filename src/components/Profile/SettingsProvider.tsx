import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Define the type for the context state
interface SettingsContextType {
  settings: {
    autoSkip: boolean;
    autoPlay: boolean;
    autoNext: boolean;
    defaultLanguage: string;
    defaultServers: string;
  };
  setSettings: (settings: Partial<SettingsContextType['settings']>) => void;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettingsState] = useState({
    autoSkip: localStorage.getItem('autoSkip') === 'true',
    autoPlay: localStorage.getItem('autoPlay') === 'true',
    autoNext: localStorage.getItem('autoNext') === 'true',
    defaultLanguage: localStorage.getItem('defaultLanguage') || 'sub',
    defaultServers: localStorage.getItem('defaultServers') || 'default',
  });

  useEffect(() => {
    // This useEffect will ensure that any changes to the settings state are reflected in local storage
    // console.log('Settings updated:', settings);
    localStorage.setItem('autoSkip', settings.autoSkip ? 'true' : 'false');
    localStorage.setItem('autoPlay', settings.autoPlay ? 'true' : 'false');
    localStorage.setItem('autoNext', settings.autoNext ? 'true' : 'false');
    localStorage.setItem('defaultLanguage', settings.defaultLanguage);
    localStorage.setItem('defaultServers', settings.defaultServers);
  }, [settings]);

  const setSettings = (
    newSettings: Partial<SettingsContextType['settings']>,
  ) => {
    setSettingsState((prev) => {
      const updatedSettings = { ...prev, ...newSettings };
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
