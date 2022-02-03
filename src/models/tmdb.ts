export interface TrendingShow {
  original_name: string;
  origin_country: string[];
  poster_path: string;
  id: number;
  name?: string;
  title?: string;
  vote_count: number;
  first_air_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  media_type: string;
}
export interface ProviderDetail {
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: string;
}

export type Media = 'tv' | 'movie';
