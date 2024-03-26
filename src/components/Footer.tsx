import styled from "styled-components";
import { FaReddit, FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const PageWrapper = styled.div`
  padding: 0 1rem;
  margin-top: 2rem;
`;

const FooterBaseContainer = styled.footer<{ $isSub: boolean }>`
  color: var(--global-text);
  padding: ${({ $isSub }) => ($isSub ? "0" : "0.5rem 0")};
  display: flex;
  justify-content: space-between;
  border-top: ${({ $isSub }) => ($isSub ? "0.125rem solid" : "none")}
    var(--global-secondary-bg);
  flex-direction: column;

  @media (max-width: 1000px) {
    padding: ${({ $isSub }) => ($isSub ? "0 0 1rem 0" : "0.5rem 0")};
  }

  @media (min-width: 601px) {
    flex-direction: row;
  }

  @media (max-width: 600px) {
    padding: ${({ $isSub }) => ($isSub ? "0" : "0.5rem 0")};
  }
`;

const StyledLinkList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  margin-top: auto;
`;

const FooterLink = styled(Link)`
  padding: 0.5rem 0;
  color: grey;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  bottom: 0;
  align-self: auto;

  @media (min-width: 601px) {
    align-self: end;
  }

  &:hover {
    color: var(--global-button-text);
  }
`;

const SocialIconsWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const FooterLogoImage = styled.img.attrs({
  alt: "Footer Logo",
})`
  content: var(--logo-transparent);
  max-width: 4rem;
  height: auto;
`;

const Text = styled.div<{ $isSub: boolean }>`
  color: grey;
  font-size: ${({ $isSub }) => ($isSub ? "0.75rem" : "0.65rem")};
  margin: ${({ $isSub }) => ($isSub ? "1rem 0 0 0" : "1rem 0")};
  max-width: 25rem;

  strong {
    color: var(--global-text);
  }
`;

const ShareButton = styled.a`
  display: inline-block;
  color: grey;
  transition: 0.2s ease-in-out;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    transform: scale(1.15);
    color: var(--global-button-text);
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

function Footer() {
  return (
    <PageWrapper>
      <FooterBaseContainer $isSub={false}>
        <Text $isSub={false}>
          <FooterLogoImage /> <br />
          This site does not store any files on our server, we only link to the
          media which is hosted on 3rd party services.
        </Text>
        <StyledLinkList>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/pptos">Privacy & ToS</FooterLink>
          <FooterLink to="/donate">🤍 Donate</FooterLink>
        </StyledLinkList>
      </FooterBaseContainer>
      <FooterBaseContainer $isSub={true}>
        <Text $isSub={true}>
          &copy; {currentYear} miruro.tv | Website Made by{" "}
          <strong>Miruro no Kuon</strong>
        </Text>
        <SocialIconsWrapper>
          {[
            { href: "https://twitter.com/miruro_official", Icon: FaTwitter },
            { href: "https://discord.gg/4kfypZ96K4", Icon: FaDiscord },
            {
              href: "https://github.com/Miruro-no-kuon/Miruro",
              Icon: FaGithub,
            },
            { href: "https://www.reddit.com/r/miruro", Icon: FaReddit },
          ].map(({ href, Icon }) => (
            <ShareButton
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </ShareButton>
          ))}
        </SocialIconsWrapper>
      </FooterBaseContainer>
    </PageWrapper>
  );
}

export default Footer;
