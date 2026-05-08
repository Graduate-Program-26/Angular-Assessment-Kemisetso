export interface ListResponse<T> {
  data: T[];
  total: number;
  next?: string;
}

export interface Artist {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id: number;
  release_date?: string;
  nb_tracks: number;
  record_type: string;
  tracklist: string;
  explicit_lyrics: boolean;
  artist: Pick<Artist, 'id' | 'name' | 'picture_small' | 'type'>;
  type: 'album';
}

export interface Genre {
  id: number;
  name: string;
  picture: string;
  type: 'genre';
}

export interface Track {
  id: number;
  readable: boolean;
  title: string;
  title_short?: string;
  title_version: string;
  isrc: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: Pick<Artist, 'id' | 'name' | 'picture_small' | 'type'>;
  album: Pick<Album, 'id' | 'title' | 'cover_small' | 'cover_medium' | 'type'>;
  track_position?: number;
  disk_number?: number;
  type: 'track';
}

export interface AlbumDetail extends Album {
  release_date: string;
  fans: number;
  genres: ListResponse<Genre>;
  tracks: ListResponse<Track>;
  contributors?: Artist[];
}

export interface SearchResponse {
  artists: ListResponse<Artist>;
  albums: ListResponse<Album>;
  tracks: ListResponse<Track>;
}

export type SearchTab = 'all' | 'artists' | 'albums' | 'tracks';

export interface SearchState {
  query: string;
  activeTab: SearchTab;
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  total: number;
  loading: boolean;
  error: string | null;
}
