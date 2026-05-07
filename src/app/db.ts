import Dexie, { type EntityTable } from 'dexie';
import { Playlist, PlaylistTrack } from './core/models/playlist';

class AppDatabase extends Dexie {
  playlists!: EntityTable<Playlist, 'id'>;
  playlistTracks!: EntityTable<PlaylistTrack, 'id'>;

  constructor() {
    super('DeezerApp');

    this.version(1).stores({
      playlists: '++id, name, createdAt, updatedAt',

      playlistTracks: '++id, playlistId, trackId, addedAt, [playlistId+trackId]',
    });
  }
}

export const db = new AppDatabase();
