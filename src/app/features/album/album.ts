import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { DurationPipe } from '../../shared/pipes/duration';
import { AlbumDetail, Track } from '../../core/models/searchModel';
import { DeezerService } from '../../core/services/deezerService';
import { PlaybarStore } from '../../core/stores/playbarStore';

@Component({
  selector: 'app-album',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkeletonModule, DurationPipe],
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album implements OnInit {
  readonly id = input.required<string>();

  private readonly deezer = inject(DeezerService);
  private readonly destroyRef = inject(DestroyRef);
  readonly player = inject(PlaybarStore);

  readonly album = signal<AlbumDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly tracks = computed(() => {
    const album = this.album();
    if (!album) return [];

    return album.tracks.data.map((track) => this.withAlbumData(track, album));
  });

  readonly genres = computed(() => {
    const genres = this.album()?.genres?.data ?? [];
    return genres.length > 0 ? genres.map((genre) => genre.name).join(', ') : 'Unknown genre';
  });

  readonly totalDuration = computed(() =>
    this.tracks().reduce((total, track) => total + track.duration, 0),
  );

  readonly releaseYear = computed(() => {
    const releaseDate = this.album()?.release_date;
    return releaseDate ? new Date(releaseDate).getFullYear() : null;
  });

  readonly skeletonRows = Array.from({ length: 10 });

  ngOnInit(): void {
    const id = Number(this.id());

    this.deezer
      .getAlbum(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (album) => {
          this.album.set(album);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load album. Please try again.');
          this.loading.set(false);
        },
      });
  }

  playTrack(track: Track): void {
    this.player.play(track);
  }

  isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.track()?.id === track.id;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  private withAlbumData(track: Track, album: AlbumDetail): Track {
    return {
      ...track,
      album: {
        id: album.id,
        title: album.title,
        cover_small: album.cover_small,
        cover_medium: album.cover_medium,
        type: album.type,
      },
    };
  }
}
