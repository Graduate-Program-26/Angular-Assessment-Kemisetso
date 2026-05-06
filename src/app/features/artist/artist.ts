import { Component, computed, inject, signal } from '@angular/core';
import { Track, Artist as art, Album } from '../../core/models/searchModel';
import { DeezerService } from '../../core/services/deezerService';

@Component({
  selector: 'app-artist',
  imports: [],
  templateUrl: './artist.html',
  styleUrl: './artist.scss',
})
export class Artist {
  //readonly id = input.required<string>();

  readonly deezer = inject(DeezerService);

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
}
