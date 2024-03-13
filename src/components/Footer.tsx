import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaReddit, FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";

// Styled components
const Wrapper = styled.div`
  padding-bottom: 0;
  margin-top: 1.5rem;
  transition: 0.1s ease-in-out;

  @media (max-width: 1000px) {
    padding: 1rem;
  }
`;

const Container = styled.footer`
  color: var(--global-text);
  padding: 1rem 0;
  border-top: 0.125rem solid var(--global-secondary-bg);
  display: flex;
  flex-direction: column;
`;

const FooterLogoImage = styled.img`
  width: 5rem;
  content: var(--logo-transparent);
  margin: 0 0 0.5rem -0.25rem;
  height: auto;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0 0;
`;

const FooterLink = styled(Link)`
  color: grey;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.05s ease-in-out;

  &:hover {
    color: var(--global-text);
  }
`;

const SocialMediaWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  margin-bottom: -1.5rem;
  @media (max-width: 1000px) {
    margin-bottom: -0.5rem;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HighLight = styled.p`
  color: var(--global-text);
  font-weight: 500;
  display: inline;
  font-size: 0.7rem;
`;

const Text = styled.div`
  color: grey;
  font-size: 0.7rem;
  margin: 0;
`;

const SubText = styled(Text)`
  font-size: 0.6rem;
`;

const IconButton = styled.a`
  display: inline-block;
  color: grey;
  text-decoration: none;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

  svg {
    font-size: 1.4rem;
  }

  &:hover {
    transform: scale(1.15);
    color: var(--global-text);
  }
`;

// Footer component
function Footer() {
  return (
    <Wrapper>
      <Container>
        <FooterLogoImage alt="Footer Logo" />
        <TextGroup>
          <SubText>
            This site does not store any files on our server, we only link to
            media hosted on third-party services.
          </SubText>
        </TextGroup>
        <LinkContainer>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/pptos">Privacy Policy</FooterLink>
          <FooterLink to="/pptos">Terms of Service</FooterLink>
        </LinkContainer>
        <LinkContainer>
          <FooterLink to="/home">Home</FooterLink>
        </LinkContainer>
      </Container>
      <Container>
        <Text>
          &copy; {new Date().getFullYear()} miruro.tv | Website Made by{" "}
          <HighLight>Miruro no Kuon</HighLight>{" "}
        </Text>

        <SocialMediaWrapper>
          <IconButton
            href="https://twitter.com/miruro_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </IconButton>
          <IconButton
            href="https://discord.gg/4kfypZ96K4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </IconButton>
          <IconButton
            href="https://github.com/Miruro-no-kuon/Miruro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </IconButton>
          <IconButton
            href="https://www.reddit.com/r/miruro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaReddit />
          </IconButton>
        </SocialMediaWrapper>
      </Container>
    </Wrapper>
  );
}

export default Footer;
