import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DurationPipe } from '../../shared/pipes/duration';
import { AlbumDetail, Track } from '../../core/models/searchModel';
import { AlbumResolvedData } from '../../core/resolvers/album.resolver';
import { PlaybarStore } from '../../core/stores/playbarStore';

@Component({
  selector: 'app-album',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, SkeletonModule, DurationPipe],
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album {
  readonly id = input.required<string>();

  private readonly route = inject(ActivatedRoute);
  readonly player = inject(PlaybarStore);

  private readonly resolvedData = toSignal(
    this.route.data.pipe(map((data) => data['albumData'] as AlbumResolvedData | undefined)),
  );

  readonly album = computed<AlbumDetail | null>(() => this.resolvedData()?.album ?? null);
  readonly loading = computed(() => this.resolvedData() === undefined);
  readonly error = computed(() =>
    !this.loading() && !this.album() ? 'Could not load album. Please try again.' : null,
  );

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
