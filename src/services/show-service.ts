import {
  getShowById as tmdbGetShowById,
  getShowWatchProviders,
  getRecommendedShows,
} from '../gateway/tmdb-client';
import { logger } from '../utilities/logger';
import { getMetadataById, saveMetadata } from '../gateway/firebase';
import { Metadata } from '../models/metadata';

export const getShowById = async (id: string) => {
  logger.info({ message: 'Fetching show data', movieId: id });
  const [show, providers, recommended, metadata] = await Promise.all([
    tmdbGetShowById(id),
    getShowWatchProviders(id),
    getRecommendedShows(id),
    getMetadataById(id, 'shows'),
  ]);

  return {
    ...show,
    metadata,
    providers,
    recommended,
  };
};

export const saveShow = async (metaData: Metadata) => {
  logger.info({ message: 'Saving show', movieId: metaData.id });
  await saveMetadata(metaData.id, 'shows', metaData);
};
