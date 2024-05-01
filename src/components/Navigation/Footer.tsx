import styled from 'styled-components';
import { FaReddit, FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { year } from '../../hooks/useTIme';

const PageWrapper = styled.div`
  margin-top: 2rem;
  @media (max-width: 1000px) {
    padding: 0 0.5rem;
  }
`;

const FooterBaseContainer = styled.footer<{ $isSub: boolean }>`
  color: var(--global-text);
  padding: ${({ $isSub }) => ($isSub ? '0' : '0.5rem 0')};
  display: flex;
  justify-content: space-between;
  border-top: ${({ $isSub }) => ($isSub ? '0.125rem solid' : 'none')}
    var(--global-secondary-bg);
  flex-direction: column;

  @media (max-width: 1000px) {
    padding: ${({ $isSub }) => ($isSub ? '0 0 1rem 0' : '0.5rem 0')};
  }

  @media (min-width: 601px) {
    flex-direction: row;
  }

  @media (max-width: 600px) {
    padding: ${({ $isSub }) => ($isSub ? '0' : '0.5rem 0')};
  }
`;

const StyledLinkList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  margin-top: auto;
`;

const FooterLink = styled(Link)`
  align-items: center;
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

  &:hover,
  &:active,
  &:focus {
    color: var(--global-button-text);
  }
`;

const SocialIconsWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const FooterLogoImage = styled.img`
  content: var(--logo-transparent);
  max-width: 4rem;
  height: 4.375rem;
`;

const Text = styled.div<{ $isSub: boolean }>`
  color: grey;
  font-size: ${({ $isSub }) => ($isSub ? '0.75rem' : '0.65rem')};
  margin: ${({ $isSub }) => ($isSub ? '1rem 0 0 0' : '1rem 0')};
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

  &:hover,
  &:active,
  &:focus {
    transform: scale(1.15);
    color: var(--global-button-text);
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

export function Footer() {
  return (
    <PageWrapper>
      <footer>
        <FooterBaseContainer aria-label='Main Footer' $isSub={false}>
          <Text as='p' $isSub={false}>
            <FooterLogoImage alt='Footer Logo' /> <br />
            This website does not retain any files on its server. Rather, it
            solely provides links to media content hosted by third-party
            services.
          </Text>
          <StyledLinkList aria-label='Footer Links'>
            <FooterLink to='/about' title='About Us'>
              About
            </FooterLink>
            <FooterLink
              to='https://www.miruro.com'
              target='_blank'
              title='Domains'
            >
              Domains
            </FooterLink>
            <FooterLink to='/pptos' title='Privacy Policy and Terms of Service'>
              Privacy & ToS
            </FooterLink>
            <FooterLink
              to='https://ko-fi.com/yourdev'
              target='_blank'
              title='Donate to Us'
            >
              Donate {'<3'}
            </FooterLink>
          </StyledLinkList>
        </FooterBaseContainer>
        <FooterBaseContainer aria-label='Sub Footer' $isSub={true}>
          <Text as='p' $isSub={true}>
            &copy; {year}{' '}
            <a
              href='https://www.miruro.com'
              rel='noopener noreferrer'
              style={{ color: 'grey' }}
            >
              miruro.com
            </a>{' '}
            | Website Made by <strong>Miruro no Kuon</strong>
          </Text>
          <nav aria-label='Social Links'>
            <SocialIconsWrapper>
              {[
                {
                  href: 'https://www.reddit.com/r/miruro',
                  Icon: FaReddit,
                  label: 'Reddit',
                },
                {
                  href: 'https://discord.gg/4kfypZ96K4',
                  Icon: FaDiscord,
                  label: 'Discord',
                },
                {
                  href: 'https://twitter.com/miruro_official',
                  Icon: FaTwitter,
                  label: 'Twitter',
                },
              ].map(({ href, Icon, label }) => (
                <ShareButton
                  key={href}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`Miruro on ${label}`}
                >
                  <Icon aria-hidden='true' />
                </ShareButton>
              ))}
            </SocialIconsWrapper>
          </nav>
        </FooterBaseContainer>
      </footer>
    </PageWrapper>
  );
}
