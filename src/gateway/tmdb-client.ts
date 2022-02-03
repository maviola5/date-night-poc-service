import axios from 'axios';
import { environment } from '../environment';
import { TrendingShow, Media } from '../models/tmdb';

export const http = axios.create({
  baseURL: environment.tmdb.baseURL,
  params: {
    api_key: environment.tmdb.apiKey,
  },
});

export const getTrending = async (media: Media, page: number) => {
  const { data } = await http.get(`/trending/${media}/week`, {
    params: { page },
  });
  return data as { page: number; results: TrendingShow[] };
};

export const getShowById = async (media: Media, id: string) => {
  const { data } = await http.get(`/${media}/${id}`);
  return data;
};

export const getRecommended = async (media: Media, id: string) => {
  const {
    data: { results },
  } = await http.get(`/${media}/${id}/recommendations`);
  return results;
};

export const getWatchProviders = async (media: Media, id: string) => {
  const {
    data: { results },
  } = await http.get(`/${media}/${id}/watch/providers`);

  return results['US'];
};
