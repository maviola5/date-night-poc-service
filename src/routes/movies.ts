import Router from '@koa/router';
import { getMovieById, saveMovie } from '../services/movie-service';

const router = new Router();

router.get('/movies/:id', async (ctx) => {
  ctx.body = await getMovieById(ctx.params.id);
});

router.post('/movies/metadata', async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await saveMovie(body);
});

export default router;
