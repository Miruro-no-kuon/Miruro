import styled from 'styled-components';

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #101010;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
  margin-top: 1rem;
  border-bottom: none;
  font-family: 'Gilroy-Medium', sans-serif;
  p {
    color: #ffffff;
  }

  button {
    color: #202020;
    outline: none;
    border: none;
    background: transparent;
    margin-left: 1rem;
    cursor: pointer;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 5px;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tooltip .tooltiptext::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`;

export default PlayerContainer;