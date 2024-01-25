import React from "react";
import styled from "styled-components";
import Logo from "/src/assets/MIRURO_logo.jpg";

const theme = {
  primaryBgColor: "var(--global-secondary-bg)",
  textColor: "var(--global-text)",
  buttonTextColor: "var(--global-button-text)",
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterContainer = styled.footer`
  color: ${theme.textColor};
  padding: 1rem 0;
  margin: 1rem 0;
  border-top: 2px solid ${theme.primaryBgColor};
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterLogo = styled.img`
  max-width: 80px; /* Reduced logo size */
  height: auto;
  margin-bottom: 1rem;
`;

const FooterNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 1rem; /* Reduced gap between nav items */
    margin-bottom: 1rem;
  }

  li {
    font-size: 0.9rem; /* Reduced font size */
  }

  a {
    color: ${theme.textColor};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.buttonTextColor};
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.5rem; /* Reduced gap between social icons */

  a {
    color: ${theme.textColor};
    text-decoration: none;
    font-size: 1rem; /* Reduced social icon size */
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.buttonTextColor};
    }
  }
`;

const CopyrightText = styled.p`
  font-size: 0.8rem;
  text-align: center;
`;

const DisclaimerText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  margin: 0;
`;

const currentYear = new Date().getFullYear(); // Moved outside the component

function Footer() {
  return (
    <PageWrapper>
      <FooterContainer>
        <FooterContent>
          <FooterLogo src={Logo} alt="Footer Logo" />{" "}
          <FooterNav>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </FooterNav>
          <SocialIcons>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://discord.gg/4kfypZ96K4">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://github.com/Miruro-no-kuon/Miruro-no-Kuon">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.reddit.com/r/miruro">
              <i className="fab fa-reddit"></i>
            </a>
          </SocialIcons>
          <CopyrightText>
            &copy; {currentYear} Miruro no Kuon. All Rights Reserved.
          </CopyrightText>
          <DisclaimerText>
            This site does not store any files on its server. All contents are
            provided by non-affiliated third parties.
          </DisclaimerText>
        </FooterContent>
      </FooterContainer>
    </PageWrapper>
  );
}

export default Footer;
