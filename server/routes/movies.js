import express from 'express';
import { tmdbGet } from '../utils/tmdbClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { query, year, page = 1 } = req.query;
  try {
    const data = await tmdbGet('/search/movie', {
      query,
      year,
      page,
      include_adult: false,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '映画検索に失敗しました' });
  }
});

export default router;
