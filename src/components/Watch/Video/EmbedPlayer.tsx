import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Iframe = styled.iframe`
  border-radius: var(--global-border-radius);
  border: none;
  min-height: 16.24rem;
`;

const EmbedPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Container>
      <Iframe src={src} allowFullScreen />
    </Container>
  );
};

export default EmbedPlayer;
