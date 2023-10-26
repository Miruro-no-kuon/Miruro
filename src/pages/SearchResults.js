import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/Skeletons/SearchResultsSkeleton";

const DefaultFilter = {
  subs: true,
  dubs: true,
};

const fetchSearchResults = async (query, pages = [1, 2]) => {
  try {
    const responses = await Promise.all(
      pages.map((page) =>
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}meta/anilist/${query}?page=${page}`
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
  // Get the search query from the URL parameters
  const { name } = useParams();
  const urlParams = name.replace(/[:()]/g, ""); // Updated regex to remove all : and ()

  // State to store search results and loading state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to manage the filters for dubs and subs
  const [filter, setFilter] = useState(DefaultFilter);

  // Update the page title based on the search query
  useEffect(() => {
    changeMetaArr("title", `Search results for: ${urlParams}`);
  }, [changeMetaArr, urlParams]);

  // Fetch search results when the component mounts or the search query changes
  useEffect(() => {
    async function getResults() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetchSearchResults(urlParams, [1, 2, 3]); // Fetch results from page 1 and 2
        setLoading(false);
        setResults(res.results);
      } catch (error) {
        setLoading(false);
        setResults([]);
      }
    }
    getResults();
  }, [urlParams]);

  // Update the filter based on user selection
  const updateSearchFilter = (ev) => {
    const otherKey = Object.keys(filter).filter((k) => k !== ev.target.value);
    let otherChecked = filter[otherKey];
    if (!ev.target.checked && !otherChecked) {
      otherChecked = true;
    }
    setFilter({
      [ev.target.value]: ev.target.checked,
      [otherKey]: otherChecked,
    });
  };

  // Filter the results based on the selected filters
  const filterResults = (item) => {
    if (item.type !== null) {
      const isDub = item.type.toLowerCase().endsWith("-dub");
      return (
        (filter.dubs && filter.subs) ||
        (filter.dubs && isDub) ||
        (filter.subs && !isDub)
      );
    }
    return false;
  };

  // Page title, description, and image for meta tags
  const title = `Search results for: ${urlParams}`;
  const content = "Miruro - Watch The Best Quality Anime Online";
  const image =
    "https://cdn.discordapp.com/attachments/985501610455224389/1041877819589927014/Miruro_Public_Preview.png";

  return (
    <>
      {loading ? (
        <SearchResultsSkeleton name={urlParams} />
      ) : (
        <Parent>
          <Heading>
            Search <span>{name === undefined ? "Search" : name}</span> Results
          </Heading>
          <CheckboxWrapper>
            <label htmlFor="dubs">Dubs</label>
            <input
              id="dubs"
              checked={filter.dubs}
              onChange={updateSearchFilter}
              type="checkbox"
              value="dubs"
            />
            <label htmlFor="subs">Subs</label>
            <input
              id="subs"
              checked={filter.subs}
              onChange={updateSearchFilter}
              type="checkbox"
              value="subs"
            />
          </CheckboxWrapper>
          <CardWrapper>
            {results.filter(filterResults).map((item, i) => (
              <Wrapper to={`/category/${item.id}`} key={i}>
                <img className="card-img" src={item.image} alt="" />
                <p>
                  {item.title.romaji ||
                    item.title.english ||
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

// Styled components for styling the UI
const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  h2 {
    color: #ffffff;
  }
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const CheckboxWrapper = styled.div`
  color: #ffffff;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  label {
    padding-right: 0.5rem;
  }
  label:not(:first-child) {
    margin-left: 2rem;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  row-gap: 2rem;
  column-gap: 2rem;

  ::after {
    content: "";
    flex: auto;
  }

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
    text-decoration: none;
    max-width: 160px;
    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
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
