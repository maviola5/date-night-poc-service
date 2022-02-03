import { config } from 'dotenv';
config();
export const environment = {
  local: process.env.LOCAL,
  tmdb: {
    baseURL: process.env.TMDB_BASE_URL,
    apiKey: process.env.TMDB_API_KEY,
  },
};
