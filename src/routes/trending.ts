import Router from '@koa/router';
import { getTrending } from '../gateway/tmdb-client';

const router = new Router();

router.get('/trending', async (ctx) => {
  ctx.body = await getTrending();
});

export default router;
