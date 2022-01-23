import Router from '@koa/router';
import { getShowById, saveShow } from '../services/show-service';

const router = new Router();

router.get('/shows/:id', async (ctx) => {
  ctx.body = await getShowById(ctx.params.id);
});

router.post('/shows/metadata', async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await saveShow(body);
});

export default router;
