import { Component, computed, inject, signal } from '@angular/core';
import { PlaylistTrack } from '../../core/models/playlist';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { from, map } from 'rxjs';
import { db } from '../../db';
import { PlaylistStore } from '../../core/stores/playlistStore';
import { PlaybarStore, PlaybarTrack } from '../../core/stores/playbarStore';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DurationPipe } from '../../shared/pipes/duration';

interface PlaylistWithStats {
  id: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  trackCount: number;
  totalDuration: number;
}
@Component({
  selector: 'app-playlist',
  imports: [RouterLink, DurationPipe],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
})
export class Playlist {
  store = inject(PlaylistStore);
  player = inject(PlaybarStore);
  private route = inject(ActivatedRoute);

  readonly routePlaylistId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')) || null)),
    { initialValue: null },
  );

  readonly playlistsWithStats = toSignal(
    from(
      liveQuery(async (): Promise<PlaylistWithStats[]> => {
        const playlists = await db.playlists.orderBy('createdAt').reverse().toArray();
        const savedPlaylists = playlists.filter(
          (playlist): playlist is typeof playlist & { id: number } => playlist.id !== undefined,
        );

        return Promise.all(
          savedPlaylists.map(async (p) => {
            const tracks: PlaylistTrack[] = await db.playlistTracks
              .where('playlistId')
              .equals(p.id)
              .toArray();

            const totalDuration = tracks.reduce((s, t) => s + t.duration, 0);
            return {
              id: p.id,
              name: p.name,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              trackCount: tracks.length,
              totalDuration,
            };
          }),
        );
      }),
    ),
    { initialValue: [] as PlaylistWithStats[] },
  );

  readonly playlistTracks = toSignal(
    from(liveQuery(() => db.playlistTracks.orderBy('addedAt').reverse().toArray())),
    { initialValue: [] as PlaylistTrack[] },
  );

  selectedPlaylistId = signal<number | null>(null);

  readonly activePlaylistId = computed(
    () =>
      this.selectedPlaylistId() ??
      this.routePlaylistId() ??
      this.playlistsWithStats()[0]?.id ??
      null,
  );

  readonly activePlaylist = computed(() =>
    this.playlistsWithStats().find((playlist) => playlist.id === this.activePlaylistId()),
  );

  readonly activeTracks = computed(() =>
    this.playlistTracks().filter((track) => track.playlistId === this.activePlaylistId()),
  );

  createDialogVisible = signal(false);
  newPlaylistName = signal('');
  createError = signal<string | null>(null);
  creating = signal(false);
  renameDialogVisible = signal(false);
  renameTargetId = signal<number | null>(null);
  renameValue = signal('');
  renameError = signal<string | null>(null);

  deleteTargetId = signal<number | null>(null);
  deleteDialogVisible = signal(false);
  deleteTargetName = signal('');
  deleteError = signal<string | null>(null);

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

  openRenameDialog(id: number, currentName: string): void {
    this.renameTargetId.set(id);
    this.renameValue.set(currentName);
    this.renameError.set(null);
    this.renameDialogVisible.set(true);
  }

  async confirmRename(): Promise<void> {
    if (!this.renameValue().trim()) {
      this.renameError.set('Name cannot be empty.');
      return;
    }
    const id = this.renameTargetId();
    if (id === null) return;
    try {
      await this.store.renamePlaylist(id, this.renameValue());
      this.renameDialogVisible.set(false);
    } catch {
      this.renameError.set('Failed to rename. Please try again.');
    }
  }

  openDeleteDialog(id: number, name: string): void {
    this.deleteTargetId.set(id);
    this.deleteTargetName.set(name);
    this.deleteError.set(null);
    this.deleteDialogVisible.set(true);
  }

  async confirmDelete(): Promise<void> {
    const id = this.deleteTargetId();
    if (id === null) return;
    try {
      await this.store.deletePlaylist(id);
      if (this.activePlaylistId() === id) {
        this.selectedPlaylistId.set(null);
      }
      this.deleteDialogVisible.set(false);
    } catch {
      this.deleteError.set('Failed to delete playlist. Please try again.');
    }
  }

  selectPlaylist(id: number): void {
    this.selectedPlaylistId.set(id);
  }

  async removeTrack(track: PlaylistTrack): Promise<void> {
    if (track.id === undefined) return;
    await this.store.removeTrack(track.id, track.playlistId);
  }

  playTrack(track: PlaylistTrack): void {
    this.player.play(this.toPlaybarTrack(track));
  }

  isPlaying(track: PlaylistTrack): boolean {
    return this.player.playing() && this.player.track()?.id === track.trackId;
  }

  trackById(index: number, item: { id?: number }): number {
    return item.id ?? index;
  }

  private toPlaybarTrack(track: PlaylistTrack): PlaybarTrack {
    return {
      id: track.trackId,
      title: track.title,
      title_short: track.titleShort,
      duration: track.duration,
      preview: track.preview,
      artist: {
        id: track.artistId,
        name: track.artistName,
      },
      album: {
        id: track.albumId,
        title: track.albumTitle,
        cover_small: track.albumCoverSmall,
        cover_medium: track.albumCoverMedium,
      },
    };
  }
}
