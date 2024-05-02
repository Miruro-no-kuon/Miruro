import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../../index';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { TbCards } from 'react-icons/tb';
import { BsArrowUpSquare, BsArrowDownSquare } from 'react-icons/bs';
import { PiKeyReturn } from 'react-icons/pi';

const Container = styled.div<{ $isVisible: boolean; width: number }>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  position: absolute;
  z-index: -1;
  top: 1rem;
  width: ${({ width }) => `${width}px`};
  margin-left: -0.6rem;
  overflow-y: auto;
  background-color: var(--global-div);
  border-top: none;
  border-radius: var(--global-border-radius);
  padding-top: 2.5rem;
  animation: dropDown 0.5s ease-in-out;

  @media (max-width: 500px) {
    top: 4rem;
    width: 96.4%;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  max-height: ${({ $isVisible }) => ($isVisible ? '500px' : '0')};
`;

const Details = styled.p<{ $isSelected: boolean }>`
  margin: 0.25rem 0;
  animation: slideDropDown 0.5s ease-in-out;
  color: ${({ $isSelected }) =>
    $isSelected ? 'var(--primary-text)' : 'rgba(102, 102, 102, 0.75)'};
  font-size: 0.65rem;
  font-weight: bold;
  padding: 0 0.5rem;
  display: flex;
`;

const Item = styled.div<{ $isSelected: boolean }>`
  display: flex;
  animation: slideDropDown 0.5s ease-in-out;
  padding: 0.5rem;
  margin: 0;
  cursor: pointer;
  background-color: ${({ $isSelected }) =>
    $isSelected ? 'var(--primary-accent-bg)' : 'transparent'};
  transition: 0.05s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--primary-accent-bg);
    ${Details} {
      color: var(--global-text);
    }
  }
`;
const ViewAllItem = styled(Item)<{ $isSelected: boolean }>`
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between; // This spreads out the children to the extremes
  align-items: center;
  color: ${({ $isSelected }) => ($isSelected ? '' : '#666')};
  &:hover,
  &:active,
  &:focus {
    color: var(--global-text);
  }
  svg {
    margin-bottom: -0.1rem;
  }
`;

const Shorcuts = styled.div`
  font-weight: normal;
  @media (max-width: 600px) {
    display: none;
  }
`;

const Image = styled.img`
  animation: slideDropDown 0.5s ease-in-out;
  width: 2.5rem;
  height: 3.5rem;
  border-radius: var(--global-border-radius);
  object-fit: cover;

  @media (max-width: 500px) {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const Title = styled.p`
  margin: 0 0.5rem;
  padding: 0.1rem;
  animation: slideDropDown 0.5s ease-in-out;
  text-align: left;
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: 0.8rem;
  }
`;

interface Props {
  searchResults: Anime[];
  onClose: () => void;
  isVisible: boolean;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  searchQuery: string;
  containerWidth: number;
}

export const DropDownSearch: React.FC<Props> = ({
  searchResults,
  onClose,
  isVisible,
  selectedIndex,
  setSelectedIndex,
  searchQuery,
  containerWidth,
}) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible) {
      setSelectedIndex(null);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      const total = searchResults.length;
      let index = selectedIndex !== null ? selectedIndex : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        index = (index + 1) % (total + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        index = (index - 1 + total + 1) % (total + 1);
      } else if (e.key === 'Enter' && selectedIndex !== null) {
        e.preventDefault();
        if (selectedIndex < total) {
          onClose();
          navigate(`/watch/${searchResults[selectedIndex].id}`);
        } else {
          navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
          onClose();
        }
      }

      setSelectedIndex(index);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, searchResults, selectedIndex]);

  return (
    <Container
      width={containerWidth}
      $isVisible={isVisible && searchResults.length > 0}
      ref={ref}
      role='list'
    >
      {searchResults.map((result, index) => (
        <Item
          key={result.id}
          title={result.title.english || result.title.romaji}
          $isSelected={index === selectedIndex}
          onClick={() => {
            onClose();
            navigate(`/watch/${result.id}`);
          }}
          role='listitem'
        >
          <Image
            src={result.image || ''}
            alt={result.title?.english || result.title?.romaji || 'n/a'}
          />
          <div>
            <Title>
              {result.title?.english || result.title?.romaji || 'n/a'}
            </Title>
            <Details $isSelected={index === selectedIndex}>
              <span>&nbsp;{result.type}</span>
              <span>&nbsp;&nbsp;</span>
              <TbCards color='#' />
              <span>&nbsp;</span>
              <span>{result.totalEpisodes || 'N/A'}&nbsp;</span>
              <FaStar color='#' />
              <span>&nbsp;</span>
              <span>{result.rating ? result.rating / 10 : 'N/A'}&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
            </Details>
          </div>
        </Item>
      ))}
      <div>
        <ViewAllItem
          $isSelected={selectedIndex === searchResults.length}
          onClick={() => {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            onClose();
          }}
          role='listitem'
          tabIndex={0}
        >
          <Shorcuts>
            <BsArrowUpSquare /> <BsArrowDownSquare /> to navigate{' '}
            <PiKeyReturn /> to select | Esc to exit &nbsp;
          </Shorcuts>
          <div>
            <>View All</> &nbsp; <FaArrowRight />
          </div>
        </ViewAllItem>
      </div>
    </Container>
  );
};
