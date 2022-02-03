import { initializeApp } from 'firebase-admin/app';
import { getFirestore, QuerySnapshot } from 'firebase-admin/firestore';
import { Friend } from '../models/friend';
import { ShowPreferences } from '../models/show-preferences';

initializeApp();

const db = getFirestore();

export const getShowPreferencesByUserAndShow = async (
  userId: string,
  showId: string
) => {
  const showRef = db.collection('showPreferences');
  const doc = await showRef
    .where('userId', '==', userId)
    .where('showId', '==', showId)
    .get();
  const preferences = doc.docs[0]?.data();
  return preferences as ShowPreferences;
};

export const getShowPreferencesByUserId = async (id: string) => {
  const showRef = db.collection('showPreferences');
  const doc = await showRef
    .where('userId', '==', id)
    .where('yes', '==', true)
    .get();
  const preferences = doc.docs.map((doc) => doc.data());
  return preferences as ShowPreferences[];
};

export const getShowPreferencesByIds = async (ids: string[]) => {
  const showRef = db.collection('showPreferences');
  const doc = await showRef.where('userId', 'in', ids).get();
  const preferences = doc.docs[0].data();
  return preferences as ShowPreferences;
};

export const saveShowPreferences = async (data: ShowPreferences) => {
  console.log(data);
  await db.collection('showPreferences').doc(data.id).set(data);
};

export const getUsersByName = async (name: string) => {
  console.log(name);
  const results = await db
    .collection('users')
    .where('fullName', '>=', name)
    .where('fullName', '<=', name + '~')
    .orderBy('fullName', 'asc')
    .get();

  const users = results.docs.map((doc) => doc.data());
  return users;
};

export const saveFriend = async (data: Friend) => {
  console.log(data);
  await db.collection('friends').doc(data.id).set(data);
};

export const getFriendByIdAndUserId = async (
  userId: string,
  friendId: string
) => {
  const friendRef = db.collection('friends');
  const doc = await friendRef
    .where('userId', '==', userId)
    .where('friendId', '==', friendId)
    .get();
  console.log(doc);
  const friends = doc.docs.map((doc) => doc.data());
  return friends[0] as Friend;
};

export const getFriends = async (userId: string) => {
  const friendRef = db.collection('friends');
  const doc = await friendRef.where('userId', '==', userId).get();
  console.log(doc);
  const friends = doc.docs.map((doc) => doc.data());
  return friends as Friend[];
};
