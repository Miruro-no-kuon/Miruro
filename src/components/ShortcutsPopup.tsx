import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

const Column1 = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-right: 15rem;
  opacity: 0.7;
`;
const Column2 = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-right: 5rem;
  /* font-weight: bold; */
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  margin-top: 1rem;
  margin-right: 1rem;
  max-height: 100%;
  display: flex;
  align-items: center;
  padding: 0.6rem;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;

  &:hover {
    background-color: var(--primary-accent);
  }
`;

const PopUp = styled.div`
  position: relative;
  border-radius: var(--global-border-radius);
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

interface KeyboardShortcutsPopupProps {
  onClose: () => void;
}

const KeyboardShortcutsPopup = ({ onClose }: KeyboardShortcutsPopupProps) => {
  return (
    <Overlay onClick={onClose}>
      <PopUp className="popup-content" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes size={"1.2rem"}/>
        </CloseButton>
        <h2>Keyboard Shortcuts (shift+/)</h2>
        <ShortcutsTable>
          <tr>
            <Column1>Play/Pause Toggle</Column1>
            <Column2>K / Space</Column2>
          </tr>
          <tr>
            <Column1>Seek Backward 10 Seconds</Column1>
            <Column2>J</Column2>
          </tr>
          <tr>
            <Column1>Seek Forward 10 Seconds</Column1>
            <Column2>L</Column2>
          </tr>
          <tr>
            <Column1>Toggle Fullscreen</Column1>
            <Column2>F</Column2>
          </tr>
          <tr>
            <Column1>Toggle Mute</Column1>
            <Column2>M</Column2>
          </tr>
          <tr>
            <Column1>Increase Volume</Column1>
            <Column2>Arrow Up</Column2>
          </tr>
          <tr>
            <Column1>Seek Forward 5 Seconds</Column1>
            <Column2>Arrow Right</Column2>
          </tr>
          <tr>
            <Column1>Seek Backward 5 Seconds</Column1>
            <Column2>Arrow Left</Column2>
          </tr>
          <tr>
            <Column1>Decrease Volume</Column1>
            <Column2>Arrow Down</Column2>
          </tr>
          <tr>
            <Column1>Toggle Subtitles</Column1>
            <Column2>C</Column2>
          </tr>
          <tr>
            <Column1>Cycle Subtitle Tracks</Column1>
            <Column2>T</Column2>
          </tr>
          <tr>
            <Column1>Increase Playback Speed</Column1>
            <Column2>&gt;</Column2>
          </tr>
          <tr>
            <Column1>Decrease Playback Speed</Column1>
            <Column2>&lt;</Column2>
          </tr>
          <tr>
            <Column1>Jump to Percentage (0-90%)</Column1>
            <Column2>0-9</Column2>
          </tr>
        </ShortcutsTable>
      </PopUp>
    </Overlay>
  );
};

const ShortcutsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const togglePopupWithShortcut = (e: KeyboardEvent) => {
      if (
        e.target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as Element).tagName)
      ) {
        return;
      }

      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShowPopup(!showPopup);
      } else if (e.key === "Escape") {
        setShowPopup(false);
      }
    };

    window.addEventListener("keydown", togglePopupWithShortcut);

    return () => {
      window.removeEventListener("keydown", togglePopupWithShortcut);
    };
  }, [showPopup]);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div className="App">
      {showPopup && <KeyboardShortcutsPopup onClose={togglePopup} />}
    </div>
  );
};

export default ShortcutsPopup;
