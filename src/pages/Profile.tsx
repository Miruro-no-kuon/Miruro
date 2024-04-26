import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LuConstruction } from 'react-icons/lu';
import { IoLogOutOutline } from 'react-icons/io5';
import Image404URL from '/src/assets/404.webp';
import { useAuth, EpisodeCard, Settings } from '../index';
import { SiAnilist } from 'react-icons/si';
import { CgProfile } from 'react-icons/cg';

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

const WarningMessage = styled.div`
  background-color: var(--global-div-tr);
  padding: 0.5rem;
  border-radius: var(--global-border-radius);
  text-align: center;
  font-size: 0.9rem;
  flex: 1; // Take up equal space when next to each other
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

  svg {
    margin-left: 0.5rem;
    font-size: 1.25rem;
  }
`;
// Profile component
const Profile: React.FC = () => {
  const { isLoggedIn, userData, login, logout } = useAuth();

  // Profile Page Document Title
  useEffect(() => {
    document.title =
      isLoggedIn && userData ? `Profile - ${userData.name}` : 'Profile';
  }, [isLoggedIn, userData]);

  return (
    <PreferencesContainer>
      <TopContainer>
        <ProfileContainer>
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
              <a onClick={logout}>
                <Loginbutton>
                  <b>Log out </b>
                  <IoLogOutOutline />
                </Loginbutton>
              </a>
            </>
          ) : (
            <UserInfoContainer>
              <div style={{ paddingBottom: '2rem' }}>
                <CgProfile size={'5rem'} style={{ marginBottom: '1rem' }} />
                <br />
                <b>Guest User</b>
              </div>
              <a onClick={login}>
                <Loginbutton>
                  <b> Log in with </b>
                  <SiAnilist />
                </Loginbutton>
              </a>
            </UserInfoContainer>
          )}
        </ProfileContainer>
        <WarningMessage>
          <LuConstruction style={{ color: 'orange' }} /> This page is currently{' '}
          <strong style={{ color: 'orange' }}>under construction</strong>. We
          appreciate your patience as we work to bring you new features!
          <br />
          <br />
          <img
            src={Image404URL}
            alt='404 Error'
            style={{
              borderRadius: 'var(--global-border-radius)',
              maxWidth: '100%',
            }}
          />
        </WarningMessage>
      </TopContainer>
      <EpisodeCard />
      <Settings />
    </PreferencesContainer>
  );
};

export default Profile;
