import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../../components/skeletons/AnimeCardsSkeleton";

import "swiper/css";
import "swiper/css/scrollbar";

function AnimeCards(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    let res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/${props.criteria}?page=1&count=${props.count}`
    );
    setLoading(false);
    setData(res.data.data.Page.media);
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
            "@0.00": {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            "@0.75": {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            "@1.00": {
              slidesPerView: 4,
              spaceBetween: 35,
            },
            "@1.30": {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            "@1.50": {
              slidesPerView: 7,
              spaceBetween: 35,
            },
          }}
          modules={[Scrollbar]}
          className="mySwiper"
        >
          {data.map((item, i) => (
            <SwiperSlide>
              <Wrapper>
                <Link
                  to={
                    "search/" +
                    (item.title.userPreferred !== null
                      ? item.title.userPreferred
                      : item.title.english)
                  }
                >
                  <img className="card-img" src={item.coverImage.large} alt="" />
                </Link>
                <p>
                  {item.title.english !== null
                    ? item.title.english
                    : item.title.english}
                </p>
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
   color: #fff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }

`;

export default AnimeCards;
