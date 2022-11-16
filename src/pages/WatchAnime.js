import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BiArrowToBottom, BiFullscreen } from 'react-icons/bi';
import { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { IconContext } from 'react-icons';
import { Helmet } from 'react-helmet';
import WatchAnimeSkeleton from '../components/skeletons/WatchAnimeSkeleton';
import useWindowDimensions from '../hooks/useWindowDimensions';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import ServersList from '../components/WatchAnime/ServersList';
import PlayerContainer from '../components/Wrappers/PlayerContainer';
import EpisodeLinksList from '../components/EpisodeLinks/EpisodeLinksList';

function WatchAnime() {
  let episodeSlug = useParams().episode;

  const [episodeLinks, setEpisodeLinks] = useState([]);
  const [currentServer, setCurrentServer] = useState('');
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [fullScreen, setFullScreen] = useState(false);
  const [internalPlayer, setInternalPlayer] = useState(true);
  const [localStorageDetails, setLocalStorageDetails] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [banner, setBanner] = useState('');

  useEffect(() => {
    function updateLocalStorage(episode, episodeLinks) {
      setTitle((title) => {
        return (title = `${episodeLinks[0].titleName.substring(
          0,
          episodeLinks[0].titleName.indexOf('Episode')
        )} 
          - ${episodeLinks[0].titleName.substring(
            episodeLinks[0].titleName.indexOf('Episode')
          )}`);
      });
      let episodeNum = episode.replace(/.*?(\d+)[^\d]*$/, '$1');
      let animeName = episodeLinks[0].titleName.substring(
        0,
        episodeLinks[0].titleName.indexOf('Episode')
      );
      animeName = animeName.substring(0, animeName.length - 1);
      if (localStorage.getItem('Animes')) {
        let lsData = localStorage.getItem('Animes');
        lsData = JSON.parse(lsData);

        let index = lsData.Names.findIndex((i) => i.name === animeName);
        if (index !== -1) {
          lsData.Names.splice(index, 1);
          lsData.Names.unshift({
            name: animeName,
            currentEpisode: episodeNum,
            episodeLink: episodeSlug,
          });
        } else {
          lsData.Names.unshift({
            name: animeName,
            currentEpisode: episodeNum,
            episodeLink: episodeSlug,
          });
        }
        lsData = JSON.stringify(lsData);
        localStorage.setItem('Animes', lsData);
      } else {
        let data = {
          Names: [],
        };
        data.Names.push({
          name: animeName,
          currentEpisode: episodeNum,
          episodeLink: episodeSlug,
        });
        data = JSON.stringify(data);
        localStorage.setItem('Animes', data);
      }
    }

    async function getEpisodeLinks() {
      setLoading(true);
      window.scrollTo(0, 0);
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/getlinks?link=/${episodeSlug}`
      );
      setLoading(false);
      setEpisodeLinks(res.data);
      setCurrentServer(res.data[0].vidstreaming);
      if (
        res.data[0].sources.sources !== null ||
        res.data[0].sources.sources !== undefined
      ) {
        setInternalPlayer(true);
      }
      updateLocalStorage(episodeSlug, res.data);
      getLocalStorage(
        res.data[0].titleName.substring(
          0,
          res.data[0].titleName.indexOf('Episode')
        )
      );
    }
    getEpisodeLinks();
  }, [episodeSlug]);

  function getLocalStorage(animeDetails) {
    animeDetails = animeDetails.substring(0, animeDetails.length - 1);

    if (localStorage.getItem('Animes')) {
      let lsData = localStorage.getItem('Animes');
      lsData = JSON.parse(lsData);

      let index = lsData.Names.findIndex((i) => i.name === animeDetails);

      if (index !== -1) {
        setLocalStorageDetails(lsData.Names[index].currentEpisode);
      }
    }
  }

  function fullScreenHandler(e) {
    setFullScreen(!fullScreen);
    let video = document.getElementById('video');

    if (!document.fullscreenElement) {
      video.requestFullscreen();
      window.screen.orientation.lock('landscape-primary');
    } else {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    async function getAnimeBanner() {
      let slug = episodeSlug.split('-episode')[0];
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/getanime?link=/category/${slug}`
      );
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
    }
    if (loading === false) {
      getAnimeBanner();
    }
  }, [loading, episodeSlug]);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta property="description" content={content} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content} />
        <meta property="og:image" content={banner} />
      </Helmet>
      {loading && <WatchAnimeSkeleton />}
      {!loading && (
        <Wrapper>
          {episodeLinks.length > 0 && currentServer !== '' && (
            <div>
              <div>
                <Titles>
                  <p>
                    <span>
                      {episodeLinks[0].titleName.substring(
                        0,
                        episodeLinks[0].titleName.indexOf('Episode')
                      )}
                    </span>{' '}
                    -
                    {' ' +
                      episodeLinks[0].titleName.substring(
                        episodeLinks[0].titleName.indexOf('Episode')
                      )}
                  </p>
                  {width <= 600 && (
                    <IconContext.Provider
                      value={{
                        size: '1.8rem',
                        style: {
                          verticalAlign: 'middle',
                        },
                      }}
                    >
                      <a
                        href={episodeLinks[0].downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BiArrowToBottom />
                      </a>
                    </IconContext.Provider>
                  )}
                  {width > 600 && (
                    <IconContext.Provider
                      value={{
                        size: '1.2rem',
                        style: {
                          verticalAlign: 'middle',
                          marginBottom: '0.2rem',
                          marginLeft: '0.3rem',
                        },
                      }}
                    >
                      <a
                        href={episodeLinks[0].downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                        <BiArrowToBottom />
                      </a>
                    </IconContext.Provider>
                  )}
                </Titles>
              </div>

              <div>
                {internalPlayer && (
                  <VideoPlayer
                    sources={episodeLinks[0].sources}
                    internalPlayer={internalPlayer}
                    setInternalPlayer={setInternalPlayer}
                    title={episodeLinks[0].titleName}
                  />
                )}
                {!internalPlayer && (
                  <div>
                    <PlayerContainer>
                      <IconContext.Provider
                        value={{
                          size: '1.5rem',
                          color: '#FFFFFF',
                          style: {
                            verticalAlign: 'middle',
                          },
                        }}
                      >
                        <p>External Player (Contain Ads)</p>
                        <div>
                          <div className="tooltip">
                            <button
                              onClick={() => setInternalPlayer(!internalPlayer)}
                            >
                              <HiOutlineSwitchHorizontal />
                            </button>
                            <span className="tooltiptext">Change Server</span>
                          </div>
                        </div>
                      </IconContext.Provider>
                    </PlayerContainer>
                    <IframeWrapper>
                      <iframe
                        id="video"
                        title={episodeLinks[0].title}
                        src={currentServer}
                        allowfullscreen="true"
                        frameborder="0"
                        marginwidth="0"
                        marginheight="0"
                        scrolling="no"
                      ></iframe>
                      {width <= 600 && (
                        <div>
                          <IconContext.Provider
                            value={{
                              size: '1.8rem',
                              color: '#FFFFFF',
                              style: {
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                              },
                            }}
                          >
                            <BiFullscreen
                              onClick={(e) => fullScreenHandler(e)}
                            />
                          </IconContext.Provider>
                        </div>
                      )}
                    </IframeWrapper>
                  </div>
                )}
                {episodeLinks[0].numOfEpisodes > 1 && (
                  <EpisodeButtons>
                    {width <= 600 && (
                      <IconContext.Provider
                        value={{
                          size: '1.8rem',
                          style: {
                            verticalAlign: 'middle',
                          },
                        }}
                      >
                        <EpisodeLinks
                          to={
                            '/watch' +
                            episodeLinks[0].baseEpisodeLink +
                            (parseInt(
                              episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                            ) -
                              1)
                          }
                          style={
                            episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1') === '1'
                              ? {
                                  pointerEvents: 'none',
                                  color: 'rgba(255,255,255, 0.2)',
                                }
                              : {}
                          }
                        >
                          <HiArrowSmLeft />
                        </EpisodeLinks>
                      </IconContext.Provider>
                    )}
                    {width > 600 && (
                      <IconContext.Provider
                        value={{
                          size: '1.3rem',
                          style: {
                            verticalAlign: 'middle',
                            marginBottom: '0.2rem',
                            marginRight: '0.3rem',
                          },
                        }}
                      >
                        <EpisodeLinks
                          to={
                            '/watch' +
                            episodeLinks[0].baseEpisodeLink +
                            (parseInt(
                              episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                            ) -
                              1)
                          }
                          style={
                            episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1') === '1'
                              ? {
                                  pointerEvents: 'none',
                                  color: 'rgba(255,255,255, 0.2)',
                                }
                              : {}
                          }
                        >
                          <HiArrowSmLeft />
                          Previous
                        </EpisodeLinks>
                      </IconContext.Provider>
                    )}
                    {width <= 600 && (
                      <IconContext.Provider
                        value={{
                          size: '1.8rem',
                          style: {
                            verticalAlign: 'middle',
                          },
                        }}
                      >
                        <EpisodeLinks
                          to={
                            '/watch' +
                            episodeLinks[0].baseEpisodeLink +
                            (parseInt(
                              episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                            ) +
                              1)
                          }
                          style={
                            episodeLinks[0].numOfEpisodes ===
                            episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                              ? {
                                  pointerEvents: 'none',
                                  color: 'rgba(255,255,255, 0.2)',
                                }
                              : {}
                          }
                        >
                          <HiArrowSmRight />
                        </EpisodeLinks>
                      </IconContext.Provider>
                    )}

                    {width > 600 && (
                      <IconContext.Provider
                        value={{
                          size: '1.3rem',
                          style: {
                            verticalAlign: 'middle',
                            marginBottom: '0.2rem',
                            marginLeft: '0.3rem',
                          },
                        }}
                      >
                        <EpisodeLinks
                          to={
                            '/watch' +
                            episodeLinks[0].baseEpisodeLink +
                            (parseInt(
                              episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                            ) +
                              1)
                          }
                          style={
                            episodeLinks[0].numOfEpisodes ===
                            episodeSlug.replace(/.*?(\d+)[^\d]*$/, '$1')
                              ? {
                                  pointerEvents: 'none',
                                  color: 'rgba(255,255,255, 0.2)',
                                }
                              : {}
                          }
                        >
                          Next
                          <HiArrowSmRight />
                        </EpisodeLinks>
                      </IconContext.Provider>
                    )}
                  </EpisodeButtons>
                )}
                {!internalPlayer && (
                  <ServersList
                    episodeLinks={episodeLinks}
                    currentServer={currentServer}
                    setCurrentServer={setCurrentServer}
                  />
                )}
              </div>
              {episodeLinks[0].numOfEpisodes > 1 && (
                <EpisodeLinksList
                  episodeArray={episodeLinks[0]?.episodes}
                  episodeNum={parseInt(localStorageDetails)}
                />
              )}
            </div>
          )}
        </Wrapper>
      )}
    </div>
  );
}

const IframeWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* proportion value to aspect ratio 16:9 (9 / 16 = 0.5625 or 56.25%) */
  height: 0;
  overflow: hidden;
  margin-bottom: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0px 4.41109px 20.291px rgba(16, 16, 24, 0.6);
  background-image: url('https://i.ibb.co/28yS92Z/If-the-video-does-not-load-please-refresh-the-page.png');
  background-size: 23rem;
  background-repeat: no-repeat;
  background-position: center;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  div {
    position: absolute;
    z-index: 10;
    padding: 1rem;
  }

  @media screen and (max-width: 600px) {
    padding-bottom: 66.3%;
    background-size: 13rem;
  }
`;

const Wrapper = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const EpisodeButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EpisodeLinks = styled(Link)`
  color: #ffffff;
  padding: 0.6rem 1rem;
  background-color: #404040;
  text-decoration: none;
  font-family: 'Gilroy-Medium', sans-serif;
  border-radius: 0.4rem;

  @media screen and (max-width: 600px) {
    padding: 1rem;
    border-radius: 50%;
  }
`;

const Titles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  margin-bottom: 0.5rem;
  p {
    font-size: 1.7rem;
    font-family: 'Gilroy-Light', sans-serif;
  }

  span {
    font-family: 'Gilroy-Bold', sans-serif;
  }

  a {
    font-family: 'Gilroy-Medium', sans-serif;
    background-color: #404040;
    text-decoration: none;
    color: #ffffff;
    padding: 0.7rem 1.1rem 0.7rem 1.5rem;
    border-radius: 0.4rem;
  }
  @media screen and (max-width: 600px) {
    margin-bottom: 1rem;
    p {
      font-size: 1.3rem;
    }
    a {
      padding: 0.7rem;
      border-radius: 50%;
      margin-left: 1rem;
    }
  }
`;

export default WatchAnime;
