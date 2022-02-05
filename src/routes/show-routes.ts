import Router from '@koa/router';
import { getShowPreferencesByUserId, removeFriend } from '../gateway/firebase';
import { BadRequest } from '../middleware/error-handler';
import {
  getTrending,
  saveShowPreferences,
  getUserList,
  addOrUpdateFriend,
  getFriendsList,
  getShowPreferencesByFriendId,
  getShowPreferenceById,
} from '../services/show-service';
import { log } from '../utils/logger';

const router = new Router();

/**
 * Shows
 */
router.post('/shows/get_trending', async (ctx) => {
  const userId = ctx.state.user.id;
  const page = ctx.request.body.page;
  log('Fetching trending shows', { userId, page });
  ctx.body = await getTrending(page || 1);
});

/**
 * Show Preferences
 */
router.post('/show_preferences/list', async (ctx) => {
  const userId = ctx.state.user.id;
  log('Fetching show preferences.', { userId });
  ctx.body = await getShowPreferencesByUserId(userId);
});

router.post('/show_preferences/add', async (ctx) => {
  // TODO: validate post body
  const body = ctx.request.body;
  const userId = ctx.state.user.id;
  log('Setting show preference.', {
    ...body,
    userId,
  });
  ctx.body = await saveShowPreferences({ ...body, userId });
});

router.post('/show_preferences/get', async (ctx) => {
  const { id, media } = ctx.params;
  const userId = ctx.state.user.id;
  if (media !== 'tv' && media !== 'movie') {
    throw new BadRequest('Media must be of type tv or movie.');
  }
  ctx.body = await getShowPreferenceById(media, id, userId);
});

router.post('/show_preferences/list_by_friend', async (ctx) => {
  const userId = ctx.state.user.id;
  const friendId = ctx.request.body.friendId;
  log('Fetching friends show preferences', { userId, friendId });
  ctx.body = await getShowPreferencesByFriendId(userId, friendId);
});

/**
 * Users
 */
router.post('/users/list', async (ctx) => {
  const name = ctx.request.body.name;
  const userId = ctx.state.user.id;
  log('Fetching list of users by name.', { name, userId });
  ctx.body = await getUserList(name);
});

/**
 * Friends
 */
router.post('/friends/add', async (ctx) => {
  const body = ctx.request.body;
  const userId = ctx.state.user.id;
  log('Adding user as friend', { userId, friendId: body.id });
  ctx.body = await addOrUpdateFriend({
    friendAvatar: body.avatar,
    friendId: body.id,
    friendName: body.name,
    userId,
  });
});

router.post('/friends/list', async (ctx) => {
  const userId = ctx.state.user.id;
  log('Fetching friends.', { userId });
  ctx.body = await getFriendsList(userId);
});

router.post('/friends/remove', async (ctx) => {
  const userId = ctx.state.user.id;
  const id = ctx.request.body.id;
  log('Removing friend', { userId, id });
  ctx.body = await removeFriend(id);
});

export default router;
