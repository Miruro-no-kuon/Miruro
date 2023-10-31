import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
  }
  
  /* Selection styling */
  ::selection {
	color: #000;
	background-color: #fff;
  }
  
  /* Body and general styles */
  body {
	background-color: #0a0a0a;
	font-family: "Gilroy-Regular", sans-serif;
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	-webkit-tap-highlight-color: transparent;
  }
  
  /* Root container */
  body > #root {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
  }
  
  /* Placeholder text */
  ::placeholder {
	color: #ccc;
	opacity: 0.3;
  }
  
  /* Scrollbar styles (cross-browser) */
  /* Firefox */
  * {
	scrollbar-width: thin;
	scrollbar-color: #4f4f4f #141414;
  }
  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
	width: 10px;
  }
  *::-webkit-scrollbar-track {
	background: #141414;
  }
  *::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: rgb(59, 64, 67);
	border-color: rgb(48, 52, 54);
  }
  .swiper-scrollbar-drag {
	height: 100%;
	width: 100%;
	position: relative;
	background: rgb(51, 55, 58);
	border-radius: 10px;
	left: 0;
	top: 0;
  }
  .swiper-pagination-bullet-active {
	background-color: #ffffff !important;
  }
  .swiper-pagination-bullet {
	background-color: #404040;
	@media screen and (max-width: 600px) {
	  width: 0.4rem;
	  height: 0.4rem;
	}
  }
  .swiper-button-next,
  .swiper-button-prev {
	color: #ffffff !important;
	padding-bottom: 20px;
  }
  .swiper-wrapper {
	padding-bottom: 30px;
	@media screen and (max-width: 600px) {
	  padding-bottom: 40px;
	}
  }
  .swiper-container-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-custom,
  .swiper-pagination-fraction {
	bottom: 0px !important;
  }
  @media only screen and (max-width: 600px) {
	.plyr button {
	  font-size: 0.8rem;
	}
  }
  /* Prevent image dragging and text selection */
  img {
	user-drag: none;
	user-select: none;
	-moz-user-select: none;
	-webkit-user-drag: none;
	-webkit-user-select: none;
	-ms-user-select: none;
  }
  
  /* Apply hover effect to elements with the 'card-img' class */
  .card-img {
	transform: scale(0.96);
	transition: 0.2s;
  }
  .card-img:hover {
	transform: scale(1);
  }
  
  /* Apply hover effect to elements with the 'skip-button' class */
  .skip-button {
	padding: 0.3rem 1rem;
	position: absolute;
	top: -1.5rem;
	right: 3rem;
	border-radius: 0.3rem;
	border: 1px solid rgba(255, 255, 255, 0.4);
	outline: none;
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.6);
	color: #fff;
  }
  .skip-button:hover {
	background-color: rgba(0, 0, 0, 0.7);
  }
  
  /* Apply hover effect to elements with the 'carousel-button' class */
  .carousel-button:hover {
	text-decoration: none;
	transform: scale(1.04);
	background-color: rgba(0, 0, 0, 0.7);
  }
  
  /* Apply hover effect to elements with the 'details-button' class */
  .details-button {
	transform: scale(0.94);
  }
  .details-button:hover {
	transform: scale(0.98);
	background-color: rgb(155, 0, 59);
	color: #fff;
  }
  
  /* Apply hover effect to elements with the 'button-episode-link' class */
  .button-episode-link:hover {
	background-color: #202020;
  }
  
  .margin {
	margin-bottom: 2rem;
  }
  `;

export default GlobalStyle;
