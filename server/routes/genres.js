import express from 'express';
import { tmdbGet } from '../utils/tmdbClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await tmdbGet('/genre/movie/list');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'ジャンル取得に失敗しました' });
  }
});

export default router;
