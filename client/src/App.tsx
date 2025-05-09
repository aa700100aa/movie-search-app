import { useEffect, useState } from 'react';
import { fetchMovies, Movie, fetchGenres, Genre } from './api';
import styles from './App.module.css';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!keyword) {
      setMovies([]);
      setHasMore(false);
      return;
    }

    const loadMovies = async () => {
      try {
        setError(null);
        const data = await fetchMovies(keyword, year, page);

        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }

        setHasMore(data.page < data.total_pages);
      } catch (err) {
        console.error(err);
        setError('映画の取得に失敗しました');
      }
    };

    loadMovies();
  }, [keyword, year, page]);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => console.error('ジャンルの取得に失敗しました'));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [keyword, year]);

  const getGenreNames = (ids: number[]) => {
    return ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  return (
    <main style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>映画検索</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <label>
          キーワード：
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: 君の名は"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>

        <label>
          リリース年：
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">選択してください</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </label>
      </form>

      {!keyword && <p style={{ marginTop: '2rem' }}>キーワードを入力してください。</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {movies.length === 0 && keyword && !error && (
        <p style={{ marginTop: '2rem' }}>該当する映画が見つかりませんでした。</p>
      )}

      <div className={styles.movieGrid}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={movie.title}
              className={styles.moviePoster}
            />
            <h3 className={styles.movieTitle}>{movie.title}</h3>
            <p className={styles.movieDate}>{movie.release_date}</p>
            <div>
              {getGenreNames(movie.genre_ids).map((name) => (
                <span key={name} className={styles.genreBadge}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={{
            margin: '2rem auto',
            display: 'block',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          もっと見る
        </button>
      )}
    </main>
  );
};

export default App;
