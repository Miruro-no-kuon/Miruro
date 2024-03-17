import React from 'react';
import styled from "styled-components";


interface EmbeddedVideoPlayerProps {
  src: string;
}

const Container = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio (height / width * 100) */
  position: relative;
  @media (max-width: 1000px) {
    padding-bottom:16rem; /* Adjust aspect ratio for smaller screens */
  }
`;

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--global-border-radius);

`;


const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({ src }) => {
  return (
    <Container>
      <Iframe
        src={src}
        frameBorder="0"
        allowFullScreen
      ></Iframe>
    </Container>
  );
};

export default EmbeddedVideoPlayer;
