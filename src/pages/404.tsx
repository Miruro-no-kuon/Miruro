// NotFound.jsx
import styled from "styled-components";
import Image404URL from "/src/assets/404-Page-not-found.gif";

// Styled component to center content
const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  text-align: center;
  font-size: large;
  & img {
    border-radius: 0.2rem;
  }
`;

const NotFound = () => {
  return (
    <CenteredContent>
      <img src={Image404URL} alt="Image404URL" />
      <p>The page you are looking for does not exist.</p>
    </CenteredContent>
  );
};

export default NotFound;
