import { Component, inject, signal } from '@angular/core';
import { PlaylistTrack } from '../../core/models/playlist';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { db } from '../../db';
import { PlaylistStore } from '../../core/stores/playlistStore';

interface PlaylistWithStats {
  id: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  trackCount: number;
  totalDuration: number;
  coverUrl: string | null;
}
@Component({
  selector: 'app-playlist',
  imports: [],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
})
export class Playlist {
  store = inject(PlaylistStore);
  readonly playlistsWithStats = toSignal(
    from(
      liveQuery(async (): Promise<PlaylistWithStats[]> => {
        const playlists = await db.playlists.orderBy('createdAt').reverse().toArray();

        return Promise.all(
          playlists.map(async (p) => {
            const tracks: PlaylistTrack[] = await db.playlistTracks
              .where('playlistId')
              .equals(p.id!)
              .toArray();

            const totalDuration = tracks.reduce((s, t) => s + t.duration, 0);
            const firstCover = tracks[0]?.albumCoverMedium ?? null;

            return {
              id: p.id!,
              name: p.name,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              trackCount: tracks.length,
              totalDuration,
              coverUrl: firstCover,
            };
          }),
        );
      }),
    ),
    { initialValue: [] as PlaylistWithStats[] },
  );

  readonly createDialogVisible = signal(false);
  readonly newPlaylistName = signal('');
  readonly createError = signal<string | null>(null);
  readonly creating = signal(false);
  readonly renameDialogVisible = signal(false);
  readonly renameTargetId = signal<number | null>(null);
  readonly renameValue = signal('');
  readonly renameError = signal<string | null>(null);

  readonly deleteTargetId = signal<number | null>(null);
  readonly deleteDialogVisible = signal(false);
  readonly deleteTargetName = signal('');

  openCreateDialog(): void {
    this.newPlaylistName.set('');
    this.createError.set(null);
    this.createDialogVisible.set(true);
  }

  async confirmCreate(): Promise<void> {
    if (!this.newPlaylistName().trim()) {
      this.createError.set('Please enter a playlist name.');
      return;
    }
    this.creating.set(true);
    try {
      await this.store.createPlaylist(this.newPlaylistName());
      this.createDialogVisible.set(false);
    } catch {
      this.createError.set('Failed to create playlist. Please try again.');
    } finally {
      this.creating.set(false);
    }
  }
}
