import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Message = styled.div`
  text-align: center;
  margin-top: 5rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get('error');
    const code = queryParams.get('code');
    const PLATFORM = import.meta.env.VITE_DEPLOY_PLATFORM; // This will be set as 'VERCEL' or 'CLOUDFLARE'

    // Check if there was an access denied error
    if (error === 'access_denied') {
      setErrorMessage(
        'Authorization revoked. Please click "Authorize" to grant access.',
      );
      navigate('/callback', { replace: true });
      return;
    }

    // Determine the endpoint based on the platform
    const apiEndpoint =
      PLATFORM === 'VERCEL' ? '/api/exchange-token' : '/exchange-token';

    if (code) {
      axios
        .post(apiEndpoint, { code })
        .then((response) => {
          // Store the access token in localStorage
          localStorage.setItem('accessToken', response.data.accessToken);
          // After setting the token, navigate and force a refresh
          navigate('/profile');
          window.location.reload(); // Force a full page reload to refresh state
        })
        .catch((error) => {
          const errMsg = error.response?.data?.error || 'Error logging in :(';
          console.error('Error in token exchange:', errMsg);
          setErrorMessage(errMsg); // Store the error message
          navigate('/callback', { replace: true });
        });
    }
  }, [location, navigate]);

  return (
    <Message>{errorMessage ? `${errorMessage}` : 'Logging in...'}</Message>
  );
};

export default Callback;
