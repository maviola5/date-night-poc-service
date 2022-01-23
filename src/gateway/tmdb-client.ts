import axios from 'axios';
import { environement } from '../environment';

export const http = axios.create({
  baseURL: environement.tmdb.baseURL,
  params: {
    api_key: environement.tmdb.apiKey,
  },
});

import { TrendingMovie, TrendingShow } from '../models/tmdb';

export const getTrending = async () => {
  try {
    const movieReq = http
      .get('/trending/movie/week')
      .then((res) => res.data.results) as Promise<TrendingMovie[]>;
    const showReq = http
      .get('/trending/tv/week')
      .then((res) => res.data.results) as Promise<TrendingShow[]>;
    const [movies, shows] = await Promise.all([movieReq, showReq]);

    return { movies, shows };
  } catch (e) {
    console.log(e);
  }
};

/**
 * Movies
 */

export const getMovieById = async (id: string) => {
  const { data } = await http.get(`/movie/${id}`);
  return data;
};

export const getRecommendedMovies = async (id: string) => {
  const {
    data: { results },
  } = await http.get(`/movie/${id}/recommendations`);
  return results;
};

export const getMovieWatchProviders = async (id: string) => {
  const {
    data: { results },
  } = await http.get(`/movie/${id}/watch/providers`);

  return results['US'];
};

/**
 * TV Shows
 */

export const getShowById = async (id: string) => {
  const { data } = await http.get(`/tv/${id}`);
  return data;
};

export const getRecommendedShows = async (id: string) => {
  const {
    data: { results },
  } = await http.get(`/tv/${id}/recommendations`);
  return results;
};

export const getShowWatchProviders = async (id: string) => {
  const {
    data: { results },
  } = await http.get(`/tv/${id}/watch/providers`);

  return results['US'];
};
