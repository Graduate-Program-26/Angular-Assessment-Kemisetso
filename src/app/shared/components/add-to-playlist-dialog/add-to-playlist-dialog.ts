import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Playlist as SavedPlaylist } from '../../../core/models/playlist';
import { Track } from '../../../core/models/searchModel';
import { PlaylistStore } from '../../../core/stores/playlistStore';

@Component({
  selector: 'app-add-to-playlist-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-to-playlist-dialog.html',
  styleUrl: './add-to-playlist-dialog.scss',
})
export class AddToPlaylistDialog {
  readonly tracks = input<Track[]>([]);
  readonly title = input<string | null>(null);
  readonly closed = output<void>();

  readonly playlistStore = inject(PlaylistStore);

  readonly quickPlaylistName = signal('');
  readonly actionError = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);

  readonly itemTitle = computed(() => {
    const explicitTitle = this.title();
    if (explicitTitle) return explicitTitle;

    const tracks = this.tracks();
    if (tracks.length === 1) return tracks[0].title_short || tracks[0].title;

    return `${tracks.length} songs`;
  });

  readonly itemKind = computed(() => (this.tracks().length === 1 ? 'song' : 'songs'));

  close(): void {
    this.closed.emit();
  }

  async addToSavedPlaylist(playlist: SavedPlaylist): Promise<void> {
    if (playlist.id === undefined) {
      this.actionError.set(`Could not add ${this.itemKind()}. Please try again.`);
      return;
    }

    await this.addTracksToPlaylist(playlist.id, playlist.name);
  }

  async createPlaylistAndAddTracks(): Promise<void> {
    const name = this.quickPlaylistName().trim();

    if (!name) {
      this.actionError.set('Enter a playlist name.');
      return;
    }

    try {
      const playlistId = await this.playlistStore.createPlaylist(name);
      await this.addTracksToPlaylist(playlistId, name, true);
      this.quickPlaylistName.set('');
    } catch {
      this.actionError.set('Could not create playlist. Please try again.');
      this.actionMessage.set(null);
    }
  }

  trackById(_index: number, item: { id?: number }): number {
    return item.id ?? _index;
  }

  private async addTracksToPlaylist(
    playlistId: number,
    playlistName: string,
    created = false,
  ): Promise<void> {
    const tracks = this.tracks();
    if (tracks.length === 0) return;

    try {
      const addedCount = await this.playlistStore.addTracks(playlistId, tracks);
      this.actionMessage.set(this.successMessage(playlistName, addedCount, created));
      this.actionError.set(null);
    } catch {
      this.actionError.set(`Could not add ${this.itemKind()}. Please try again.`);
      this.actionMessage.set(null);
    }
  }

  private successMessage(playlistName: string, addedCount: number, created: boolean): string {
    const prefix = created ? `Created "${playlistName}". ` : '';
    const totalCount = this.tracks().length;

    if (addedCount === 0) {
      return `${prefix}Already in "${playlistName}".`;
    }

    if (totalCount === 1) {
      return `${prefix}Added "${this.tracks()[0].title}".`;
    }

    return `${prefix}Added ${addedCount} of ${totalCount} songs.`;
  }
}
