export interface Playlist {
  id?: number;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface PlaylistTrack {
  id?: number;
  playlistId: number;
  trackId: number;
  title: string;
  titleShort: string;
  artistId: number;
  artistName: string;
  albumId: number;
  albumTitle: string;
  albumCoverSmall: string;
  albumCoverMedium: string;
  duration: number;
  preview: string;
  explicit: boolean;
  addedAt: number;
}

export type PlaylistSortOrder = 'addedAt' | 'title' | 'artist';
