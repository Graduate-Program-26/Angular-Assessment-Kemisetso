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
}

export interface rtistDetail extends Artist {
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
  release_date: string;
  tracklist?: string;
  artist?: Artist;
  nb_tracks?: number;
  genre_id?: number;
  fans?: number;
  record_type?: string;
  explicit_lyrics?: boolean;
  link?: string;
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
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  preview: string;
  artist: Artist;
  album: Album;
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
