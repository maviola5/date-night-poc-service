import Router from '@koa/router';
import { BadRequest } from '../middleware/error-handler';
import {
  getTrending,
  getShowById,
  saveShowPreferences,
  getShowsByUserId,
  getUserList,
  addOrUpdateFriend,
  getFriendsList,
} from '../services/show-service';
import { logger } from '../utils/logger';

const router = new Router();

router.get('/shows/:media/:id', async (ctx) => {
  const { id, media } = ctx.params;
  const userId = ctx.state.user.id;
  if (media !== 'tv' && media !== 'movie') {
    throw new BadRequest('Media must be of type tv or movie.');
  }
  ctx.body = await getShowById(media, id, userId);
});

router.post('/shows/preferences', async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await saveShowPreferences(body);
});

router.get('/shows', async (ctx) => {
  const userId = ctx.state.user.id;
  ctx.body = await getShowsByUserId(userId);
});

router.get('/trending', async (ctx) => {
  console.log(ctx.headers);
  const page = +(ctx.query.page as any);
  ctx.body = await getTrending(page || 1);
});

router.get('/users/:name', async (ctx) => {
  const name = ctx.params.name;
  logger.info({
    message: 'Fetching list of users by name.',
    metadata: { name },
  });
  ctx.body = await getUserList(name);
});

router.post('/users/add_friend', async (ctx) => {
  const body = ctx.request.body;
  const userId = ctx.state.user.id;
  logger.info({
    message: 'Adding user as friend',
    metadata: {
      userId,
      friendId: body.id,
    },
  });
  ctx.body = await addOrUpdateFriend({
    friendAvatar: body.avatar,
    friendId: body.id,
    friendName: body.name,
    userId,
  });
});

router.post('/friends/get', async (ctx) => {
  const userId = ctx.state.user.id;
  logger.info({
    message: 'Fetching friends.',
    metadata: { userId },
  });
  ctx.body = await getFriendsList(userId);
});

export default router;
