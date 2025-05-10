export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export const fetchMovies = async (
  keyword: string,
  year: string,
  page: number = 1
): Promise<MovieResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('query', keyword);
  if (year) params.append('year', year);
  params.append('page', page.toString());

  const url = `http://localhost:3001/api/movies?${params.toString()}`;
  console.log('📡 fetchMovies URL:', url); // ← 追加
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ fetchMovies failed response:', text);
    throw new Error('検索に失敗しました');
  }

  return await res.json();
};

export type Genre = {
  id: number;
  name: string;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const res = await fetch('http://localhost:3001/api/genres');
  if (!res.ok) throw new Error('ジャンルの取得に失敗しました');
  return (await res.json()).genres;
};
