import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { db } from '../../db';
import { Playlist, PlaylistTrack } from '../models/playlist';
import { Track } from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class PlaylistStore {
  readonly playlists = toSignal(
    from(liveQuery(() => db.playlists.orderBy('createdAt').reverse().toArray())),
    { initialValue: [] as Playlist[] },
  );

  readonly playlistCount = computed(() => this.playlists().length);

  async createPlaylist(name: string): Promise<number> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Playlist name cannot be empty.');

    const now = Date.now();
    const id = await db.playlists.add({
      name: trimmed,
      createdAt: now,
      updatedAt: now,
    });
    return id as number;
  }

  async renamePlaylist(id: number, name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Playlist name cannot be empty.');

    await db.playlists.update(id, { name: trimmed, updatedAt: Date.now() });
  }

  async deletePlaylist(id: number): Promise<void> {
    await db.transaction('rw', db.playlists, db.playlistTracks, async () => {
      await db.playlistTracks.where('playlistId').equals(id).delete();
      await db.playlists.delete(id);
    });
  }

  async addTrack(playlistId: number, track: Track): Promise<boolean> {
    const existing = await db.playlistTracks
      .where('[playlistId+trackId]')
      .equals([playlistId, track.id])
      .first();

    if (existing) return false;

    await db.transaction('rw', db.playlists, db.playlistTracks, async () => {
      await db.playlistTracks.add({
        playlistId,
        trackId: track.id,
        title: track.title,
        titleShort: track.title_short || track.title,
        artistId: track.artist.id,
        artistName: track.artist.name,
        albumId: track.album.id,
        albumTitle: track.album.title,
        albumCoverSmall: track.album.cover_small,
        albumCoverMedium: track.album.cover_medium,
        duration: track.duration,
        preview: track.preview,
        explicit: track.explicit_lyrics,
        addedAt: Date.now(),
      });

      await db.playlists.update(playlistId, { updatedAt: Date.now() });
    });

    return true;
  }

  async addTracks(playlistId: number, tracks: Track[]): Promise<number> {
    let addedCount = 0;

    for (const track of tracks) {
      const added = await this.addTrack(playlistId, track);
      if (added) addedCount += 1;
    }

    return addedCount;
  }

  async removeTrack(playlistTrackId: number, playlistId: number): Promise<void> {
    await db.transaction('rw', db.playlists, db.playlistTracks, async () => {
      await db.playlistTracks.delete(playlistTrackId);
      await db.playlists.update(playlistId, { updatedAt: Date.now() });
    });
  }

  getTracksSignal(playlistId: number) {
    return toSignal(
      from(
        liveQuery(() => db.playlistTracks.where('playlistId').equals(playlistId).sortBy('addedAt')),
      ),
      { initialValue: [] as PlaylistTrack[] },
    );
  }

  totalDuration(tracks: PlaylistTrack[]): number {
    return tracks.reduce((sum, t) => sum + t.duration, 0);
  }

  async isTrackInPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const hit = await db.playlistTracks
      .where('[playlistId+trackId]')
      .equals([playlistId, trackId])
      .first();
    return !!hit;
  }
}
