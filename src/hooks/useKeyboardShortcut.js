import { useEffect } from "react";

const useKeyboardShortcut = (key, callback, videoRef) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === key) {
        const activeElement = document.activeElement;

        // Check if the focus is not on a text input or similar element
        const focusableElements = ["INPUT", "TEXTAREA"];
        if (
          !activeElement ||
          focusableElements.indexOf(activeElement.tagName) === -1
        ) {
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
