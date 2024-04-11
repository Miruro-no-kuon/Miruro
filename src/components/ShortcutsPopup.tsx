import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const slideUpAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.table`
  font-size: 0.85rem;
  animation: ${fadeInAnimation} 0.3s ease forwards;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const TableCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
`;

const Column1 = styled(TableCell)`
  padding-right: 15rem;
  opacity: 0.7;
`;

const Column2 = styled(TableCell)`
  padding-right: 5rem;
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
  transition: 0.2s ease;

  &:active {
    background-color: var(--global-secondary-bg);
    transform: scale(0.9);
  }
`;

const PopUp = styled.thead`
  animation: ${slideUpAnimation} 0.3s ease forwards;
  position: relative;
  border-radius: var(--global-border-radius);
  padding: 1.5rem;
  padding-top: 0.5rem;
  line-height: 1.8rem;
  background: var(--global-primary-bg);
  z-index: 1100;
  overflow: auto;
  max-height: 90vh;
  max-width: 90vw;
`;

const KeyboardShortcutsPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <Overlay onClick={onClose}>
      <PopUp className='popup-content' onClick={(e) => e.stopPropagation()}>
        <tr>
          <td>
            <CloseButton onClick={onClose}>
              <FaTimes size={'1rem'} />
            </CloseButton>
          </td>
        </tr>
        <tr>
          <td>
            <h2>Keyboard Shortcuts (shift+/)</h2>
          </td>
        </tr>

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
          <Column1>Previous Episode</Column1>
          <Column2>(SHIFT+P)</Column2>
        </tr>
        <tr>
          <Column1>Next Episode</Column1>
          <Column2>(SHIFT+N)</Column2>
        </tr>
        <tr>
          <Column1>Increase Volume</Column1>
          <Column2>Arrow Up</Column2>
        </tr>
        <tr>
          <Column1>Decrease Volume</Column1>
          <Column2>Arrow Down</Column2>
        </tr>
        <tr>
          <Column1>Seek Forward 5 Seconds</Column1>
          <Column2>Arrow Right</Column2>
        </tr>
        <tr>
          <Column1>Seek Backward 5 Seconds</Column1>
          <Column2>Arrow Left</Column2>
        </tr>
        {/* <tr>
          <Column1>Toggle Subtitles</Column1>
          <Column2>C</Column2>
        </tr> */}
        {/* <tr>
          <Column1>Cycle Subtitle Tracks</Column1>
          <Column2>T</Column2>
        </tr> */}
        <tr>
          <Column1>Increase Playback Speed</Column1>
          <Column2>&gt; (SHIFT+,)</Column2>
        </tr>
        <tr>
          <Column1>Decrease Playback Speed</Column1>
          <Column2>&lt; (SHIFT+.)</Column2>
        </tr>
        <tr>
          <Column1>Jump to Percentage (0-90%)</Column1>
          <Column2>0-9</Column2>
        </tr>
      </PopUp>
    </Overlay>
  );
};

export const ShortcutsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const togglePopupWithShortcut = (e: KeyboardEvent) => {
      if (
        e.target &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as Element).tagName)
      ) {
        return;
      }

      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setShowPopup(!showPopup);
      } else if (e.key === 'Escape') {
        setShowPopup(false);
      }
    };

    window.addEventListener('keydown', togglePopupWithShortcut);

    return () => {
      window.removeEventListener('keydown', togglePopupWithShortcut);
    };
  }, [showPopup]);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div className='App'>
      {showPopup && <KeyboardShortcutsPopup onClose={togglePopup} />}
    </div>
  );
};
