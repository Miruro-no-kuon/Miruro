import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaUser,
  FaStar,
  FaComments,
  FaInfoCircle,
  FaEnvelope,
  FaReddit,
  FaDiscord,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import BannerImageURL from "/src/assets/banner-one_piece-compressed.jpg";
import LogoURL from "/src/assets/miruro-text-transparent-white.png";

const colors = {
  textColor: "var(--global-text)",
  buttonBackground: "var(--global-button-bg)",
  buttonText: "var(--global-button-text)",
  buttonHoverBackground: "var(--global-button-hover-bg)",
  adBackground: "var(--global-ad-bg)",
  customColor: "var(--your-custom-color)",
  paddingSize: "1.5rem",
};

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popInAnimation = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.075);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const SplashContainer = styled.div`
  margin-top: -2rem;
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 50rem;
  margin: 4rem auto 0 auto;
  border-radius: 0.2rem;
  overflow: hidden;
  box-shadow: 0 0 1rem var(--global-card-shadow);
  animation: ${fadeInAnimation} 0.5s ease-in-out;

  @media (min-width: 62.5rem) {
    flex-direction: row;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--global-filter);
    z-index: 0;
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${BannerImageURL});
  background-size: cover;
  background-position: left;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Content = styled.div`
  flex: 1;
  padding: ${colors.paddingSize};
  color: #e8e8e8;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 5rem 0;
  font-weight: bold;
`;

const SplashLogo = styled.img`
  max-width: 13rem;
`;

const ContentWrapper = styled.div``;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0.5rem;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  background-color: ${colors.buttonBackground};
  color: ${colors.buttonText};
  text-decoration: none;
  border-radius: 2rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.075);
  }
`;

const Keyword = styled.span`
  font-weight: bold;
  color: ${colors.customColor};
  position: relative;
  margin-right: 0.2rem;

  ::before {
    content: "\u25A0";
    font-size: 0.8rem;
    position: absolute;
    top: 0;
    left: -0.5rem;
    color: ${colors.customColor};
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  margin-bottom: ${colors.paddingSize};
  line-height: 1.6;
  color: ${colors.textColor};
`;

const MainContent = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  padding: ${colors.paddingSize};
  color: ${colors.textColor};
  font-size: 1rem;
  line-height: 1.6;
`;

const Advertising = styled.div`
  margin: ${colors.paddingSize} 0;
  text-align: center;
  background-color: ${colors.adBackground};
  padding: ${colors.paddingSize};
  border-radius: 0.2rem;
  color: ${colors.textColor};
  background-image: url("/src/assets/advertisement.jpg");
  background-size: cover;
  background-position: center;
`;

const ShareSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${colors.paddingSize} 0;
  padding: ${colors.paddingSize};
  background-color: ${colors.adBackground};
  border-radius: 0.2rem;
  color: ${colors.textColor};
  text-align: center;
`;

const ShareText = styled.span`
  text-align: left;
  font-size: 1rem;
  color: var(--global-text);

  svg {
    margin-right: 0.5rem;
  }
`;

const ShareButtons = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  background: var(--global-primary-bg);
  max-width: 10rem;
  text-align: center;
  border-radius: 0.2rem;
  padding: 0.5rem;
  margin: 0.5rem;

  & > * {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.3);
    }
  }
`;

const ShareButton = styled.a`
  margin: 0 8px;
  display: inline-block;
  color: inherit;
  text-decoration: none;

  svg {
    font-size: 1.2rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    transform: scale(1.35);
  }
`;

const StyledLink = styled.a`
  color: ${colors.customColor};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: ${colors.customColor};
  }
