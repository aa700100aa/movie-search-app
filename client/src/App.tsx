import { useEffect, useState } from 'react';
import { fetchMovies, Movie, fetchGenres, Genre } from './api';
import styles from './App.module.css';
import { Helmet } from 'react-helmet-async';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastFetchedPage, setLastFetchedPage] = useState(0);
  //前回表示した20件を保持しておく変数
  const [displayedMovieIds, setDisplayedMovieIds] = useState<number[]>([]);
  //キーワードまたはリリース年が変更された際、全ての状態のリセットを待ってから
  //検索を発火させるためのトリガー
  const [searchTrigger, setSearchTrigger] = useState(0);
  //ローディング状態を監視
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    let cancelled = false; // 🔧 キャンセル用フラグ

    const loadMovies = async () => {
      setLoading(true);
      try {
        setError(null);
        let allFiltered: Movie[] = [];
        let currentPage = lastFetchedPage + 1;
        let keepFetching = true;
        let lastData = null;

        while (keepFetching && !cancelled) {
          const data = await fetchMovies(keyword, '', currentPage);
          lastData = data;

          const filtered = year
            ? data.results.filter((movie) => movie.release_date?.startsWith(year))
            : data.results;

          const newFiltered = filtered.filter((movie) => !displayedMovieIds.includes(movie.id));

          allFiltered = [...allFiltered, ...newFiltered];

          if (allFiltered.length >= 20 || currentPage >= data.total_pages) {
            keepFetching = false;
          } else {
            currentPage++;
          }
        }

        if (!cancelled) {
          const sliced = allFiltered.slice(0, 20);
          setMovies((prev) => (page === 1 ? sliced : [...prev, ...sliced]));
          setDisplayedMovieIds(sliced.map((movie) => movie.id));
          const hasMoreData =
            lastData && currentPage <= lastData.total_pages && sliced.length === 20;
          setHasMore(hasMoreData);
          setLastFetchedPage(currentPage - 1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('映画の取得に失敗しました');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMovies();

    // 🔁 キャンセル処理：次の useEffect 実行前にこれが呼ばれる
    return () => {
      cancelled = true;
    };
  }, [searchTrigger, page]);

  useEffect(() => {
    if (!keyword) {
      setMovies([]);
      setHasMore(false);
      setLastFetchedPage(0);
      setDisplayedMovieIds([]);
      return;
    }

    // 🔁 状態リセット → 検索準備完了後にトリガーだけ更新
    setMovies([]);
    setHasMore(false);
    setLastFetchedPage(0);
    setDisplayedMovieIds([]);
    setPage(1);

    // ✅ 最後にトリガーを変更（検索用 useEffect が走る）
    setSearchTrigger((prev) => prev + 1);
  }, [keyword, year]);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => console.error('ジャンルの取得に失敗しました'));
  }, []);

  const getGenreNames = (ids: number[]) => {
    return ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  return (
    <>
      <Helmet>
        {console.log('Helmet rendering with keyword:', keyword)}
        <title>
          {keyword
            ? `「${keyword}」${year ? `（${year}年）` : ''} の検索結果 - 映画検索アプリ`
            : '映画検索アプリ'}
        </title>
      </Helmet>
      <main className={styles.main}>
        <h1>映画検索</h1>

        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <label>
            キーワード：
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例: 君の名は"
              className={styles.input}
            />
          </label>

          <label>
            リリース年：
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.select}
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

        {!keyword && <p className={styles.message}>キーワードを入力してください。</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && movies.length === 0 && keyword && !error && (
          <p className={styles.message}>該当する映画が見つかりませんでした。</p>
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

        {loading && <div className={styles.spinner}></div>}

        {!loading && hasMore && (
          <button onClick={() => setPage((prev) => prev + 1)} className={styles.loadMore}>
            もっと見る
          </button>
        )}
      </main>
    </>
  );
};

export default App;
