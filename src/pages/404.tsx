import React, { useEffect } from 'react';
import styled from 'styled-components';
import Image404URL from '/src/assets/404.webp';

// Styled component for Centered Content
const CenteredContent = styled.div`
  display: flex;
  padding-top: 5rem;
  margin-bottom: 5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.5rem;

  img {
    max-width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Add shadow */
    border-radius: var(--global-border-radius);
    animation: fadeIn 0.5s ease; /* Apply fade-in animation */
  }

  @media (max-width: 550px) {
    img {
      max-width: 80%;
    }
  }
`;

const Idkwhattonamethis = styled.div``;

const NotFound: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 | Page Not Found';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <CenteredContent>
      <Idkwhattonamethis>
        <p>
          <strong>404</strong> | Page Not Found
        </p>
        <img src={Image404URL} alt='404 Error' />
      </Idkwhattonamethis>
    </CenteredContent>
  );
};

export default NotFound;
