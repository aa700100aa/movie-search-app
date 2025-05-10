import express from 'express';
import cors from 'cors';

import movieRoutes from './routes/movies.js';
import genreRoutes from './routes/genres.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
