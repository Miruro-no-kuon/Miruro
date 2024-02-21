import { useEffect } from "react";

const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  videoRef?: React.RefObject<HTMLElement> // Optional parameter
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        const activeElement = document.activeElement as HTMLElement;

        // Identifying focusable elements
        const focusableElements = ["INPUT", "TEXTAREA"];

        // Checking for the exceptional element (e.g., the Timeline slider)
        const isExceptionalElement = activeElement.classList.contains("timeline-slider");

        // Allow execution if the focused element is not a text input or textarea,
        // or it is the exceptional element (the Timeline slider)
        if (isExceptionalElement || focusableElements.indexOf(activeElement.tagName) === -1) {
          callback();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [key, callback, videoRef]);
};

export default useKeyboardShortcut;
