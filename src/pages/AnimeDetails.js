import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import EpisodeLinksList from '../components/EpisodeLinks/EpisodeLinksList';
import AnimeDetailsSkeleton from '../components/skeletons/AnimeDetailsSkeleton';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Helmet } from 'react-helmet';

function AnimeDetails() {
  let slug = useParams().slug;
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const [localStorageDetails, setLocalStorageDetails] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [banner, setBanner] = useState('');

  useEffect(() => {
    async function getAnimeDetails() {
      setLoading(true);
      setExpanded(false); //let res = await axios.get
      window.scrollTo(0, 0);
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/getanime?link=/category/${slug}`
      );
      setLoading(false);
      setAnimeDetails(res.data);
      getLocalStorage(res.data);
      setContent((content) => {
        content = res.data[0].gogoResponse.description.replace(
          'Plot Summary:',
          ''
        );
        let len = 200;
        return (content =
          content.length > len
            ? content.substring(0, len - 3) + '...'
            : content);
      });
      setBanner((banner) => {
        return (banner = res.data[0].gogoResponse.image);
      });
      setTitle((title) => {
        return (title = res.data[0].gogoResponse.title);
      });
    }
    getAnimeDetails();
  }, [slug]);

  function readMoreHandler() {
    setExpanded(!expanded);
  }

  function getLocalStorage(animeDetails) {
    if (localStorage.getItem('Animes')) {
      let lsData = localStorage.getItem('Animes');
      lsData = JSON.parse(lsData);

      let index = lsData.Names.findIndex(
        (i) => i.name === animeDetails[0].gogoResponse.title
      );

      if (index !== -1) {
        setLocalStorageDetails(lsData.Names[index].currentEpisode);
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta property="description" content={content} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content} />
        <meta property="og:image" content={banner} />
      </Helmet>
      {loading && <AnimeDetailsSkeleton />}
      {!loading && (
        <Content>
          {animeDetails.length > 0 && (
            <div>
              <Banner
                src={
                  animeDetails[0].anilistResponse !== 'NONE' &&
                  animeDetails[0].anilistResponse.anilistBannerImage !== null
                    ? animeDetails[0].anilistResponse.anilistBannerImage
                    : 'https://cdn.discordapp.com/attachments/985501610455224389/1041877819589927014/Miruro_Public_Preview.png'
                }
                alt=""
              />
              <ContentWrapper>
                <Poster>
                  <img className="card-img" src={animeDetails[0].gogoResponse.image} alt="" />
                  {localStorageDetails !== 0 &&
                  animeDetails[0].gogoResponse.numOfEpisodes > 1 ? (
                    <Button
                      to={
                        '/watch' +
                        animeDetails[0].gogoResponse.episodes[
                          localStorageDetails - 1
                        ]
                      }
                    >
                      EP - {localStorageDetails}
                    </Button>
                  ) : (
                    <Button
                      to={'/watch' + animeDetails[0].gogoResponse.episodes[0]}
                    >
                      Watch Now
                    </Button>
                  )}
                </Poster>
                <div>
                  <h1>{animeDetails[0].gogoResponse.title}</h1>
                  <p>
                    <span>Type: </span>
                    {animeDetails[0].gogoResponse.type.replace('Type:', '')}
                  </p>
                  {width <= 600 && expanded && (
                    <p>
                      <span>Plot Summary: </span>
                      {animeDetails[0].gogoResponse.description.replace(
                        'Plot Summary:',
                        ''
                      )}
                      <button onClick={() => readMoreHandler()}>
                        read less
                      </button>
                    </p>
                  )}
                  {width <= 600 && !expanded && (
                    <p>
                      <span>Plot Summary: </span>
                      {animeDetails[0].gogoResponse.description
                        .replace('Plot Summary:', '')
                        .substring(0, 200) + '... '}
                      <button onClick={() => readMoreHandler()}>
                        read more
                      </button>
                    </p>
                  )}
                  {width > 600 && (
                    <p>
                      <span>Plot Summary: </span>
                      {animeDetails[0].gogoResponse.description.replace(
                        'Plot Summary:',
                        ''
                      )}
                    </p>
                  )}

                  <p>
                    <span>Genre: </span>
                    {animeDetails[0].gogoResponse.genre.replace('Genre:', '')}
                  </p>
                  <p>
                    <span>Released: </span>
                    {animeDetails[0].gogoResponse.released.replace(
                      'Released:',
                      ''
                    )}
                  </p>
                  <p>
                    <span>Status: </span>
                    {animeDetails[0].gogoResponse.status.replace('Status:', '')}
                  </p>
                  <p>
                    <span>Number of Episodes: </span>
                    {animeDetails[0].gogoResponse.numOfEpisodes}
                  </p>
                </div>
              </ContentWrapper>
              {animeDetails[0].gogoResponse.numOfEpisodes > 1 && (
                <EpisodeLinksList
                  episodeArray={animeDetails[0].gogoResponse.episodes}
                  episodeNum={parseInt(localStorageDetails)}
                  state={false}
                />
              )}
            </div>
          )}
        </Content>
      )}
    </div>
  );
}

const Content = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  position: relative;

  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  display: flex;

  div > * {
    margin-bottom: 0.6rem;
  }

  div {
    margin: 1rem;
    font-size: 1rem;
    color: #808080;
    font-family: 'Gilroy-Regular', sans-serif;
    span {
      font-family: 'Gilroy-Bold', sans-serif;
      color: #ffffff;
    }
    p {
      text-align: justify;
    }
    h1 {
      font-family: 'Gilroy-Bold', sans-serif;
      font-weight: normal;
      color: #ffffff;
    }
    button {
      display: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    padding: 0;
    div {
      margin: 1rem;
      margin-bottom: 0.2rem;
      h1 {
        font-size: 1.6rem;
      }
      p {
        font-size: 1rem;
      }
      button {
        display: inline;
        border: none;
        outline: none;
        background-color: transparent;
        text-decoration: underline;
        font-family: 'Gilroy-Bold', sans-serif;
        font-size: 1rem;
        color: #ffffff;
      }
    }
  }
`;

const Poster = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 220px;
    height: 300px;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    position: relative;
    top: -20%;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }
  @media screen and (max-width: 600px) {
    img {
      display: none;
    }
  }
`;

const Button = styled(Link)`
  font-size: 1.3rem;
  padding: 1rem 3.4rem;
  text-align: center;
  text-decoration: none;
  color: rgb(208, 204, 197);
  background-color: rgb(24, 26, 27);
  font-family: 'Gilroy-Bold', sans-serif;
  border-radius: 0.4rem;
  position: relative;
  top: -25%;
  white-space: nowrap;
  transition: 0.2s;

  :hover {
    transform: scale(0.95);
    background-color: rgb(155 0 59);
    color: rgb(255 255 255);
  }

  @media screen and (max-width: 600px) {
    display: block;
    width: 100%;
  }
`;

const Banner = styled.img`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.7rem;

  @media screen and (max-width: 600px) {
    height: 13rem;
    border-radius: 0.5rem;
  }
`;

export default AnimeDetails;
