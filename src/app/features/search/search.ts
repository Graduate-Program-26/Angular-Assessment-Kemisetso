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
import { PlaybarStore } from '../../core/stores/playbarStore';
import { SearchTab, Track } from '../../core/models/searchModel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { FanCountPipe } from '../../shared/pipes/fanCount';
import { DurationPipe } from '../../shared/pipes/duration';
import { AddToPlaylistDialog } from '../../shared/components/add-to-playlist-dialog/add-to-playlist-dialog';

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
    AddToPlaylistDialog,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  store = inject(SearchStore);
  player = inject(PlaybarStore);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  playlistDialogTracks = signal<Track[]>([]);

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
    this.playlistDialogTracks.set([track]);
  }

  playTrack(track: Track): void {
    this.player.play(track);
  }

  isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.track()?.id === track.id;
  }

  closePlaylistDialog(): void {
    this.playlistDialogTracks.set([]);
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
