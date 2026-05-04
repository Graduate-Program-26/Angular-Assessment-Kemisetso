export interface DeezerArtist {
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

export interface DeezerArtistDetail extends DeezerArtist {
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  link: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  release_date: string;
  tracklist?: string;
  artist?: DeezerArtist;
  nb_tracks?: number;
  genre_id?: number;
  fans?: number;
  record_type?: string;
  explicit_lyrics?: boolean;
  link?: string;
}
