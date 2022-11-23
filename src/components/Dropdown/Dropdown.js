import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Dropdown({ setCurrentRange, options, selected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  function changeHandler(option) {
    setIsOpen(!isOpen);
    setSelectedOption(option);
    setCurrentRange(option);
  }

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption}</span>
        {!isOpen && <FaChevronDown />}
        {isOpen && <FaChevronUp />}
      </DropdownButton>
      {isOpen && (
        <DropdownOptions>
          {options.map((option, i) => (
            <DropdownOption
              key={i}
              onClick={() => {
                changeHandler(option);
              }}
              active={option === selectedOption}
            >
              {option}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
    </DropdownContainer>
  );
}

const DropdownContainer = styled.div`
  position: relative;
`;
const DropdownButton = styled.button`
  outline: none;
  background: #404040;
  border: none;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  color: #ffffff;
  background-color: #404040;
  padding: 0.8rem 2rem;
  font-family: 'Gilroy-Medium', sans-serif;
  font-size: 0.9rem;
  border-radius: 0.4rem;
  transition: 0.2s;
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;
const DropdownOptions = styled.ul`
  position: absolute;
  list-style-type: none;
  background-color: #404040;
  color: #ffffff;
  left: 0;
  /* top: 100%; */
  min-width: 100%;
  display: flex;
  border: 2px solid #555;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  padding: 0.5rem 0;
  border-radius: 5px;
`;
const DropdownOption = styled.li`
  white-space: nowrap;
  min-width: 100%;
  cursor: pointer;
  text-align: center;
  background-color: ${({ active }) => (active ? '#585858' : 'transparent')};
  padding: 0.4rem 0;
  transition: 0.2s;
  :hover {
    background-color: #585858;
  }
`;

export default Dropdown;