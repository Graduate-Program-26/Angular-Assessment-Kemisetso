import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SearchStore } from '../../core/stores/searchStore';
import { PlaylistStore } from '../../core/stores/playlistStore';
import { PlaybarStore } from '../../core/stores/playbarStore';
import { SearchTab, Track } from '../../core/models/searchModel';
import { Playlist as SavedPlaylist } from '../../core/models/playlist';
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
  player = inject(PlaybarStore);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  playlistDialogVisible = signal(false);
  selectedTrack = signal<Track | null>(null);
  playlistActionError = signal<string | null>(null);
  playlistActionMessage = signal<string | null>(null);
  quickPlaylistName = signal('');

  hasActiveSearch = computed(
    () => this.store.hasSearched() || this.store.query().trim().length > 0,
  );

  tabs: { label: string; value: SearchTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Artists', value: 'artists' },
    { label: 'Albums', value: 'albums' },
    { label: 'Tracks', value: 'tracks' },
  ];

  suggestions: string[] = [
    'The Weeknd',
    'Kendrick Lamar',
    'Taylor Swift',
    'Tame Impala',
    'Daft Punk',
    'SZA',
  ];

  skeletonCards = Array.from({ length: 4 });
  skeletonRows = Array.from({ length: 5 });

  onInputChange(value: string): void {
    this.store.setQuery(value);
  }

  onClear(): void {
    this.store.clearSearch();
    queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
  }

  startNewSearch(): void {
    this.onClear();
  }

  setTab(tab: SearchTab): void {
    this.store.setActiveTab(tab);
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const lastIndex = this.tabs.length - 1;
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.setTab(this.tabs[nextIndex].value);
    this.focusTabAtIndex(event.currentTarget, nextIndex);
  }

  @HostListener('document:keydown', ['$event'])
  focusSearchShortcut(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    const isTyping =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      this.searchInputRef?.nativeElement.focus();
    }
  }

  openPlaylistDialog(track: Track): void {
    this.selectedTrack.set(track);
    this.quickPlaylistName.set('');
    this.playlistActionError.set(null);
    this.playlistActionMessage.set(null);
    this.playlistDialogVisible.set(true);
  }

  playTrack(track: Track): void {
    this.player.play(track);
  }

  isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.track()?.id === track.id;
  }

  closePlaylistDialog(): void {
    this.playlistDialogVisible.set(false);
    this.selectedTrack.set(null);
  }

  async addSelectedTrackToSavedPlaylist(playlist: SavedPlaylist): Promise<void> {
    if (playlist.id === undefined) {
      this.playlistActionError.set('Could not add song. Please try again.');
      return;
    }

    const track = this.selectedTrack();

    if (!track) return;

    try {
      await this.playlistStore.addTrack(playlist.id, track);
      this.playlistActionMessage.set(`Added "${track.title}".`);
      this.playlistActionError.set(null);
    } catch {
      this.playlistActionError.set('Could not add song. Please try again.');
      this.playlistActionMessage.set(null);
    }
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

  trackById(_index: number, item: { id?: number }): number {
    return item.id ?? _index;
  }

  focusTabAtIndex(currentTarget: EventTarget | null, index: number): void {
    if (!(currentTarget instanceof HTMLElement)) return;

    const buttons =
      currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    buttons?.[index]?.focus();
  }
}
