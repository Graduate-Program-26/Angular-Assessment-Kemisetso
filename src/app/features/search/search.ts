import { Component, inject, signal } from '@angular/core';
import { SearchStore } from '../../core/stores/searchStore';
import { SearchTab, Track } from '../../core/models/searchModel';
import { Playlist as SavedPlaylist } from '../../core/models/playlist';
import { PlaylistStore } from '../../core/stores/playlistStore';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { FanCountPipe } from '../../shared/pipes/fanCount';
import { DurationPipe } from '../../shared/pipes/duration';
@Component({
  selector: 'app-search',
  imports: [
    RouterLink,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    RippleModule,
    TooltipModule,
    DurationPipe,
    FanCountPipe,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  store = inject(SearchStore);
  playlistStore = inject(PlaylistStore);
  inputValue = signal<string>('');
  playlistDialogVisible = signal(false);
  selectedTrack = signal<Track | null>(null);
  playlistActionError = signal<string | null>(null);
  playlistActionMessage = signal<string | null>(null);
  quickPlaylistName = signal('');

  tabs: { label: string; value: SearchTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Artists', value: 'artists' },
    { label: 'Albums', value: 'albums' },
    { label: 'Tracks', value: 'tracks' },
  ];

  skeletonCards = Array.from({ length: 4 });
  skeletonRows = Array.from({ length: 5 });

  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.store.setQuery(value);
  }

  onClear(): void {
    this.inputValue.set('');
    this.store.clearSearch();
  }

  setTab(tab: SearchTab): void {
    this.store.setActiveTab(tab);
  }

  openPlaylistDialog(track: Track): void {
    this.selectedTrack.set(track);
    this.quickPlaylistName.set('');
    this.playlistActionError.set(null);
    this.playlistActionMessage.set(null);
    this.playlistDialogVisible.set(true);
  }

  closePlaylistDialog(): void {
    this.playlistDialogVisible.set(false);
    this.selectedTrack.set(null);
  }

  async addSelectedTrackToPlaylist(playlistId: number): Promise<void> {
    const track = this.selectedTrack();
    if (!track) return;

    try {
      await this.playlistStore.addTrack(playlistId, track);
      this.playlistActionMessage.set(`Added "${track.title_short || track.title}".`);
      this.playlistActionError.set(null);
    } catch {
      this.playlistActionError.set('Could not add song. Please try again.');
      this.playlistActionMessage.set(null);
    }
  }

  async addSelectedTrackToSavedPlaylist(playlist: SavedPlaylist): Promise<void> {
    if (playlist.id === undefined) {
      this.playlistActionError.set('Could not add song. Please try again.');
      this.playlistActionMessage.set(null);
      return;
    }

    await this.addSelectedTrackToPlaylist(playlist.id);
  }

  async createPlaylistAndAddTrack(): Promise<void> {
    const track = this.selectedTrack();
    const name = this.quickPlaylistName().trim();

    if (!track) return;
    if (!name) {
      this.playlistActionError.set('Enter a playlist name.');
      return;
    }

    try {
      const playlistId = await this.playlistStore.createPlaylist(name);
      await this.playlistStore.addTrack(playlistId, track);
      this.playlistActionMessage.set(`Created "${name}" and added the song.`);
      this.playlistActionError.set(null);
      this.quickPlaylistName.set('');
    } catch {
      this.playlistActionError.set('Could not create playlist. Please try again.');
      this.playlistActionMessage.set(null);
    }
  }

  trackById(index: number, item: { id?: number }): number {
    return item.id ?? index;
  }
}
