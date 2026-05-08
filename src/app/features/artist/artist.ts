import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Track, Artist as art, Album } from '../../core/models/searchModel';
import { ArtistResolvedData } from '../../core/resolvers/artist.resolver';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { FanCountPipe } from '../../shared/pipes/fanCount';
import { DurationPipe } from '../../shared/pipes/duration';
import { PlaybarStore } from '../../core/stores/playbarStore';

@Component({
  selector: 'app-artist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, SkeletonModule, RippleModule, FanCountPipe, DurationPipe],
  templateUrl: './artist.html',
  styleUrl: './artist.scss',
})
export class Artist {
  readonly id = input.required<string>();

  private readonly route = inject(ActivatedRoute);
  readonly player = inject(PlaybarStore);
  private readonly resolvedData = toSignal(
    this.route.data.pipe(map((data) => data['artistData'] as ArtistResolvedData | undefined)),
  );

  readonly artist = computed<art | null>(() => this.resolvedData()?.artist ?? null);
  readonly albums = computed<Album[]>(() => this.resolvedData()?.albums ?? []);
  readonly topTracks = computed<Track[]>(() => this.resolvedData()?.topTracks ?? []);
  readonly loading = computed(() => this.resolvedData() === undefined);
  readonly error = computed(() =>
    !this.loading() && !this.artist() ? 'Could not load artist. Please try again.' : null,
  );

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

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  playTrack(track: Track): void {
    this.player.play(track);
  }

  isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.track()?.id === track.id;
  }
}
