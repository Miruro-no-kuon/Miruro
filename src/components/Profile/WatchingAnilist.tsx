import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth, useUserAnimeList, MediaListStatus } from '../../index';
import { CardGrid } from '../../index';

const Container = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const NoEntriesMessage = styled.div`
  margin: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NotLoggedIn = styled.div`
  margin: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const StatusDropdown = styled.select`
  margin-left: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border: none;
`;

const statusLabels = {
  CURRENT: 'Watching',
  PLANNING: 'Plan to Watch',
  COMPLETED: 'Completed',
  REPEATING: 'Re-watching',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
};

const apiStatusToUserFriendly = {
  FINISHED: 'Completed',
  RELEASING: 'Ongoing',
  NOT_YET_RELEASED: 'Not yet aired',
  CANCELLED: 'Cancelled',
  HIATUS: 'Paused',
};

export const WatchingAnilist = () => {
  const { isLoggedIn, userData } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>(
    localStorage.getItem('selectedStatus') || 'CURRENT',
  );

  useEffect(() => {
    if (isLoggedIn && userData) {
      console.log('User is logged in, username:', userData.name);
    } else {
      console.log('User is not logged in or userData is not available');
    }
  }, [isLoggedIn, userData]);

  const { animeList, loading, error } = useUserAnimeList(
    userData?.name,
    selectedStatus as MediaListStatus,
  );

  if (!isLoggedIn)
    return <NotLoggedIn>Please Log in to view your AniList.</NotLoggedIn>;
  if (loading) return <NoEntriesMessage>Loading...</NoEntriesMessage>;
  if (error)
    return (
      <NoEntriesMessage>
        Error loading anime list: {error.message}
      </NoEntriesMessage>
    );

  const animeData = animeList.lists.flatMap((list) =>
    list.entries.map((entry) => ({
      id: entry.media.id,
      image: entry.media.coverImage.large,
      title: {
        romaji: entry.media.title.romaji,
        english: entry.media.title.english || entry.media.title.romaji,
      },
      status: apiStatusToUserFriendly[entry.media.status] || 'Unknown',
      rating: entry.media.averageScore,
      releaseDate: entry.media.startDate.year,
      totalEpisodes: entry.media.episodes,
      color: entry.media.coverImage.color,
      type: entry.media.format,
    })),
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    localStorage.setItem('selectedStatus', newStatus);
  };

  return (
    <Container>
      <h3>
        AniList
        <StatusDropdown value={selectedStatus} onChange={handleStatusChange}>
          {Object.values(MediaListStatus).map((status) => (
            <option key={status} value={status}>
              {statusLabels[status] || status}
            </option>
          ))}
        </StatusDropdown>
      </h3>
      {animeData.length > 0 ? (
        <CardGrid
          animeData={animeData}
          hasNextPage={false}
          onLoadMore={() => {}}
        />
      ) : (
        <NoEntriesMessage>No Results</NoEntriesMessage>
      )}
    </Container>
  );
};
