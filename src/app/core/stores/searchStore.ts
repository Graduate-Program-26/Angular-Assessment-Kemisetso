import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { DeezerService } from '../services/deezerService';
import { Artist, Album, Track, SearchTab } from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class SearchStore {
  deezer = inject(DeezerService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  artistsSignal = signal<Artist[]>([]);
  albumsSignal = signal<Album[]>([]);
  tracksSignal = signal<Track[]>([]);
  loadingSignal = signal(false);
  querySignal = signal('');
  activeTabSignal = signal<SearchTab>('all');
  errorSignal = signal<string | null>(null);
  hasSearchedSignal = signal(false);

  readonly artists = this.artistsSignal.asReadonly();
  readonly albums = this.albumsSignal.asReadonly();
  readonly tracks = this.tracksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();
  readonly activeTab = this.activeTabSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly hasSearched = this.hasSearchedSignal.asReadonly();

  readonly totalResults = computed(
    () => this.artists().length + this.albums().length + this.tracks().length,
  );

  readonly hasResults = computed(() => this.totalResults() > 0);

  readonly isEmpty = computed(
    () => this.hasSearched() && !this.loading() && this.totalResults() === 0,
  );

  readonly visibleArtists = computed(() =>
    this.activeTab() === 'all' ? this.artists().slice(0, 4) : this.artists(),
  );

  readonly visibleAlbums = computed(() =>
    this.activeTab() === 'all' ? this.albums().slice(0, 4) : this.albums(),
  );

  readonly visibleTracks = computed(() =>
    this.activeTab() === 'all' ? this.tracks().slice(0, 6) : this.tracks(),
  );

  readonly tabCounts = computed(() => ({
    all: this.totalResults(),
    artists: this.artists().length,
    albums: this.albums().length,
    tracks: this.tracks().length,
  }));

  search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((q) => q.trim().length > 0),
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
          this.hasSearchedSignal.set(true);
        }),
        switchMap((q) => this.deezer.searchAll(q)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.artistsSignal.set(res.artists.data);
          this.albumsSignal.set(res.albums.data);
          this.tracksSignal.set(res.tracks.data);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.errorSignal.set('Search failed. Please try again.');
          this.loadingSignal.set(false);
        },
      });
  }

  setQuery(query: string): void {
    this.querySignal.set(query);

    if (query.trim().length === 0) {
      this.clearResults();
      return;
    }

    this.search$.next(query);
  }

  setActiveTab(tab: SearchTab): void {
    this.activeTabSignal.set(tab);
  }

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }

  navigateToAlbum(id: number): void {
    this.router.navigate(['/album', id]);
  }

  clearResults(): void {
    this.artistsSignal.set([]);
    this.albumsSignal.set([]);
    this.tracksSignal.set([]);
    this.errorSignal.set(null);
    this.hasSearchedSignal.set(false);
    this.activeTabSignal.set('all');
    this.loadingSignal.set(false);
  }

  clearSearch(): void {
    this.querySignal.set('');
    this.clearResults();
  }
}
