import {
  getShowById,
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
import { log } from '../utils/logger';
import { v4 as uuid } from 'uuid';
import { shuffle } from '../utils/shuffle';
import { Media } from '../models/tmdb';
import { BadRequest, UnauthorizedRequest } from '../middleware/error-handler';

export const getShowPreferenceById = async (
  media: Media,
  showId: string,
  userId: string
) => {
  log('Fetching show data', { media, showId, userId });
  const [show, providers, recommended] = await Promise.all([
    getShowById(media, showId),
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
  const { showId, userId } = preferences;
  log('Fetching show preferences.', { showId, userId });
  const existing = await getShowPreferencesByUserAndShow(
    preferences.userId,
    preferences.showId
  );
  const preferencesId = existing?.id || uuid();
  const validatedChanges = validateChanges(preferences);

  log('Saving show preferences.', { preferencesId, showId, userId });
  await save({ ...validatedChanges, id: preferencesId });
};

export const getTrending = async (page: number) => {
  log('Fetching trending movies & shows.', { page });
  const [moviesResult, tvResults] = await Promise.all([
    tmdbGetTrending('movie', page),
    tmdbGetTrending('tv', page),
  ]);
  return {
    page: moviesResult.page,
    results: shuffle(moviesResult.results, tvResults.results),
  };
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
  log('Checking if friend exists.', { userId, friendId, input });
  const result = await getFriendByIdAndUserId(userId, friendId);
  const data = { ...result, ...input, id: result?.id || uuid() };
  await saveFriend(data);
  return data;
};

export const getFriendsList = async (userId: string) => {
  const result = await getFriends(userId);
  return result || [];
};

export const getShowPreferencesByFriendId = async (
  userId: string,
  friendId: string
) => {
  log('Checking if user is a friend', { userId, friendId });
  const friend = await getFriendByIdAndUserId(userId, friendId);
  if (friend) {
    const result = await getShowPreferencesByUserId(friendId);
    return result || [];
  } else {
    throw new UnauthorizedRequest('User is not a friend.');
  }
};
