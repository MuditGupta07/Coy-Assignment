import { Router } from 'express';

export function createDiscoverRouter(service) {
  const router = Router();

  router.get('/feed', (_req, res) => {
    res.json(service.getFeed());
  });

  router.post('/swipe', (req, res) => {
    const { profileId, direction } = req.body ?? {};
    res.json(service.swipe(profileId, direction));
  });

  router.get('/matches', (_req, res) => {
    res.json(service.getMatches());
  });

  return router;
}
