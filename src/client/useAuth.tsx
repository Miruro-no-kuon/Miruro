import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { UserData } from './userInfoTypes'; // Adjust the path as necessary
import { fetchUserData, buildAuthUrl } from './authService'; // Adjust the path as necessary

type AuthContextType = {
  isLoggedIn: boolean;
  userData: UserData | null;
  username: string | null; // This property must be handled
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Add a loading state for auth status

  // Calculate username from userData
  const username = userData ? userData.name : null; // Assuming 'username' is a property of UserData

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserData(token)
        .then((data) => {
          setUserData(data);
          setIsLoggedIn(true);
          setAuthLoading(false); // Set loading to false once user data is fetched
        })
        .catch((err) => {
          console.error('Failed to fetch user data:', err);
          logout(); // Ensures clean state on failure
          setAuthLoading(false); // Ensure loading state is handled even in error
        });
    } else {
      setAuthLoading(false); // If no token, ensure loading is set to false
    }
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
    setAuthLoading(true); // Reset auth loading state on logout
    window.location.href = '/profile';
    window.dispatchEvent(new CustomEvent('authUpdate'));
  };

  // Prevent rendering of children if authentication status is unknown
  if (authLoading) {
    return null; // Or you could return a loading spinner or a similar component
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, username, login, logout }}
    >
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
