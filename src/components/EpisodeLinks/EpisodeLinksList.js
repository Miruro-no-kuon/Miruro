import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import Dropdown from '../Dropdown/Dropdown';

const EpisodeLinksList = ({ episodeArray, episodeNum }) => {
    const { width } = useWindowDimensions();
    const [rangeFilters, setRangeFilters] = useState({});
    const [currentRange, setCurrentRange] = useState(null);
    const currentRangeIndex = useMemo(
        () => Object.keys(rangeFilters).indexOf(currentRange),
        [currentRange, rangeFilters]
    );

    useEffect(() => {
        const updateChunks = (array) => {
            const rangeSize = 100;
            const buffer = {};
            for (let i = 0; i < array.length; i += rangeSize) {
                const rangeValues = array.slice(i, i + rangeSize);
                let key;
                if (rangeValues.length === 1) {
                    key = `${(i + rangeValues.length).toString().padStart(3, 0)}`;
                } else {
                    key = `${(i + 1).toString().padStart(3, 0)} - ${(
                        i + rangeValues.length
                    )
                        .toString()
                        .padStart(3, 0)}`;
                }
                buffer[key] = rangeValues;
            }
            setRangeFilters(buffer);
            if (episodeNum === 0) {
                setCurrentRange(Object.keys(buffer)[0]);
                return;
            }
            const rangeIndex = Math.floor((episodeNum - 1) / 100);
            setCurrentRange(Object.keys(buffer)[rangeIndex]);
        };
        updateChunks(episodeArray);
    }, [episodeArray, episodeNum]);

    return (
        <EpisodesWrapper>
            <div className="header">
                <p>Episodes</p>
                <Dropdown
                    setCurrentRange={setCurrentRange}
                    options={Object.keys(rangeFilters)}
                    selected={currentRange}
                />
            </div>
            <Episodes>
                {rangeFilters[currentRange]?.map((item, i) => (
                    <EpisodeLink
                        key={i}
                        to={'/watch' + item}
                        style={
                            episodeNum === currentRangeIndex * 100 + i + 1
                                ? { backgroundColor: '#FFFFFF', color: '#23272A' }
                                : episodeNum > currentRangeIndex * 100 + i
                                    ? { backgroundColor: '#AFAFAF', color: '#23272A' }
                                    : {}
                        }
                    >
                        {width > 600 && `Episode ${currentRangeIndex * 100 + i + 1}`}
                        {width <= 600 && currentRangeIndex * 100 + i + 1}
                    </EpisodeLink>
                ))}
            </Episodes>
        </EpisodesWrapper>
    );
};

const EpisodesWrapper = styled.div`
  margin-top: 1rem;
  border: 1px solid #444;
  border-radius: 0.4rem;
  .header {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    width: 100%;
    border-bottom: 1px solid #404040;
    padding: 0.6rem 1rem;
    justify-content: start;
    align-items: center;
  }
  p {
    font-size: 1.3rem;
    text-decoration: underline;
    color: white;
    font-family: 'Gilroy-Medium', sans-serif;
  }
`;

const Episodes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 1rem;
  grid-row-gap: 1rem;
  padding: 1rem;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    grid-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  }
`;

const EpisodeLink = styled(Link)`
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  background-color: #404040;
  padding: 0.9rem 0rem;
  font-family: 'Gilroy-Medium', sans-serif;
  border-radius: 0.4rem;
  border: 1px solid #23272a;
  transition: 0.2s;
  :hover {
    background-color: #202020;
  }
`;

export default EpisodeLinksList;