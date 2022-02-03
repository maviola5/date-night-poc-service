import {
  getShowById as tmdbGetShowById,
  getWatchProviders,
  getRecommended,
  getTrending as tmdbGetTrending,
} from '../gateway/tmdb-client';
import {
  getFriendByIdAndUserId,
  getShowPreferencesByUserAndShow,
  getShowPreferencesByUserId,
  getUsersByName,
  saveFriend,
  saveShowPreferences as save,
  getFriends,
} from '../gateway/firebase';
import { ShowPreferences } from '../models/show-preferences';
import { logger } from '../utils/logger';
import { v4 as uuid } from 'uuid';
import { shuffle } from '../utils/shuffle';
import { Media } from '../models/tmdb';
import { BadRequest } from '../middleware/error-handler';

export const getShowById = async (
  media: Media,
  showId: string,
  userId: string
) => {
  logger.info({
    message: 'Fetching show data',
    metadata: { media, showId, userId },
  });
  const [show, providers, recommended] = await Promise.all([
    tmdbGetShowById(media, showId),
    getWatchProviders(media, showId),
    getRecommended(media, showId),
    getShowPreferencesByUserAndShow(userId, showId),
  ]);

  return {
    ...show,
    providers,
    recommended,
  };
};

export const validateChanges = (changes: ShowPreferences) => {
  if (changes.yes && changes.no) {
    throw new BadRequest('Show can not be both liked and disliked.');
  }

  if (changes.yes) {
    changes.no = false;
  }
  if (changes.no) {
    changes.yes = false;
  }
  return changes;
};

export const saveShowPreferences = async (preferences: ShowPreferences) => {
  logger.info({
    message: 'Fetching show preferences.',
    metadata: { showId: preferences.showId },
  });

  const existing = await getShowPreferencesByUserAndShow(
    preferences.userId,
    preferences.showId
  );
  console.log(existing);
  const preferencesId = existing?.id || uuid();

  const validatedChanges = validateChanges(preferences);

  logger.info({
    message: 'Saving show preferences.',
    metadata: { showId: preferences.id },
  });
  await save({ ...validatedChanges, id: preferencesId });
};

export const getTrending = async (page: number) => {
  logger.info({
    message: 'Fetching trending movies & shows.',
    metadata: {
      page,
    },
  });
  const [moviesResult, tvResults] = await Promise.all([
    tmdbGetTrending('movie', page),
    tmdbGetTrending('tv', page),
  ]);

  return {
    page: moviesResult.page,
    results: shuffle(moviesResult.results, tvResults.results),
  };
};

export const getShowsByUserId = async (userId: string) => {
  const result = await getShowPreferencesByUserId(userId);
  return result;
};

export const getUserList = async (name: string) => {
  const result = await getUsersByName(name);
  return result;
};

export interface AddFriendInput {
  id?: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
}

export const addOrUpdateFriend = async (input: AddFriendInput) => {
  const { userId, friendId } = input;
  logger.info({
    message: 'Checking if friend exists.',
    metadata: {
      userId,
      friendId,
      input,
    },
  });
  const result = await getFriendByIdAndUserId(userId, friendId);
  const data = { ...result, ...input, id: result?.id || uuid() };
  console.log('Saving friend.', { ...data });
  await saveFriend(data);
  return data;
};

export const getFriendsList = async (userId: string) => {
  const result = await getFriends(userId);
  return result || [];
};
