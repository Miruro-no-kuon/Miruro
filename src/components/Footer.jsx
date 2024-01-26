import React from "react";
import styled from "styled-components";

// Constants for theme values
const theme = {
  primaryBackgroundColor: "var(--global-secondary-bg)",
  textColor: "var(--global-text)",
  buttonTextColor: "var(--global-button-text)",
  footerLogo: "var(--logo-transparent)",
};

// Constants for font sizes in rem
const fontSize1rem = "1rem";
const fontSize0_9rem = "0.9rem";
const fontSize0_8rem = "0.8rem";

// Base font size (16px) for reference
const baseFontSize = 16;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem; /* 1rem = ${baseFontSize}px */
  margin-top: 2.5em;
`;

const FooterContainer = styled.footer`
  color: ${theme.textColor};
  padding: 1rem; /* 1rem = ${baseFontSize}px */
  margin: 0.5rem 0;
  border-top: 0.125rem solid ${theme.primaryBackgroundColor}; /* 2px = 0.125rem */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterContentWrapper = styled.div`
  margin: 0 auto;
  padding: 2rem; /* 2rem = ${2 * baseFontSize}px */
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* 2rem = ${2 * baseFontSize}px */

  @media (min-width: 48rem) {
    /* 768px */
    grid-template-columns: repeat(3, 1fr);
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const SocialIconsWrapper = styled.div`
  display: flex;
  margin-top: 3rem; /* 3rem = ${3 * baseFontSize}px */
  gap: 0.5rem; /* 0.5rem = ${0.5 * baseFontSize}px */
  justify-content: center;

  a {
    color: ${theme.textColor};
    text-decoration: none;
    font-size: ${fontSize1rem};
    transition: color 0.1s ease, transform 0.2s ease;

    &:hover {
      color: ${theme.buttonTextColor};
      transform: scale(1.15);
      text-decoration: underline;
    }
  }
`;

const FooterLogoImage = styled.img`
  max-width: 6rem;
  content: ${theme.footerLogo};
  height: auto;
  display: block;
  position: absolute;
  top: -3rem; /* -40px / 16 = -2.5rem */
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  opacity: 0;
  animation: fadeIn 1s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-size: ${fontSize1rem};
    margin-bottom: 0.5rem; /* 0.5rem = ${0.5 * baseFontSize}px */
    text-align: center;
  }

  p {
    font-size: ${fontSize0_9rem};
    margin-bottom: 1rem; /* 1rem = ${baseFontSize}px */
  }
`;

const CopyrightText = styled.p`
  font-size: ${fontSize0_8rem};
  text-align: center;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
  border-top: 0.0625rem solid ${theme.primaryBackgroundColor}; /* 1px = 0.0625rem */
`;

const DisclaimerText = styled.p`
  font-size: ${fontSize0_8rem};
  text-align: center;
  margin: 0;
  padding-top: 0.5rem;
`;

const currentYear = new Date().getFullYear();

const StyledLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    font-size: ${fontSize0_9rem};
    margin-bottom: 0.25rem; /* 0.25rem = ${0.25 * baseFontSize}px */
    position: relative; /* Added to create the dot */
    padding-left: 1rem; /* 1rem = ${baseFontSize}px */
  }
  a {
    color: ${theme.textColor};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.buttonTextColor};
      text-decoration: underline;
    }

    &::before {
      content: "•"; /* Unicode character for a dot */
      position: absolute;
      left: 0;
      color: ${theme.primaryBackgroundColor}; /* Color of the dot */
    }
  }
`;

function Footer() {
  return (
    <PageWrapper>
      <FooterContainer>
        <SocialIconsWrapper>
          <a
            href="https://twitter.com/miruro_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://discord.gg/4kfypZ96K4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-discord"></i>
          </a>
          <a
            href="https://github.com/Miruro-no-kuon/Miruro-no-Kuon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.reddit.com/r/miruro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-reddit"></i>
          </a>
        </SocialIconsWrapper>
        <FooterContentWrapper>
          <FooterLogoImage src={theme.footerLogo} alt="Footer Logo" />
          <FooterColumn>
            <h3>Useful Links</h3>
            <StyledLinkList>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Sitemap</a>
              </li>
            </StyledLinkList>
          </FooterColumn>

          <FooterColumn>
            <h3>Recent Posts</h3>
            <StyledLinkList>
              <li>
                <a href="#">Latest News</a>
              </li>
              <li>
                <a href="#">Product Updates</a>
              </li>
              <li>
                <a href="#">Customer Stories</a>
              </li>
            </StyledLinkList>
          </FooterColumn>
          <FooterColumn>
            <h3>Super Links</h3>
            <StyledLinkList>
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
            </StyledLinkList>
          </FooterColumn>
        </FooterContentWrapper>
      </FooterContainer>
      <CopyrightText>
        &copy; {currentYear} Miruro no Kuon. All Rights Reserved.
      </CopyrightText>
      <DisclaimerText>
        This site does not store any files on its server. All contents are
        provided by non-affiliated third parties.
      </DisclaimerText>
    </PageWrapper>
  );
}

export default Footer;
