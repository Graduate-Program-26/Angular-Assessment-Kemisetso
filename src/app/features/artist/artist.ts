import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Track, Artist as art, Album } from '../../core/models/searchModel';
import { DeezerService } from '../../core/services/deezerService';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { FanCountPipe } from '../../shared/pipes/fanCount';
import { DurationPipe } from '../../shared/pipes/duration';
@Component({
  selector: 'app-artist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, SkeletonModule, RippleModule, FanCountPipe, DurationPipe],
  templateUrl: './artist.html',
  styleUrl: './artist.scss',
})
export class Artist implements OnInit {
  readonly id = input.required<string>();

  readonly deezer = inject(DeezerService);
  private readonly destroyRef = inject(DestroyRef);

  readonly artist = signal<art | null>(null);
  readonly albums = signal<Album[]>([]);
  readonly topTracks = signal<Track[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly albumsByType = computed(() => {
    const all = this.albums();
    return {
      album: all.filter((a) => a.record_type === 'album'),
      single: all.filter((a) => a.record_type === 'single'),
      ep: all.filter((a) => a.record_type === 'ep'),
    };
  });

  readonly skeletonAlbums = Array.from({ length: 6 });
  readonly skeletonTracks = Array.from({ length: 5 });

  ngOnInit(): void {
    const id = Number(this.id());

    forkJoin({
      artist: this.deezer.getArtist(id),
      albums: this.deezer.getArtistAlbums(id),
      topTracks: this.deezer.getArtistTopTracks(id),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ artist, albums, topTracks }) => {
          this.artist.set(artist);
          this.albums.set(albums);
          this.topTracks.set(topTracks);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load artist. Please try again.');
          this.loading.set(false);
        },
      });
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
