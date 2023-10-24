import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	::selection {
		color: #000000;
		background-color: #ffffff; 
 	}
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	body {
		background-color: rgb(10, 10, 10);
		font-family: 'Gilroy-Regular', sans-serif;
			user-select: none;
			-webkit-user-select: none; /* Safari 3.1+ */
			-moz-user-select: none; /* Firefox 2+ */
			-ms-user-select: none; /* IE 10+ */
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                        -webkit-tap-highlight-color: transparent;
	}
	body > #root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	::placeholder {
		color: #ccc;
		opacity: 0.3;
	}
	/* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #4F4F4F #141414;
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
    background-color: #FFFFFF !important;
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
    	color: #FFFFFF !important;
		padding-bottom: 20px;
	}
	.swiper-wrapper{
		padding-bottom: 30px;
		@media screen and (max-width: 600px) {
			padding-bottom: 40px;
		}
	}
	.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{
    bottom: 0px !important;
	}
	@media only screen and (max-width: 600px) {
		.plyr button {
			font-size: 0.8rem;
		}
	}
	img {  
		user-drag: none;  
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	 }
	
	.card-img {
		transition: 0.3s;
	}
	.card-img:hover {
		transform: scale(0.95);
	  }
	 
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
		color: #FFFFFF;
	}
	.carousel-button:hover {
		text-decoration: none;
		transform: scale(1.04);
		background-color: rgba(0, 0, 0, 0.7);
	  }
	.category-button:hover {
		transform: scale(0.95);
		background-color: rgb(155, 0, 59);
		color: rgb(255, 255, 255);
	}
	.nav-button-links:hover {
		background-color: rgba(0, 0, 0);
		color: #fffff;
	  }
	.button-episode-link:hover {
		background-color: #202020;
	  }
	.margin {
		margin-bottom: 2rem;
	}
`;

export default GlobalStyle;
