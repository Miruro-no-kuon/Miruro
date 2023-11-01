import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/Skeletons/SearchResultsSkeleton";
import Dropdown from "../components/Dropdown/Dropdown";

const filterOptions = {
  type: ["ANIME", "MANGA"],
  season: ["WINTER", "SPRING", "SUMMER", "FALL"],
  format: ["TV", "TV_SHORT", "OVA", "ONA", "MOVIE", "SPECIAL", "MUSIC"],
  status: ["RELEASING", "NOT_YET_RELEASED", "FINISHED", "CANCELLED", "HIATUS"],
};

const filterLabels = {
  type: "Type:",
  season: "Season:",
  format: "Format:",
  status: "Status:",
};

const fetchSearchResults = async (query, pages = [1], filters = {}) => {
  try {
    const params = {
      query: query,
      page: pages,
      perPage: 50,
    };

    if (filters.type) params.type = filters.type;
    if (filters.season) params.season = filters.season;
    if (filters.format) params.format = filters.format;
    if (filters.status) params.status = filters.status;

    const responses = await Promise.all(
      pages.map((page) =>
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}meta/anilist/advanced-search`,
          {
            params: params,
          }
        )
      )
    );

    const results = responses.flatMap((response) => response.data.results);
    return { results };
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

function SearchResults({ changeMetaArr }) {
  const { name } = useParams();
  const urlParams = name.replace(/[:()]/g, "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    type: "ANIME",
    season: "",
    format: "",
    status: "",
  });

  const updateFilters = (filterName, value) => {
    setSelectedFilters({ ...selectedFilters, [filterName]: value });
  };

  const resetFilters = () => {
    setSelectedFilters({
      type: "ANIME",
      season: "",
      format: "",
      status: "",
    });
  };

  useEffect(() => {
    changeMetaArr("title", `Miruro search: ${urlParams}`);
  }, [changeMetaArr, urlParams]);

  useEffect(() => {
    async function getResults() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetchSearchResults(urlParams, [1], selectedFilters);

        setLoading(false);
        setResults(res.results);
      } catch (error) {
        setLoading(false);
        setResults([]);
      }
    }
    getResults();
  }, [urlParams, selectedFilters]);

  return (
    <>
      {loading ? (
        <SearchResultsSkeleton name={urlParams} />
      ) : (
        <Parent>
          <Heading>
            Search <span>{name === undefined ? "Search" : name}</span> Results
          </Heading>
          <FilterContainer>
            {Object.keys(filterOptions).map((filterKey) => (
              <div key={filterKey}>
                <Dropdown
                  setCurrentRange={(value) => updateFilters(filterKey, value)}
                  options={filterOptions[filterKey]}
                  selected={selectedFilters[filterKey]}
                  label={filterLabels[filterKey]}
                />
              </div>
            ))}
            <ResetButton onClick={resetFilters}>Reset Filters</ResetButton>
          </FilterContainer>
          <CardWrapper>
            {results.map((item, i) => (
              <Wrapper to={`/details/${item.id}`} key={i}>
                <img className="card-img" src={item.image} alt="" />
                <p>
                  {item.title.english ||
                    item.title.romaji ||
                    item.title.native ||
                    item.title.userPreferred ||
                    item.title}
                </p>
                <p>{item.type || "Unknown Type"}</p>
              </Wrapper>
            ))}
          </CardWrapper>
          {results.length === 0 && <h2>No Search Results Found</h2>}
        </Parent>
      )}
    </>
  );
}

const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  h2 {
    color: #ffffff;
  }
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  @media screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const FilterLabel = styled.span`
  color: #ffffff;
  margin-right: 0.5rem;
`;

const ResetButton = styled.button`
  background: #ff4d4d;
  border: none;
  color: #ffffff;
  border-radius: 0.4rem; /* Add border-radius to match the other buttons */
  padding: 0.5rem 1rem; /* Adjust the padding to match the other buttons */
  cursor: pointer;
  font-family: "Gilroy-Medium", sans-serif; /* Apply font-family */
  font-size: 0.9rem; /* Apply font size */
  display: flex; /* Add display and align-items properties */
  gap: 0.4rem; /* Add gap to match the other buttons */
  align-items: center;

  &:hover {
    background: #ff3333; /* Change the background color on hover */
  }
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 1rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, 100px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
}
`;

const Wrapper = styled(Link)`
  text-decoration: none;
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.4rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
      border-radius: 0.3rem;
    }
    @media screen and (max-width: 400px) {
      width: 110px;
      height: 170px;
    }
    @media screen and (max-width: 380px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: #ffffff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
    font-weight: bold;
    text-decoration: none;
    max-width: 160px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
    }
  }
}
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: #ffffff;
  font-family: "Gilroy-Light", sans-serif;
  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

export default SearchResults;
