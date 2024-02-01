import React, { useState, useEffect } from "react";
import CardGrid from "../Cards/CardGrid";
import { fetchContinueWatching, fetchAnimeInfo } from "../hooks/useApi";
import CardSkeleton from "../components/Skeletons/CardSkeleton";

const ContinueWatching = () => {
  const [continueWatchingData, setContinueWatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const continueData = await fetchContinueWatching();
        const animeInfoPromises = continueData.map((item) =>
          fetchAnimeInfo(item.animeId)
        );
        const animeDetails = await Promise.all(animeInfoPromises);

        // Combine continue watching data with detailed anime info
        const combinedData = continueData.map((item, index) => ({
          ...item,
          ...animeDetails[index],
        }));

        setContinueWatchingData(combinedData);
      } catch (error) {
        console.error("Failed to fetch continue watching data:", error);
        setError("Failed to load continue watching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, []);

  if (loading) {
    // Replace with a series of CardSkeleton components
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Continue Watching</h2>
      <CardGrid animeData={continueWatchingData} />
    </div>
  );
};

export default ContinueWatching;
