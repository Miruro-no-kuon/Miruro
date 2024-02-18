import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
const colors = {
  textColor: "var(--global-text)",
  buttonBackground: "var(--global-button-bg)",
  buttonText: "var(--global-button-text)",
  buttonHoverBackground: "var(--global-button-hover-bg)",
  adBackground: "var(--global-ad-bg)",
  customColor: "var(--your-custom-color)",
  paddingSize: "1.5rem",
};

const StyledLink = styled.a`
  color: #744aff;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const SplashContainer = styled.div`
  margin-top: -2rem;
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

const sections = [
  {
    title: "Privacy Policy",
    content: (
      <Paragraph>
        <strong>Data Collection</strong>: We collect minimal user data necessary
        for the functioning of Miruro, such as account information and user
        preferences.
        <br></br>
        <br></br>
        <strong>Use of Data</strong>: The data collected is used to improve
        service quality and user experience. We do not share personal data with
        third parties except as required by law.
        <br></br>
        <br></br>
        <strong>Cookies and Tracking</strong>: Miruro uses cookies and similar
        tracking technologies to enhance the user experience like caching video
        timestamps and tracking watched content.
        <br></br>
        <br></br>
        <strong>Third-Party Services</strong>: Embedded videos from third-party
        sites may have their own privacy policies, and we advise users to read
        these policies on the respective sites.
        <br></br>
        <br></br>
        <strong>Security</strong>: We are committed to ensuring your data is
        secure but remind users that no method of transmission over the Internet
        is 100% secure.
        <br></br>
        <br></br>
        <strong>Changes to Privacy Policy</strong>: We may update our Privacy
        Policy from time to time. We will notify users of any changes by posting
        the new policy on this page.
        <br></br>
        <br></br>
        <strong>Contact Us</strong>: If you have any questions about these
        terms, please contact us at{" "}
        <StyledLink href="mailto:miruro@proton.me">
          miruro@proton.me.
        </StyledLink>
      </Paragraph>
    ),
  },
  {
    title: "Terms of Service",
    content: (
      <Paragraph>
        <strong>Acceptance of Terms</strong>: By using Miruro, you agree to
        these Terms of Service and acknowledge that they affect your legal
        rights and obligations.
        <br></br>
        <br></br>
        <strong>Content</strong>: Miruro does not host video content but embeds
        videos from various third-party sources. We are not responsible for the
        content, quality, or the policies of these external sites.
        <br></br>
        <br></br>
        <strong>Use of Site</strong>: The service is provided "as is" and is
        used at the user’s own risk. Users must not misuse the service in any
        way that breaches laws or regulations.
        <br></br>
        <br></br>
        <strong>User Content</strong>: Users may share content, such as comments
        or reviews, responsibly. We reserve the right to remove any content that
        violates our policies or is deemed inappropriate.
        <br></br>
        <br></br>
        <strong>Intellectual Property</strong>: The intellectual property rights
        of the embedded videos remain with their respective owners. Miruro
        respects these rights and does not claim ownership of this content.
        <br></br>
        <br></br>
        <strong>Changes to Terms of Service</strong>: We reserve the right to
        modify these terms at any time. Continued use of the site after changes
        constitutes acceptance of the new terms.
        <br></br>
        <br></br>
        <strong>Termination</strong>: We may terminate or suspend access to our
        service immediately, without prior notice, for any breach of these
        Terms.
      </Paragraph>
    ),
  },
  {
    title: "FAQ",
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
    title2: "Is Miruro safe?",
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
    title2: "Why Miruro?",
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
];

function Info() {
  return (
    <SplashContainer>
      <MainContent>
        <br />
        {sections.map((section, index) => (
          <div key={index}>
            {section.title && <h1 className="title-style">{section.title}</h1>}
            {section.title2 && (
              <h2 className="title-style">{section.title2}</h2>
            )}
            {section.content}
          </div>
        ))}
      </MainContent>
    </SplashContainer>
  );
}

export default Info;
