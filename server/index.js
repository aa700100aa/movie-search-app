import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/movies', async (req, res) => {
  const { query, year, page = 1 } = req.query;

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        year,
        page,
        include_adult: false,
        language: 'ja-JP',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('TMDb API Error:', error.message);
    res.status(500).json({ error: 'TMDb API request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express server listening on http://localhost:${PORT}`);
});

app.get('/api/genres', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'ja-JP',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('TMDb Genre API Error:', error.message);
    res.status(500).json({ error: 'ジャンル取得に失敗しました' });
  }
});
