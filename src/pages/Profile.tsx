import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';
import { useAuth, EpisodeCard, WatchingAnilist } from '../index';
import { SiAnilist } from 'react-icons/si';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 1rem;

  @media (min-width: 1000px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ProfileContainer = styled.div`
  position: relative;
  padding: 0.5rem;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
  flex: 1;
  justify-content: center;
  align-items: center;
  p {
    margin: 0.75rem;
  }
  img {
    border-radius: var(--global-border-radius);
    width: 100px;
  }
`;

const PreferencesContainer = styled.div`
  max-width: 80rem;
  margin: auto;
  padding: 0.25rem;
`;

const Loginbutton = styled.div`
  border-radius: var(--global-border-radius);
  display: flex;
  cursor: pointer;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: var(--global-div);
  color: var(--global-text);
  transition: 0.1s ease-in-out;
  width: 10rem; // Fixed width
  margin: 0 auto; // Center horizontally
  &:hover,
  &:active,
  &:focus {
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }

  .svg-wrapper {
    margin-bottom: -0.2rem;
    margin-left: 0.5rem;
    font-size: 1.25rem;
  }
`;
// Profile component
export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData, login, logout } = useAuth();

  // Profile Page Document Title
  useEffect(() => {
    document.title =
      isLoggedIn && userData ? `${userData.name} | Profile` : 'Profile';
  }, [isLoggedIn, userData]);

  const handleSettingsClick = () => {
    navigate('/profile/settings');
  };

  return (
    <PreferencesContainer>
      <TopContainer>
        <ProfileContainer>
          {/* <Loginbutton
            onClick={handleSettingsClick}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              maxWidth: '2.25rem',
            }}
          >
            <FiSettings size={22} />
          </Loginbutton> */}
          {isLoggedIn && userData ? (
            <>
              <img
                src={userData.avatar.large}
                alt={`${userData.name}'s avatar`}
              />
              <p>
                Welcome, <b>{userData.name}</b>
              </p>
              {userData.statistics && (
                <>
                  <p>
                    Anime watched: <b>{userData.statistics.anime.count}</b>
                  </p>
                  <p>
                    Total episodes watched:{' '}
                    <b>{userData.statistics.anime.episodesWatched}</b>
                  </p>
                  <p>
                    Total minutes watched:{' '}
                    <b>{userData.statistics.anime.minutesWatched}</b>
                  </p>
                  <p>
                    Average score:{' '}
                    <b>{userData.statistics.anime.meanScore.toFixed(2)}</b>
                  </p>
                </>
              )}
              <Loginbutton onClick={logout}>
                <b>Log out </b>
                <span className='svg-wrapper'>
                  <IoLogOutOutline />
                </span>
              </Loginbutton>
            </>
          ) : (
            <UserInfoContainer>
              <CgProfile size={'5rem'} style={{ marginBottom: '1rem' }} />
              <p>Guest</p>
              <p>Please log in to view your profile and AniList</p>
              <a onClick={login}>
                <Loginbutton>
                  <b>Log in with </b>
                  <span className='svg-wrapper'>
                    <SiAnilist />
                  </span>
                </Loginbutton>
              </a>
            </UserInfoContainer>
          )}
        </ProfileContainer>
      </TopContainer>
      <EpisodeCard />
      <WatchingAnilist />
    </PreferencesContainer>
  );
};

export default Profile;
