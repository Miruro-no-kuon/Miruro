import React from "react";
import styled from "styled-components";
import CardSkeleton from "../components/Skeletons/CardSkeleton";

interface Recommendation {
  id: number;
  malId: number;
  title: string;
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

interface RecommendationItemProps {
  recommendation: Recommendation;
  loading: boolean;
}

const RecommendationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const RecommendationImage = styled.img`
  width: 100px;
  height: auto;
  margin-right: 1rem;
`;

const RecommendationInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
  loading,
}) => {
  return (
    <RecommendationContainer>
      {loading ? (
        <CardSkeleton loading={loading} />
      ) : (
        <RecommendationImage
          src={recommendation.image}
          alt={recommendation.title}
        />
      )}
      <RecommendationInfo>
        <h3>
          {loading ? <CardSkeleton loading={loading} /> : recommendation.title}
        </h3>
        <p>
          Status:{" "}
          {loading ? <CardSkeleton loading={loading} /> : recommendation.status}
        </p>
        <p>
          Episodes:{" "}
          {loading ? (
            <CardSkeleton loading={loading} />
          ) : (
            recommendation.episodes
          )}
        </p>
        <p>
          Rating:{" "}
          {loading ? <CardSkeleton loading={loading} /> : recommendation.rating}
        </p>
      </RecommendationInfo>
    </RecommendationContainer>
  );
};

export default RecommendationItem;
