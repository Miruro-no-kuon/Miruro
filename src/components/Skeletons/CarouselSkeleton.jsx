import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function CarouselSkeleton() {
  const { height, width } = useWindowDimensions();

  return (
    <div
      style={{
        marginBottom: "2rem",
      }}
    >
      <Skeleton
        height={width <= 600 ? "270px" : "380px"}
        baseColor={"#303436"}
        highlightColor={"#202225"}
        borderRadius={width <= 600 ? "0.5rem" : "0.7rem"}
      />
    </div>
  );
}

export default CarouselSkeleton;
