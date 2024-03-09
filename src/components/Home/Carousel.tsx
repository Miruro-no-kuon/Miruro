import { FC } from "react";
import styled, { keyframes } from "styled-components";
import { FaPlay } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router-dom";
import BannerNotFound from "/src/assets/miruro-banner-dark-bg.webp";

// Correctly type your data
interface SlideData {
  id: string;
  image: string;
  cover: string;
  title: {
    romaji: string;
    english: string;
  };
  description: string;
}

// Styled components for the Carousel

const StyledSwiperContainer = styled(Swiper)`
  position: relative;
  max-width: 100%;
  height: 24rem;
  margin-bottom: 2rem;
  border-radius: 0.2rem;
  cursor: grab;

  @media (max-width: 1000px) {
    height: 20rem;
  }
  @media (max-width: 500px) {
    height: 18rem;
  }
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  animation: ${keyframes`
    0% {
      opacity: 0.4;
      transform: scale(0.965);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `} 0.2s ease-in-out forwards;
`;

const DarkOverlay = styled.div`
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.2rem;
  z-index: 1;
  background: linear-gradient(45deg, rgba(8, 8, 8, 1) 0%, transparent 55%);
`;

const SlideImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.2rem;
`;

const SlideImage = styled.img<{ $cover: string; $image: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.2rem;
  position: absolute;
  content: ${(props) =>
    props.$cover === props.$image ? BannerNotFound : props.$cover};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const SlideContent = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 1.5rem;
  z-index: 5;
  max-width: 60%;

  @media (max-width: 1000px) {
    left: 1rem;
    bottom: 1.5rem;
  }
`;

const SlideTitle = styled.h2`
  color: var(--white, #fff);
  font-size: clamp(1.2rem, 3vw, 3rem);
  margin: auto;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 500px) {
    white-space: nowrap;
    max-width: 100%;
  }
`;

const SlideDescription = styled.p<{
  $maxLines: boolean;
}>`
  color: var(--white, #ccc);
  background: transparent;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  line-height: 1;
  margin-bottom: 0;
  max-width: 50%;
  max-height: 4rem;
  overflow: hidden;

  @media (max-width: 1000px) {
    line-height: 1.2;
    max-width: 70%;
    font-size: clamp(0.8rem, 1.2vw, 0.9rem);
    max-height: 3rem;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    font-size: clamp(0.7rem, 1vw, 0.8rem);
    max-height: 2.5rem;
  }

  /* Add overflow-y: auto if the content exceeds max height */
  overflow-y: ${({ $maxLines }) => ($maxLines ? "auto" : "hidden")};
`;

const PlayButtonWrapper = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  z-index: 5;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */

  @media (max-width: 1000px) {
    right: 1.5rem;
    bottom: 1.5rem;
  }
`;

const PlayButton = styled.button`
  background-color: var(--global-button-bg);
  color: var(--global-text);
  border: none;
  border-radius: 0.4rem;
  font-size: 1rem; /* Increased font size */
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
  padding: 1.2rem 2rem; /* Increased padding */
  display: flex;
  align-items: center;

  &:hover {
    background-color: var(--primary-accent-bg);
    transform: scale(1.05); /* Slightly larger scale on hover */
  }

  @media (max-width: 1000px) {
    padding: 1rem 2rem; /* Adjusted for medium-sized devices */
  }

  @media (max-width: 500px) {
    border-radius: 50%;
    padding: 1.25rem; /* Adjusted for small devices */
    font-size: 1rem; /* Adjusted font size for small devices */
    span {
      display: none;
    }
  }
`;

const PlayIcon = styled(FaPlay)`
  margin-right: 0.5rem;
  @media (max-width: 500px) {
    margin-right: 0;
  }
`;
const PaginationStyle = styled.div`
  .swiper-pagination-bullet {
    background: var(--global-primary-bg, #007bff);
    opacity: 0.7;
    margin: 0 3px;
  }

  .swiper-pagination-bullet-active {
    background: var(--global-text);
    opacity: 1;
  }
`;

// Adjust the Carousel component to use correctly typed props and state
const Carousel: FC<{ data: SlideData[] }> = ({ data = [] }) => {
  const navigate = useNavigate();

  const handlePlayButtonClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  const truncateTitle = (title: string, maxLength: number = 40): string => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const validData = data.filter(
    (item) => item.title && item.title.english && item.description
  );

  return (
    <PaginationStyle>
      <StyledSwiperContainer
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
          type: "bullets",
        }}
      >
        {validData.map(({ id, image, cover, title, description }) => (
          <StyledSwiperSlide key={id}>
            <SlideImageWrapper>
              <SlideImage
                src={cover === image ? BannerNotFound : cover}
                alt={title.english}
                $cover={cover} // Managed outside, but kept for styled component
                $image={image} // Managed outside, but kept for styled component
                loading="lazy"
              />
              <ContentWrapper>
                <SlideContent>
                  <SlideTitle>{truncateTitle(title.english)}</SlideTitle>
                  <SlideDescription
                    dangerouslySetInnerHTML={{ __html: description }}
                    $maxLines={description.length > 200}
                  />
                </SlideContent>
                <PlayButtonWrapper>
                  <PlayButton onClick={() => handlePlayButtonClick(id)}>
                    <PlayIcon />
                    <span>Play Now</span>
                  </PlayButton>
                </PlayButtonWrapper>
              </ContentWrapper>
              <DarkOverlay />
            </SlideImageWrapper>
          </StyledSwiperSlide>
        ))}
        <div className="swiper-pagination"></div>
      </StyledSwiperContainer>
    </PaginationStyle>
  );
};

export default Carousel;
