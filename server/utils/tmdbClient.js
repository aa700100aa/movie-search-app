import { TMDB_API_KEY } from '../config.js';

import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

//TBDB API 取得処理
export const tmdbGet = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: 'ja-JP',
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`[TMDb Error] ${endpoint}`, error.message);
    throw error;
  }
};
