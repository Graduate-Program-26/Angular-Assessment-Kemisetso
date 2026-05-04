export interface Artist {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album?: number;
  nb_fan?: number;
  radio?: boolean;
  tracklist?: string;
  link?: string;
  type: 'artist';
}

export interface ArtistDetail extends Artist {
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  link: string;
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
  release_date: string;
  tracklist?: string;
  nb_tracks?: number;
  genre_id?: number;
  fans?: number;
  record_type?: string;
  explicit_lyrics?: boolean;
  link?: string;
  artist: Pick<Artist, 'id' | 'name' | 'picture_small' | 'type'>;
  type: 'album';
}
export interface Genre {
  id: number;
  name: string;
  picture: string;
}

export interface Track {
  id: number;
  title: string;
  title_short: string;
  title_version?: string;
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
  type: 'track';
  track_position?: number;
  disk_number?: number;
}

export interface AlbumDetail extends Album {
  nb_tracks: number;
  genre_id: number;
  fans: number;
  record_type: string;
  explicit_lyrics: boolean;
  link: string;
  genres?: { data: Genre[] };
  tracks?: { data: Track[] };
  contributors?: Artist[];
}
export interface SearchResponse<T> {
  data: T[];
  total: number;
  next?: string;
  prev?: string;
}

export interface ArtistAlbumsResponse {
  data: Album[];
  total: number;
}

export interface PlaylistTrack {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artistName: string;
  albumTitle: string;
  albumCover: string;
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tracks: PlaylistTrack[];
}
