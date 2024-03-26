import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Image404URL from "/src/assets/404-Page-not-found.gif";

const FadeIn = keyframes`
  0% { opacity: 0.4; }
  100% { opacity: 1; }
`;

// Styled component for Centered Content
const CenteredContent = styled.div`
  display: flex;
  padding-top: 5rem;
  padding-bottom: 5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  text-align: center;
  font-size: large;

  h2 {
    font-weight: 300; /* Thin font */
    font-size: 1.5rem; /* Adjust font size */
    margin-bottom: 1rem; /* Add margin */
  }

  h3 {
    font-weight: 300; /* Thin font */
    font-size: 1.2rem; /* Adjust font size */
    margin-top: 1rem; /* Add margin */
  }

  img {
    max-width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Add shadow */
    border-radius: var(--global-border-radius);
    animation: ${FadeIn} 0.5s ease; /* Apply fade-in animation */
  }

  @media (max-width: 550px) {
    img {
      max-width: 80%;
    }

    h2,
    h3 {
      font-size: 1rem;
      max-width: 80%;
    }
  }
`;

const NotFound: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404 | Page Not Found";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <CenteredContent>
      <h2>404 | Page Not Found</h2>
      <img src={Image404URL} alt="404 Error" />
    </CenteredContent>
  );
};

export default NotFound;
