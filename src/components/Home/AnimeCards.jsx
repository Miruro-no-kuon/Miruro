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
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animeDetails, setAnimeDetails] = useState([]);
  const [cardLimit, setCardLimit] = useState(20); // Set the desired card limit

  // Fetch data when criteria prop changes
  useEffect(() => {
    getData();
  }, [props.criteria]);

  // Function to fetch anime data
  async function getData() {
    try {
      let response;

      // Determine the URL based on the criteria prop
      if (props.criteria === "top/anime") {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_2}${props.criteria}`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          }
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}${props.criteria}`,
          {
            params: {
              page: 1,
              perPage: 20,
            },
          }
        );
      }

      if (response.data) {
        let animeData = [];

        // Process the response data to create a consistent data structure
        if (response.data.results) {
          animeData = response.data.results.map((item) => ({
            id: item.id,
            title:
              item.title.english ||
              item.title.romaji ||
              item.title.native ||
              item.title.userPreferred ||
              item.title.split(":")[0],
            episodeNumber: item.currentEpisode,
            image: item.image,
            type: item.type || null, // Add the "type" property to the item or set it as null if it doesn't exist
          }));
        } else if (Array.isArray(response.data.data)) {
          animeData = response.data.data.map((item) => ({
            id: item.mal_id,
            title: item.title_english || item.title_japanese,
            image: item.images && item.images.jpg && item.images.jpg.image_url,
            type: "TV", // For this case, assuming the type is always "TV"
          }));
        } else {
          console.error("Invalid response structure:", response.data);
        }

        // Clear the existing animeDetails before setting it with new data
        setAnimeDetails(animeData.slice(0, cardLimit)); // Slice the data to the desired card limit
        setLoading(false);
      }
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
            <SwiperSlide key={item.id}>
              <Wrapper>
                <Links to={`/search/${item.title}`}>
                  <img className="card-img" src={item.image} alt="" />
                </Links>
                <p>
                  {item.title.length > 32
                    ? `${item.title.slice(0, 32)} ...`
                    : item.title}
                </p>
                {props.criteria ===
                  "meta/anilist/advanced-search?sort[]=SCORE_DESC&status=RELEASING&year=2023" &&
                  item.episodeNumber && <p>Episode: {item.episodeNumber}</p>}
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

// Styled component for the container
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
    width: 155px;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Gilroy-Medium", sans-serif;

    @media screen and (max-width: 600px) {
      width: 120px;
    }

    @media screen and (max-width: 400px) {
      width: 100px;
    }
  }

  }
`;

// Styled component for links
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
      width: 100px;
      height: 160px;
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
}`;

export default AnimeCards;
