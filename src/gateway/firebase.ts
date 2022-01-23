import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Metadata } from '../models/metadata';

initializeApp();

const db = getFirestore();

export const getMetadataById = async (
  id: string,
  collection: 'movies' | 'shows'
) => {
  const movieRef = db.collection(collection).doc(id);
  const doc = await movieRef.get();
  const metadata = doc.data();
  return metadata as Metadata;
};

export const saveMetadata = async (
  id: string,
  collection: 'movies' | 'shows',
  data: Metadata
) => {
  await db.collection(collection).doc(id).set(data);
};
