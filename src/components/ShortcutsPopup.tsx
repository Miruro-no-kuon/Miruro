import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.table`
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease-in-out;
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
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.5rem;
  padding-left: 0.6rem;
  background-color: var(--global-primary-bg-tr);
  color: var(--global-text);
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  outline: none;
  transition: 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.06);
    svg {
      padding-bottom: 0.1rem;
    }
  }

  &:active,
  &:focus {
    transform: scale(0.94);
  }
`;

const PopUp = styled.thead`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideUp 0.3s ease-in-out;
  position: relative;
  border-radius: var(--global-border-radius);
  padding: 1rem;
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
        <div
          style={{
            background: 'var(--global-div)',
            borderRadius: 'var(--global-border-radius)',
            padding: '0.5rem',
          }}
        >
          <tr>
            <td>
              <CloseButton onClick={onClose}>
                <FaTimes size={'1rem'} />
              </CloseButton>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Keyboard Shortcuts</strong>(shift+/)
            </td>
          </tr>
        </div>
        <div
          style={{
            background: 'var(--global-div)',
            borderRadius: 'var(--global-border-radius)',
            padding: '0.5rem',
          }}
        >
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
        </div>
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
