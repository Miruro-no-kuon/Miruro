import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { UserData } from './userInfo'; // Adjust the path as necessary
import { fetchUserData, buildAuthUrl } from './authService'; // Adjust the path as necessary

type AuthContextType = {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const handleAuthUpdate = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsLoggedIn(true);
        fetchUserData(token)
          .then((data) => {
            setUserData(data);
          })
          .catch((err) => {
            console.error('Failed to fetch user data:', err);
            logout(); // Ensures clean state on failure
          });
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    window.addEventListener('authUpdate', handleAuthUpdate);
    handleAuthUpdate();
    return () => {
      window.removeEventListener('authUpdate', handleAuthUpdate);
    };
  }, []);

  const login = async () => {
    try {
      const response = await axios.get('/get-csrf-token');
      const csrfToken = response.data.csrfToken;
      const authUrl = buildAuthUrl(csrfToken);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error fetching CSRF token or building auth URL:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = '/profile';
    window.dispatchEvent(new CustomEvent('authUpdate'));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
