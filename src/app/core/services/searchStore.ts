import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { DeezerService } from './deezerService';

import { Artist, Album, Track, SearchTab } from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class SearchStore {
  private deezer = inject(DeezerService);
  private router = inject(Router);

  private artistsSignal = signal<Artist[]>([]);
  private albumsSignal = signal<Album[]>([]);
  private tracksSignal = signal<Track[]>([]);
  private loadingSignal = signal(false);
  private querySignal = signal('');
  private activeSignal = signal<SearchTab>('all');
  private errorSignal = signal<string | null>(null);
  private hasSearchedSignal = signal(false);

  readonly artists = this.artistsSignal.asReadonly();
  readonly albums = this.albumsSignal.asReadonly();
  readonly tracks = this.tracksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();
  readonly activeTab = this.activeSignal.asReadonly();
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

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((q) => q.trim().length > 1),
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
          this.hasSearchedSignal.set(true);
        }),
        switchMap((q) => this.deezer.searchAll(q)),
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

    effect(() => {
      if (this.querySignal().trim() === '') {
        this.clearSearch();
      }
    });
  }

  setQuery(query: string): void {
    this.querySignal.set(query);
    this.search$.next(query);
  }

  setActiveTab(tab: SearchTab): void {
    this.activeSignal.set(tab);
  }

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }

  navigateToAlbum(id: number): void {
    this.router.navigate(['/album', id]);
  }

  clearSearch(): void {
    this.querySignal.set('');
    this.artistsSignal.set([]);
    this.albumsSignal.set([]);
    this.tracksSignal.set([]);
    this.errorSignal.set(null);
    this.hasSearchedSignal.set(false);
    this.activeSignal.set('all');
  }
}
