import styled from "styled-components";
import { useState, useEffect } from "react";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Higher z-index to be on top of everything */
  @media (max-width: 700px) {
    display: none; /* Ensure the button is displayed as a block element */
  }
`;

const ShortcutsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const TableCell1 = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-right: 15rem;
  opacity: 0.7;
`;
const TableCell2 = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-right: 5rem;
  /* font-weight: bold; */
`;

const CloseButton = styled.button`
  position: absolute;
  margin-top: 1rem;
  margin-right: 1rem;
  top: 10px;
  right: 10px;
  padding: 0.5rem 0.6rem;
  background-color: var(--primary-accent-bg);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  z-index: 1200; /* Ensure it's above the pop-up content */
  &:hover {
    background-color: var(--primary-accent);
  }
`;

const PopUp = styled.div`
  position: relative;
  border-radius: 0.8rem;
  padding: 1.5rem;
  padding-top: 0.5rem;
  line-height: 1.8rem;
  background: var(--global-primary-bg);
  z-index: 1100; /* Higher z-index to be on top of overlay */
  overflow: auto; /* Make content scrollable */
  max-height: 80vh; /* Adjust as needed, vh is relative to viewport height */
  max-width: 90vw; /* Adjust as needed, vw is relative to viewport width */
  @media (max-width: 700px) {
    display: none; /* Ensure the button is displayed as a block element */
  }
`;

const KeyboardShortcutsPopup = ({ onClose }) => {
  return (
    <Overlay onClick={onClose}>
      <PopUp className="popup-content" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>Dismiss</CloseButton>
        <h2>Keyboard Shortcuts (shift+/)</h2>
        <ShortcutsTable>
          <tr>
            <TableCell1>Play/Pause Toggle</TableCell1>
            <TableCell2>K / Space</TableCell2>
          </tr>
          <tr>
            <TableCell1>Seek Backward 10 Seconds</TableCell1>
            <TableCell2>J</TableCell2>
          </tr>
          <tr>
            <TableCell1>Seek Forward 10 Seconds</TableCell1>
            <TableCell2>L</TableCell2>
          </tr>
          <tr>
            <TableCell1>Toggle Fullscreen</TableCell1>
            <TableCell2>F</TableCell2>
          </tr>
          <tr>
            <TableCell1>Toggle Mute</TableCell1>
            <TableCell2>M</TableCell2>
          </tr>
          <tr>
            <TableCell1>Increase Volume</TableCell1>
            <TableCell2>Arrow Up</TableCell2>
          </tr>
          <tr>
            <TableCell1>Seek Forward 5 Seconds</TableCell1>
            <TableCell2>Arrow Right</TableCell2>
          </tr>
          <tr>
            <TableCell1>Seek Backward 5 Seconds</TableCell1>
            <TableCell2>Arrow Left</TableCell2>
          </tr>
          <tr>
            <TableCell1>Decrease Volume</TableCell1>
            <TableCell2>Arrow Down</TableCell2>
          </tr>
          <tr>
            <TableCell1>Toggle Subtitles</TableCell1>
            <TableCell2>C</TableCell2>
          </tr>
          <tr>
            <TableCell1>Cycle Subtitle Tracks</TableCell1>
            <TableCell2>T</TableCell2>
          </tr>
          <tr>
            <TableCell1>Increase Playback Speed</TableCell1>
            <TableCell2>&gt;</TableCell2>
          </tr>
          <tr>
            <TableCell1>Decrease Playback Speed</TableCell1>
            <TableCell2>&lt;</TableCell2>
          </tr>
          <tr>
            <TableCell1>Jump to Percentage (0-90%)</TableCell1>
            <TableCell2>0-9</TableCell2>
          </tr>
        </ShortcutsTable>
      </PopUp>
    </Overlay>
  );
};

const ShortcutsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const togglePopupWithShortcut = (e) => {
      // Check if the event's target is an input, textarea, or select element
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        return; // Do nothing if the event is from one of these elements
      }

      if (e.shiftKey && e.key === "?") {
        e.preventDefault(); // Prevent the default action of the key press
        setShowPopup(!showPopup);
      } else if (e.key === "Escape") {
        setShowPopup(false); // Close the popup when Escape key is pressed
      }
    };


    // Add the event listener
    window.addEventListener("keydown", togglePopupWithShortcut);

    // Remove the event listener on cleanup
    return () => {
      window.removeEventListener("keydown", togglePopupWithShortcut);
    };
  }, [showPopup]); // Dependency array to re-bind the listener if showPopup changes

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="App">
      {showPopup && <KeyboardShortcutsPopup onClose={togglePopup} />}
    </div>
  );
};

export default ShortcutsPopup;
