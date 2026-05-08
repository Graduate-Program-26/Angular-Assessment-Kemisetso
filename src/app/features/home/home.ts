import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { DurationPipe } from '../../shared/pipes/duration';
import { DeezerService } from '../../core/services/deezerService';
import { PlaybarStore } from '../../core/stores/playbarStore';
import { SearchStore } from '../../core/stores/searchStore';
import { Track } from '../../core/models/searchModel';

type GenreChip = { label: string; value: string };

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkeletonModule, RippleModule, DurationPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  readonly deezer = inject(DeezerService);
  readonly player = inject(PlaybarStore);
  private searchStore = inject(SearchStore);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('homeSearchInput') private homeSearchInput?: ElementRef<HTMLInputElement>;

  readonly tracks = signal<Track[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeGenre = signal<string>('all');
  searchQuery = signal('');

  readonly genres: GenreChip[] = [
    { label: 'All', value: 'all' },
    { label: 'Energize', value: 'Energize' },
    { label: 'Feel good', value: 'Feel good' },
    { label: 'Relax', value: 'Relax' },
    { label: 'Workout', value: 'Workout' },
    { label: 'Sad', value: 'Sad' },
    { label: 'Party', value: 'Party' },
    { label: 'Focus', value: 'Focus' },
    { label: 'Romance', value: 'Romance' },
  ];

  readonly visibleTracks = computed(() => this.tracks());

  readonly skeletonRows = Array.from({ length: 12 });

  ngOnInit(): void {
    this.deezer
      .getChart(50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tracks) => {
          this.tracks.set(tracks);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load chart. Please try again.');
          this.loading.set(false);
        },
      });
  }

  playTrack(track: Track): void {
    this.player.play(track);
  }

  submitSearch(): void {
    const query = this.searchQuery().trim();
    if (query.length < 2) {
      this.homeSearchInput?.nativeElement.focus();
      return;
    }

    this.searchStore.setQuery(query);
    this.router.navigate(['/search']);
  }

  @HostListener('document:keydown', ['$event'])
  focusSearchShortcut(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const isTyping =
      target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      this.homeSearchInput?.nativeElement.focus();
    }
  }

  isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.track()?.id === track.id;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
