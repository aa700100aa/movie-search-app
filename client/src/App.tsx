import { useEffect, useState } from 'react';
import { fetchMovies, Movie, fetchGenres, Genre } from './api';
import styles from './App.module.css';
import { Helmet } from 'react-helmet-async';

const App = () => {
  //検索キーワード
  const [keyword, setKeyword] = useState('');
  //リリース年
  const [year, setYear] = useState('');
  //検索条件をもとに取得する映画情報
  const [movies, setMovies] = useState<Movie[]>([]);
  //エラー管理
  const [error, setError] = useState<string | null>(null);
  //映画ジャンルを管理
  const [genres, setGenres] = useState<Genre[]>([]);
  //表示するページ数
  const [page, setPage] = useState(1);
  //もっと見るボタンを表示非表示を管理
  const [hasMore, setHasMore] = useState(false);
  //最後に取得したページ数
  const [lastFetchedPage, setLastFetchedPage] = useState(0);
  //最後に表示した20件を保持しておく変数
  const [displayedMovieIds, setDisplayedMovieIds] = useState<number[]>([]);
  //キーワードまたはリリース年が変更された際、全ての状態のリセットを待ってから
  //検索を発火させるためのトリガー
  const [searchTrigger, setSearchTrigger] = useState(0);
  //ローディング状態を監視
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    let cancelled = false;

    //映画情報取得処理
    const loadMovies = async () => {
      //状態をローディング中に変更
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

          //リリース年の指定があれば、取得したデータから該当する映画のみを抽出
          const filtered = year
            ? data.results.filter((movie) => movie.release_date?.startsWith(year))
            : data.results;

          //最後に表示した20件に存在する映画情報だった場合は除外
          const newFiltered = filtered.filter((movie) => !displayedMovieIds.includes(movie.id));
          //表示する映画を配列に追加
          allFiltered = [...allFiltered, ...newFiltered];

          // 20件取得 または 最後のページまで検索し終わる まで処理を継続
          if (allFiltered.length >= 20 || currentPage >= data.total_pages) {
            keepFetching = false;
          } else {
            currentPage++;
          }
        }

        if (!cancelled) {
          // 表示する映画情報をセット
          const sliced = allFiltered.slice(0, 20);
          setMovies((prev) => (page === 1 ? sliced : [...prev, ...sliced]));
          // 今回の20件の映画情報を保持。次の20件を表示する場合に重複を削除するために使用する。
          setDisplayedMovieIds(sliced.map((movie) => movie.id));
          // もっと見るボタンの表示非表示を判定
          const hasMoreData =
            lastData && currentPage <= lastData.total_pages && sliced.length === 20;
          setHasMore(hasMoreData);
          // 次の20件を表示する際に最後に表示したページ内から処理を走らせるためマイナス1
          setLastFetchedPage(currentPage - 1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('映画の取得に失敗しました');
        }
      } finally {
        //ローディング終了
        if (!cancelled) setLoading(false);
      }
    };
    loadMovies();

    // キャンセル処理：次の検索処理実行前にこれが呼ばれる
    return () => {
      cancelled = true;
    };
  }, [searchTrigger, page]);

  useEffect(() => {
    //キーワードが空ならリセット
    if (!keyword) {
      setMovies([]);
      setHasMore(false);
      setLastFetchedPage(0);
      setDisplayedMovieIds([]);
      return;
    }

    // キーワード、リリース年が更新されたならリセット
    setMovies([]);
    setHasMore(false);
    setLastFetchedPage(0);
    setDisplayedMovieIds([]);
    setPage(1);

    // 最後にトリガーを変更（映画情報取得処理が走る）
    setSearchTrigger((prev) => prev + 1);
  }, [keyword, year]);

  //ジャンル取得
  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => console.error('ジャンルの取得に失敗しました'));
  }, []);

  // ジャンルのIDから映画名を取得
  const getGenreNames = (ids: number[] | undefined): string[] => {
    if (!Array.isArray(ids)) return [];
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
          <label className={styles.label}>
            キーワード
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例: 君の名は"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            リリース年
            <div className={styles.selectWrapper}>
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
            </div>
          </label>
        </form>

        {!keyword && (
          <p className={styles.message}>キーワードを入力すると検索結果が表示されます。</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && movies.length === 0 && keyword && !error && (
          <p className={styles.message}>該当する映画が見つかりませんでした。</p>
        )}

        <div className={styles.movieGrid}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <div className={styles.moviePosterWrap}>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className={styles.moviePoster}
                  />
                ) : (
                  <div className={styles.noImage}>no-image</div>
                )}
              </div>
              <h2 className={styles.movieTitle}>{movie.title}</h2>
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
