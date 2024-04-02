import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 0;
  aspect-ratio: 16 / 9;
  padding-bottom: 56.25%; /* 16:9 aspect ratio (height / width * 100) */
  margin: 0;
`;

const Iframe = styled.iframe`
  border-radius: var(--global-border-radius);
  border: none;
`;

const EmbedPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Container>
      <Iframe src={src} allowFullScreen />
    </Container>
  );
};

export default EmbedPlayer;
