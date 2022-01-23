export interface TrendingShow {
  original_name: string;
  origin_country: string[];
  poster_path: string;
  id: number;
  name: string;
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

export interface TrendingMovie {
  id: number;
  vote_count: number;
  vote_average: number;
  video: boolean;
  title: string;
  genre_ids: number[];
  release_date: string;
  original_language: string;
  original_title: string;
  poster_path: string;
  overview: string;
  adult: boolean;
  backdrop_path: string;
  popularity: number;
  media_type: string;
}

export interface MovieDetail {}

export interface ShowDetail {}

export interface ProviderDetail {
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: string;
}

export interface RecommendedDetail {}
