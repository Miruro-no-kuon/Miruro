import React from 'react';
import { Link } from 'react-router-dom';
// import logo from "./public/assets/img/logo512.png";
import styled from 'styled-components';

function PageNotFound({ changeMetaArr }) {
  React.useEffect(() => {
    changeMetaArr('title', 'PageNotFound');
  });
  return (
    <NotFoundWrapper>
      <ErrorCTA>
        <img
          src="https://cdn.discordapp.com/attachments/985501610455224389/1041882683166445699/logo2.png"
          width="320"
          alt="AkioNotFound"
          className="error-image"
        />
        <HomeLink to="/">Go to Home</HomeLink>
      </ErrorCTA>
      <ErrorDetails>
        <h2 className="error-code">404</h2>
        <p className="error-status">Page Not Found</p>
        <h1 className="error-message">Looks like you are lost...</h1>
      </ErrorDetails>
    </NotFoundWrapper>
  );
}

const NotFoundWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  padding: 10px 10px;
  gap: 20px;
  text-align: center;
  @media screen and (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const ErrorCTA = styled.div`
  position: relative;
  margin-bottom: 3rem;
  width: 350px;
  overflow: hidden;
  .error-image {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media screen and (max-width: 380px) {
    width: 100%;
  }
`;

const HomeLink = styled(Link)`
  background-color: #ddd;
  color: #23272a;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0%;
  border-radius: 10px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  text-decoration: none;
  font-weight: bold;
  font-size: 22px;
  transition: 0.3s;

  @media screen and (max-width: 380px) {
    width: 100%;
    font-size: 16px;
  }
  
  :hover {
    background-color: #fff;
  }
`;

const ErrorDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  gap: 1rem;
  white-space: pre-wrap;
  .error-code {
    font-size: 120px;
    letter-spacing: 10px;
    color: white;
  }
  .error-status {
    font-size: 75px;
    font-weight: bold;
    color: #ccc;
  }
  .error-message {
    color: gray;
  }
  @media screen and (max-width: 1024px) {
    .error-code {
      font-size: 80px;
    }
    .error-status {
      font-size: 70px;
    }
    .error-message {
      font-size: 30px;
    }
  }
  @media screen and (max-width: 600px) {
    .error-code {
      font-size: 60px;
    }
    .error-status {
      font-size: 40px;
    }
    .error-message {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 380px) {
  }
`;

export default PageNotFound;