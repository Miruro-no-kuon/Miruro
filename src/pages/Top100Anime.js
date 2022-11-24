import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AnimeGrid from '../components/AnimeGrid/AnimeGrid';
import SearchResultsSkeleton from '../components/skeletons/SearchResultsSkeleton';
import { Helmet } from 'react-helmet';

function Top100Anime({ changeMetaArr }) {
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = 'Top 100 Anime';
  const content = 'Miruro | Watch The Best Quality Anime Online';
  const image =
    'https://cdn.discordapp.com/attachments/985501610455224389/1041832015105884241/logo512.png';

  useEffect(() => {
    getAnime();
  }, []);
  // React.useEffect(()=>{
  //   changeMetaArr("title", "Top 100 Anime")
  // })
  async function getAnime() {
    window.scrollTo(0, 0);
    let res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/top100?page=1&count=50`
    );
    setLoading(false);
    setAnimeDetails(res.data.data.Page.media);
  }
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta property="description" content={content} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content} />
        <meta property="og:image" content={image} />
      </Helmet>
      {loading && <SearchResultsSkeleton name="Top 100 Anime" />}
      {!loading && (
        <AnimeGrid animeDetails={animeDetails} title="Top 100 Anime" />
      )}
    </div>
  );
}

export default Top100Anime;
