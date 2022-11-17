import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper';
import AnimeCardsSkeleton from '../skeletons/AnimeCardsSkeleton';
import { IoClose } from 'react-icons/io5';
import { IconContext } from 'react-icons';

import 'swiper/css';
import 'swiper/css/scrollbar';

const anilistUrl = 'https://graphql.anilist.co';
let searchAnimeQuery = `
	query($search: String) {
		Media (search : $search, type: ANIME, sort:POPULARITY_DESC) {
			title {
				english
				english
				userPreferred
			}
			bannerImage
			coverImage{
				extraLarge
				large
			}
		}
	}
`;

function WatchingEpisodes({ confirmRemove, setConfirmRemove }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      let lsData = localStorage.getItem('Animes');
      lsData = JSON.parse(lsData);
      let apiRes = [];

      for (let i = 0; i < lsData.Names.length; i++) {
        let name = lsData.Names[i].name;
        let anilistResponse;
        try {
          anilistResponse = await axios({
            url: anilistUrl,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            data: {
              query: searchAnimeQuery,
              variables: {
                search: name.replace(' (Dub)', '').replace(' (TV)', ''),
              },
            },
          });
        } catch (err) {
          console.log('Error from getanime anilist api call', err);
          apiRes.push({
            name,
            coverImage: 'https://i.ibb.co/RYhg4tH/banner-not-found.jpg',
            link: lsData.Names[i].episodeLink,
            episodeNum: lsData.Names[i].currentEpisode,
            index: i,
          });
          continue;
        }
        apiRes.push({
          name,
          coverImage: anilistResponse.data.data.Media.coverImage.extraLarge,
          link: lsData.Names[i].episodeLink,
          episodeNum: lsData.Names[i].currentEpisode,
          index: i,
        });
      }
      setData(apiRes);
      setConfirmRemove(apiRes.map(() => false));
      setLoading(false);
    }
    getData();
  }, [setConfirmRemove]);

  function removeAnime(ev) {
    if (!confirmRemove.length) return;
    const index = parseInt(ev.currentTarget.dataset.index);
    if (confirmRemove[index]) {
      let lsData = localStorage.getItem('Animes');
      lsData = JSON.parse(lsData);
      lsData.Names.splice(index, 1);
      lsData = JSON.stringify(lsData);
      localStorage.setItem('Animes', lsData);
      setData((data) => [...data.slice(0, index), ...data.slice(index + 1)]);
      setConfirmRemove([
        ...confirmRemove.slice(0, index),
        ...confirmRemove.slice(index + 1),
      ]);
    } else {
      setConfirmRemove([
        ...confirmRemove.slice(0, index),
        true,
        ...confirmRemove.slice(index + 1),
      ]);
    }
  }

  function cancelRemoveAnime(ev) {
    if (!confirmRemove.length) return;
    const index = parseInt(ev.currentTarget.dataset.index);
    setConfirmRemove([
      ...confirmRemove.slice(0, index),
      false,
      ...confirmRemove.slice(index + 1),
    ]);
  }

  return (
    <div>
      {loading && <AnimeCardsSkeleton />}
      {!loading && (
        <Swiper
          slidesPerView={7}
          spaceBetween={35}
          scrollbar={{
            hide: false,
          }}
          breakpoints={{
            '@0.00': {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            '@0.75': {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            '@1.00': {
              slidesPerView: 4,
              spaceBetween: 35,
            },
            '@1.30': {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            '@1.50': {
              slidesPerView: 7,
              spaceBetween: 35,
            },
          }}
          modules={[Scrollbar]}
          className="mySwiper"
        >
          {data.map((item, i) => (
            <SwiperSlide key={i}>
              <Wrapper>
                <IconContext.Provider
                  value={{
                    size: '1.2rem',
                    color: '#FFFFFF',
                    style: {
                      verticalAlign: 'middle',
                    },
                  }}
                >
                  <ConfirmRemove>
                    <button
                      className={
                        'removeButton' + (confirmRemove[i] ? ' confirm' : '')
                      }
                      data-index={i}
                      onClick={removeAnime}
                    >
                      {confirmRemove[i] ? <span>Remove</span> : <IoClose />}
                    </button>
                    {confirmRemove[i] && (
                      <button data-index={i} onClick={cancelRemoveAnime}>
                        Cancel
                      </button>
                    )}
                  </ConfirmRemove>
                </IconContext.Provider>

                <Link to={'watch/' + item.link}>
                  <img src={item.coverImage} alt="" />
                </Link>
                <p>{item.name}</p>
                <p className="episodeNumber">{`Episode ${item.episodeNum}`}</p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const ConfirmRemove = styled.div`
  position: absolute;
  top: 0;
`;

const Wrapper = styled.div`
  position: relative;
  button {
    font-family: 'Gilroy-Regular', sans-serif;
    cursor: pointer;
    outline: none;
    border: none;
    color: #fff;
    padding: 0.5rem;
    width: 80px;
    border-bottom-right-radius: 0.5rem;
    background-color: rgba(10, 10, 10, 0.75);
    transition: 0.3s;

    :hover {
      background-color: rgba(10, 10, 10, 1);
    }
  }
  .removeButton {
    border-top-left-radius: 0.5rem;
    border-bottom-right-radius: 0rem;
    &.confirm {
      background-color: rgba(200, 0, 0, 0.75);
      :hover {
        background-color: rgba(200, 0, 0, 1);
      }
    }
  }
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.5rem;
    margin-bottom: 0.3rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
    }
    @media screen and (max-width: 400px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: #ffffff;
    font-size: 1rem;
    font-family: 'Gilroy-Medium', sans-serif;
    @media screen and (max-width: 600px) {
      max-width: 120px;
    }
    @media screen and (max-width: 400px) {
      max-width: 100px;
    }
  }

  .episodeNumber {
    font-family: 'Gilroy-Regular', sans-serif;
    color: #969696;
    font-size: 0.8em;
  }
`;

export default WatchingEpisodes;
