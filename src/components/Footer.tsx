import React from "react";
import styled from "styled-components";
import { FaReddit, FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";

const theme = {
  primaryBackgroundColor: "var(--global-secondary-bg)",
  textColor: "var(--global-text)",
  buttonTextColor: "var(--global-button-text)",
  footerLogo: "var(--logo-transparent)",
};

const PageWrapper = styled.div`
  padding: 1rem;
  margin-top: 1.5em;
`;

const FooterContainer = styled.footer`
  color: ${theme.textColor};
  padding: 0;
  margin: 0.5rem 0;
  border-top: 0.125rem solid ${theme.primaryBackgroundColor};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SocialIconsWrapper = styled.div`
  display: flex;
  margin-top: 4rem;
  gap: 0.5rem;
  justify-content: center;

  a {
    color: ${theme.textColor};
    text-decoration: none;
    font-size: 1rem;
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
  top: -3rem;
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

const FooterLinks = styled.div`
  font-weight: bold;
  padding: 1rem;

  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const CopyrightText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
  border-top: 0.0625rem solid ${theme.primaryBackgroundColor};
`;

const DisclaimerText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  margin: 0;
  padding-top: 0.5rem;
`;

const ShareButton = styled.a`
  display: inline-block;
  color: inherit;
  text-decoration: none;

  svg {
    font-size: 1.1rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    transform: scale(1.15);
  }
`;

const currentYear = new Date().getFullYear();

const StyledLinkList = styled.div`
  display: flex;
  padding: 0;
  padding-bottom: 2rem;
  margin: 0;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  a {
    color: ${theme.textColor};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.buttonTextColor};
      text-decoration: underline;
    }
  }
`;

function Footer() {
  return (
    <PageWrapper>
      <FooterContainer>
        <SocialIconsWrapper>
          <ShareButton
            href="https://twitter.com/miruro_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </ShareButton>
          <ShareButton
            href="https://discord.gg/4kfypZ96K4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </ShareButton>
          <ShareButton
            href="https://github.com/Miruro-no-kuon/Miruro-no-Kuon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </ShareButton>
          <ShareButton
            href="https://www.reddit.com/r/miruro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaReddit />
          </ShareButton>
        </SocialIconsWrapper>
        <FooterLogoImage src={theme.footerLogo} alt="Footer Logo" />
        <FooterLinks>
          <StyledLinkList>
            <a href="Info">FAQ</a>
            <a href="Info">Policy</a>
            <a href="Info">Terms</a>
          </StyledLinkList>
        </FooterLinks>
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
