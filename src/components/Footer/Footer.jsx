import React from "react";
import logo2 from '/src/assets/logo2.png';
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
  SectionHeading,
  Copyright, // New style for section headings
} from "./FooterStyles";

const Footer = () => {
  return (
    <Box>
      <Container>
        <Row>
          <Column>
            <img
              src={logo2}
              width="130"
            />
            <Heading>MIRURO</Heading>
          </Column>
          <Column>
            <SectionHeading>Navigation</SectionHeading>
            <FooterLink href="/popular">Popular</FooterLink>
            <FooterLink href="/trending">Trending</FooterLink>
            <FooterLink href="/top100">Top 100</FooterLink>
          </Column>
          <Column>
            <SectionHeading>Legal</SectionHeading>
            <FooterLink href="https://github.com/akionii">Staff</FooterLink>
            <FooterLink href="https://akionii.github.io/Miruro/docs/pages/ToS.html">
              Terms
            </FooterLink>
            <FooterLink href="https://akionii.github.io/Miruro/docs/pages/Privacy.html">
              Privacy
            </FooterLink>
          </Column>
          <Column>
            <SectionHeading>Connect</SectionHeading>
            <FooterLink href="https://discord.gg">Discord</FooterLink>
            <FooterLink href="#">We're Hiring!</FooterLink>
            <FooterLink href="https://www.patreon.com/Miruro">
              Support
            </FooterLink>
          </Column>
        </Row>
      </Container>
      <Copyright>
        <p>
          Copyright © Miruro All Rights Reserved.
          <br />
          This site does not store any files on its server. All contents are
          provided by non-affiliated third parties.
        </p>
      </Copyright>
    </Box>
  );
};

export default Footer;
