import {
  getMovieById as tmdbGetMovieById,
  getMovieWatchProviders,
  getRecommendedMovies,
} from '../gateway/tmdb-client';
import { logger } from '../utilities/logger';
import { getMetadataById, saveMetadata } from '../gateway/firebase';
import { Metadata } from '../models/metadata';

export const getMovieById = async (id: string) => {
  logger.info({ message: 'Fetching movie data', movieId: id });
  const [movie, providers, recommended, metadata] = await Promise.all([
    tmdbGetMovieById(id),
    getMovieWatchProviders(id),
    getRecommendedMovies(id),
    getMetadataById(id, 'movies'),
  ]);

  return {
    ...movie,
    metadata,
    providers,
    recommended,
  };
};

export const saveMovie = async (metaData: Metadata) => {
  logger.info({ message: 'Saving movie', movieId: metaData.id });
  await saveMetadata(metaData.id, 'movies', metaData);
};
