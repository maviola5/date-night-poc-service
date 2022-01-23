export interface Metadata {
  id: string;
  liked: string[];
  disliked: string[];
  watched: string[];
  watchListed: string[];
}

export interface UserMetadata {
  id: string;
  movies: Metadata;
  shows: Metadata;
}
