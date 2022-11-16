import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import "swiper/css";
import "swiper/css/scrollbar";

function AnimeCardsSkeleton() {
  const { height, width } = useWindowDimensions();

  return (
    <div
      style={{
        marginBottom: "1rem",
      }}
    >
      <Swiper
        slidesPerView={7}
        spaceBetween={35}
        scrollbar={{
          hide: true,
        }}
        breakpoints={{
          "@0.00": {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          "@0.75": {
            slidesPerView: 3,
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
        {[...Array(8)].map((x, i) => (
          <SwiperSlide>
            <Skeleton
              width={
                width <= 600 ? (width <= 400 ? "100px" : "120px") : "160px"
              }
              height={
                width <= 600 ? (width <= 400 ? "160px" : "180px") : "235px"
              }
              borderRadius={"0.5rem"}
              baseColor={"#808080"}
              highlightColor={"#404040"}
            />
            <Skeleton
              width={width <= 600 ? "120px" : "160px"}
              baseColor={"#808080"}
              highlightColor={"#404040"}
              count={2}
              style={{
                marginTop: "1rem",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default AnimeCardsSkeleton;
