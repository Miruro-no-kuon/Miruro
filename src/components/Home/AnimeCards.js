import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../../components/Skeletons/AnimeCardsSkeleton";
import "swiper/css";
import "swiper/css/scrollbar";

function AnimeCards(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animeDetails, setAnimeDetails] = useState([]);

  useEffect(() => {
    getData();
  }, [props.criteria]);

  // Function to fetch anime data
  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}${props.criteria}?page=1&perPage=20`
      );

      if (response.data && response.data.results) {
        setAnimeDetails((prevData) => [
          ...prevData,
          ...response.data.results.filter((item) =>
            prevData.every((prevItem) => prevItem.id !== item.id)
          ),
        ]);
      } else {
        console.error("Invalid response structure:", response.data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setLoading(false);
    }
  }

  return (
    <div>
      {loading && <AnimeCardsSkeleton />}
      {!loading && (
        <Swiper
          slidesPerView={8}
          spaceBetween={35}
          scrollbar={{
            hide: false,
          }}
          breakpoints={{
            "@0.00": {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            "@0.9": {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            "@1.20": {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            "@1.40": {
              slidesPerView: 6,
              spaceBetween: 35,
            },
            "@1.60": {
              slidesPerView: 7,
              spaceBetween: 35,
            },
            "@1.75": {
              slidesPerView: 8,
              spaceBetween: 35,
            },
          }}
          modules={[Scrollbar]}
          className="mySwiper"
        >
          {animeDetails.map((item, i) => (
            <SwiperSlide>
              <Wrapper>
                <Link
                  to={`/search/${
                    item.title.romaji ||
                    item.title.english ||
                    item.title.native ||
                    item.title.userPreferred ||
                    item.title
                  }`}
                >
                  <img className="card-img" src={item.image} alt="" />
                </Link>
                <p>
                  {item.title.romaji ||
                    item.title.english ||
                    item.title.native ||
                    item.title.userPreferred ||
                    item.title}
                </p>
                <p>{item.episodeNumber && "Episode: " + item.episodeNumber}</p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const Wrapper = styled.div`
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.4rem;
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
    color: #fff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }
`;

const Links = styled(Link)`
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
    color: #fff;
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

export default AnimeCards;
