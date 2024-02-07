import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaArrowUp } from "react-icons/fa";

// Define animation keyframes
const fadeInFromBottom = keyframes`
  from {
    opacity: 0;
    bottom: -3.5rem; /* Adjust the negative value to control the starting position */
  }
  to {
    opacity: 1;
    bottom: 1.5rem;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
`;

// Styled button component
const StyledButton = styled.button`
  position: fixed;
  right: 1.5rem;
  z-index: 1000;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background-color: transparent;
  backdrop-filter: blur(10px);
  color: var(--global-button-text);
  padding: 0;
  width: 3.5rem;
  height: 3.5rem;
  cursor: pointer;
  display: ${({ $isVisible }) =>
    $isVisible ? "block" : "none"}; // Use $isVisible here
  animation: ${({ $isVisible }) => ($isVisible ? fadeInFromBottom : fadeOut)}
    0.5s ease;
  bottom: ${({ $isVisible }) => ($isVisible ? "1.5rem" : "-3.5rem")};

  .icon {
    font-size: 1rem;
  }
`;

const StyledButtonWrapper = styled.div`
  /* Add any additional styles for the wrapper here */
`;

// Function to detect if the device is mobile
function isMobileDevice() {
  const userAgent =
    typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) || window.innerWidth <= 768;
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to detect scroll position and toggle button visibility
  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  // Function to scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isMobileDevice() && (
      <StyledButtonWrapper>
        <StyledButton onClick={scrollToTop} $isVisible={isVisible}>
          <FaArrowUp className="icon" />
        </StyledButton>
      </StyledButtonWrapper>
    )
  );
}

export default ScrollToTopButton;
