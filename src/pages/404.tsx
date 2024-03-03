import React, { useEffect } from "react";
import styled from "styled-components";
import Image404URL from "/src/assets/404-Page-not-found.gif";

// Styled component to center content
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
  & img {
    border-radius: var(--global-border-radius);
    max-width: 100%; /* Ensures the image doesn't exceed its container */
  }
  h3 {
    font-size: 1.5rem; /* Set initial font size */
    max-width: 100%; /* Ensures the image doesn't exceed its container */
  }
  @media (max-width: 550px) {
    flex-direction: column;
    text-align: center;
    & img {
      max-width: 80%; /* Adjust the value as needed */
    }
    h4 {
      font-size: 1rem; /* Decrease font size for smaller screens */
      max-width: 80%; /* Adjust the value as needed */
    }
  }
`;

const NotFound: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404 Not Found"; // Set the title when the component mounts
    return () => {
      // Reset the title to the previous one when the component unmounts
      document.title = previousTitle;
    };
  }, []);

  return (
    <CenteredContent>
      <img src={Image404URL} alt="Image404URL" />
      <br></br>
      <h4>The page you're looking for doesn't seem to exist.</h4>
    </CenteredContent>
  );
};

export default NotFound;
