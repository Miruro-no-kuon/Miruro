import styled from "styled-components";
import { FaReddit, FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const theme = {
  primaryBackgroundColor: "var(--global-secondary-bg)",
  textColor: "var(--global-text)",
  buttonTextColor: "var(--global-button-text)",
  footerLogo: "var(--logo-transparent)",
};

const PageWrapper = styled.div`
  padding: 1rem;
  padding-bottom: 0rem;
  margin-top: 1.5rem;
`;

const FooterContainer = styled.footer`
  color: ${theme.textColor};
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-top: 0.125rem solid ${theme.primaryBackgroundColor};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 550px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StyledLinkList = styled.div`
  display: flex;
  gap: 1rem;
  margin: auto; /* Center the content horizontally */
`;

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const FooterLink = styled(Link)`
  padding-top: 1rem;
  color: grey;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;

  &:hover {
    color: ${theme.buttonTextColor};
    transform: scale(1.1);
    text-decoration: underline;
  }
`;

const SocialIconsWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const FooterLogoImage = styled.img`
  max-width: 3rem;
  content: ${theme.footerLogo};
  height: auto;
`;

const CopyrightText = styled.p`
  text-align: center;
  color: grey;
  font-size: 0.8rem;
  margin: 0;
`;

const DisclaimerText = styled.p`
  padding-top: 1rem;
  text-align: center;
  color: grey;
  font-size: 0.8rem;
  margin: 0;
`;

const ShareButton = styled.a`
  display: inline-block;
  color: grey;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;

  svg {
    font-size: 1.4rem;
  }

  &:hover {
    transform: scale(1.25);
    color: ${theme.buttonTextColor};
    text-decoration: underline;
  }
`;

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <PageWrapper>
      <FooterContainer>
        <CopyrightText>
          <FooterLogoImage src={theme.footerLogo} alt="Footer Logo" />
          <br></br>
          &copy; {currentYear} Miruro no Kuon.
        </CopyrightText>
        <StyledLinkList>
          <FooterLink to="About" onClick={scrollToTop}>
            About
          </FooterLink>
          <FooterLink to="Policy" onClick={scrollToTop}>
            Policy
          </FooterLink>
          <FooterLink to="Terms" onClick={scrollToTop}>
            Terms
          </FooterLink>
        </StyledLinkList>
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
      </FooterContainer>
      <DisclaimerText>
        This site does not store any files on its server.
      </DisclaimerText>
    </PageWrapper>
  );
}

export default Footer;
