import styles from './App.module.css';
import { useState } from 'react';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genres: string[];
};

const dummyMovies: Movie[] = [
  {
    id: 1,
    title: '仮の映画1',
    poster_path: 'https://via.placeholder.com/300x450?text=Movie+1',
    release_date: '2023-05-01',
    genres: ['アクション', 'ドラマ'],
  },
  {
    id: 2,
    title: '仮の映画2',
    poster_path: 'https://via.placeholder.com/300x450?text=Movie+2',
    release_date: '2022-11-15',
    genres: ['アニメ', 'ファンタジー'],
  },
  {
    id: 3,
    title: '仮の映画3',
    poster_path: 'https://via.placeholder.com/300x450?text=Movie+3',
    release_date: '2024-02-03',
    genres: ['コメディ'],
  },
  {
    id: 4,
    title: '仮の映画4',
    poster_path: 'https://via.placeholder.com/300x450?text=Movie+4',
    release_date: '2020-08-20',
    genres: ['ホラー', 'スリラー'],
  },
];

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');

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

      <div className={styles.movieGrid}>
        {dummyMovies.map((movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <img src={movie.poster_path} alt={movie.title} className={styles.moviePoster} />
            <h3 className={styles.movieTitle}>{movie.title}</h3>
            <p className={styles.movieDate}>{movie.release_date}</p>
            <div>
              {movie.genres.map((genre) => (
                <span key={genre} className={styles.genreBadge}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