`;

const sections = [
  {
    title: "What's Miruro?",
    content: (
      <Paragraph>
        Miruro is an anime streaming site where you can watch anime online in HD
        quality with English subtitles or dubbing. You can also download any
        anime you want without registration.
      </Paragraph>
    ),
  },
  {
    title: "Is Miruro safe?",
    content: (
      <Paragraph>
        Yes. We started this site to improve UX and are committed to keeping our
        users safe. We encourage all our users to notify us if anything looks
        suspicious. Please understand that we do have to run advertisements to
        maintain the site.
      </Paragraph>
    ),
  },
  {
    title: "Why Miruro?",
    content: (
      <>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Content Library:
          </strong>{" "}
          We have a vast collection of both old and new anime, making us one of
          the largest anime libraries on the web.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Streaming Experience:
          </strong>{" "}
          Enjoy <Keyword>fast and reliable</Keyword> streaming with our{" "}
          <Keyword>top-of-the-line servers</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Quality/Resolution:
          </strong>{" "}
          Our videos are available in <Keyword>high resolution</Keyword>, and we
          offer quality settings to suit your internet speed.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Frequent Updates:
          </strong>{" "}
          Our content is updated hourly to provide you with the{" "}
          <Keyword>latest releases</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> User-Friendly Interface:
          </strong>{" "}
          We focus on <Keyword>simplicity and ease of use</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Device Compatibility:
          </strong>{" "}
          Miruro works seamlessly on both{" "}
          <Keyword>desktop and mobile devices</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Community:
          </strong>{" "}
          Join our active <Keyword>community of anime lovers</Keyword>.
        </Paragraph>
      </>
    ),
  },
  {
    title: "How to Use Miruro",
    content: (
      <>
        <Paragraph>
          To start using Miruro and enjoy anime streaming, follow these simple
          steps:
        </Paragraph>
        <ol>
          <li>
            Visit the Miruro website by clicking on the "Go to homepage" button
            above.
          </li>
          <li>
            Browse through our extensive collection of anime titles and select
            the one you want to watch.
          </li>
          <li>
            Choose your preferred streaming quality and language (subtitles or
            dubbing).
          </li>
          <li>Click on the play button to start watching your chosen anime.</li>
          <li>
            Feel free to explore other features, such as downloading episodes
            and joining our anime-loving community.
          </li>
        </ol>
        <Paragraph>
          That's it! You're now ready to embark on an exciting anime viewing
          journey with Miruro.
        </Paragraph>
      </>
    ),
  },
  {
    title: "Additional Information",
    content: (
      <>
        <Paragraph>
          We are continuously working to improve Miruro and provide you with the
          best anime streaming experience. Here are some additional details:
        </Paragraph>
        <ul>
          <li>
            <FaUser /> <strong>User Profiles:</strong> Create your own user
            profile and personalize your anime watching experience.
          </li>
          <li>
            <FaStar /> <strong>Rating System:</strong> Rate and review your
            favorite anime series and episodes.
          </li>
          <li>
            <FaComments /> <strong>Community Chat:</strong> Join discussions and
            chat with other anime enthusiasts.
          </li>
          <li>
            <FaInfoCircle /> <strong>FAQ:</strong> Find answers to common
            questions in our FAQ section.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "Contact Us",
    content: (
      <>
        <Paragraph>
          If you have any questions, suggestions, or encounter any issues while
          using Miruro, please don't hesitate to contact us. We value your
          feedback and are here to assist you. You can reach out to us through
          multiple channels:
        </Paragraph>
        <ul>
          <li>
            <FaEnvelope /> Email us at{" "}
            <StyledLink
              href="mailto:miruro@proton.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              miruro@proton.me
            </StyledLink>
          </li>
          <li>
            <FaDiscord /> Join our{" "}
            <StyledLink
              href="https://discord.gg/4kfypZ96K4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord server
            </StyledLink>{" "}
            for live discussions and support.
          </li>
          <li>
            <FaReddit /> Visit our{" "}
            <StyledLink
              href="https://www.reddit.com/r/miruro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subreddit
            </StyledLink>{" "}
            for community support and information.
          </li>
        </ul>
      </>
    ),
  },
];

function Splash() {
  return (
    <SplashContainer>
      <Card>
        <BannerImage />
        <Content>
          <Title>
            <SplashLogo src={LogoURL} alt="Footer Logo" />
          </Title>
          <ContentWrapper>
            <Button to="/home">
              Go to homepage <FaArrowRight />
            </Button>
            <Subtitle>
              <Keyword>Miruro no Kuon</Keyword>: Where Every Moment is an{" "}
              <Keyword>Eternal Adventure</Keyword>
            </Subtitle>
          </ContentWrapper>
        </Content>
      </Card>
      <MainContent>
        <ShareSection>
          <ShareText>
            <FaInfoCircle />
            If you enjoy what you're seeing, we'd be thrilled if you could share
            it with your friends and family. Your support is not just
            appreciated; it's essential in helping us grow and continue bringing
            you the best content. By sharing, you become a vital part of our
            community's journey. And don't forget to follow us on our socials!
            It's the best way to stay connected and up-to-date with all the
            latest news, updates, and exclusive content. Your engagement and
            feedback fuel our passion and drive us to innovate. Thank you for
            being with us every step of the way!
          </ShareText>
          <ShareButtons>
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
          </ShareButtons>
        </ShareSection>
        {sections.map((section, index) => (
          <div key={index}>
            {section.title && (
              <>
                <Advertising>* Advertisements here *</Advertising>
                <strong>{section.title}</strong>
              </>
            )}
            {section.content}
          </div>
        ))}
      </MainContent>
    </SplashContainer>
  );
}

export default Splash;
