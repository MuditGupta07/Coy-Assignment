import express from 'express';
import cors from 'cors';
import { createDiscoverService, HttpError } from './services/discoverService.js';
import { createDiscoverRouter } from './routes/discover.js';

/** Builds the Express app around a given database (exported for testing). */
export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(createDiscoverRouter(createDiscoverService(db)));

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
