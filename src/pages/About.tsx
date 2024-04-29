import styled from 'styled-components';
import { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
const SplashContainer = styled.div`
  margin-top: -2rem;
`;

const Keyword = styled.span`
  font-weight: bold;
  color: var(--your-custom-color);
  position: relative;
  margin-right: 0.2rem;

  ::before {
    content: '\u25A0';
    font-size: 0.8rem;
    position: absolute;
    top: 0;
    left: -0.5rem;
    color: var(--your-custom-color);
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--global-text);
`;

const MainContent = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  padding: 1rem;
  color: var(--global-text);
  font-size: 1rem;
  line-height: 1.6;
`;

const sections = [
  {
    title: 'About',
    title2: "What's Miruro?",
    content: (
      <Paragraph>
        Miruro is an anime streaming site where you can watch anime online in HD
        quality with English subtitles or dubbing. You can also download any
        anime you want without registration.
      </Paragraph>
    ),
  },
  {
    title2: 'Is Miruro safe?',
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
    title2: 'Why Miruro?',
    content: (
      <>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Content Library:
          </strong>{' '}
          We have a vast collection of both old and new anime, making us one of
          the largest anime libraries on the web.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Streaming Experience:
          </strong>{' '}
          Enjoy <Keyword>fast and reliable</Keyword> streaming with our{' '}
          <Keyword>top-of-the-line servers</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Quality/Resolution:
          </strong>{' '}
          Our videos are available in <Keyword>high resolution</Keyword>, and we
          offer quality settings to suit your internet speed.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Frequent Updates:
          </strong>{' '}
          Our content is updated hourly to provide you with the{' '}
          <Keyword>latest releases</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> User-Friendly Interface:
          </strong>{' '}
          We focus on <Keyword>simplicity and ease of use</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Device Compatibility:
          </strong>{' '}
          Miruro works seamlessly on both{' '}
          <Keyword>desktop and mobile devices</Keyword>.
        </Paragraph>
        <Paragraph>
          <strong>
            <FaCheckCircle /> Community:
          </strong>{' '}
          Join our active <Keyword>community of anime lovers</Keyword>.
        </Paragraph>
      </>
    ),
  },
];

function About() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'About | Miruro'; // Set the title when the component mounts
    return () => {
      // Reset the title to the previous one when the component unmounts
      document.title = previousTitle;
    };
  }, []);

  return (
    <SplashContainer>
      <MainContent>
        <br />
        {sections.map((section, index) => (
          <span key={index}>
            {section.title && <h1 className='title-style'>{section.title}</h1>}
            {section.title2 && (
              <h3 className='title-style'>{section.title2}</h3>
            )}
            {section.content}
          </span>
        ))}
      </MainContent>
    </SplashContainer>
  );
}

export default About;
