import React from "react";
import styled from "styled-components";
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "./FooterStyles";

const Footer = () => {
return (
	<Box>
	<Container>
		<Row>
		<Column>
		<img src="https://cdn.discordapp.com/attachments/985501610455224389/1041882683166445699/logo2.png" width="130" alt="Akio"></img>
		
		<Heading>MIRURO</Heading>
		</Column>
		<Column>
			<Heading>  </Heading>
			<FooterLink href="/trending">Trending</FooterLink>
			<FooterLink href="/popular">Popular</FooterLink>
			<FooterLink href="/favourites">Favourites</FooterLink>
		</Column>
		<Column>
			<Heading>  </Heading>
			<FooterLink href="https://github.com/akionii">Staff</FooterLink>
			<FooterLink href="https://akionii.github.io/Miruro/docs/pages/ToS.html">Terms</FooterLink>
			<FooterLink href="https://akionii.github.io/Miruro/docs/pages/Privacy.html">Privacy</FooterLink>
		</Column>
		<Column>
			<Heading>  </Heading>
			<FooterLink href="https://discord.gg/muuZnh9y">Discord</FooterLink>
			<FooterLink href="#">We're Hiring!</FooterLink>
			<FooterLink href="https://www.patreon.com/akionii">Support</FooterLink>
		</Column>
		</Row>
	</Container>
	{/* <p>
			Copyright © Miruro All Rights Reserved.
			<br></br>
			This site does not store any files on its server. All contents are provided by non-affiliated third parties
	</p> */}
	</Box>
);
};

export default Footer;