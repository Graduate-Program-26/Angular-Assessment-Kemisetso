import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DeezerService } from './core/services/deezerApi';
import { Track, ArtistDetail } from './core/models/deezer';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Angular-Assessment-Kemisetso');
  private deezer = inject(DeezerService);

  artistResults = signal<ArtistDetail[]>([]);
  trackResults = signal<Track[]>([]);
  loading = signal(false);

  search(query: string) {
    this.loading.set(true);

    this.deezer.searchArtist(query).subscribe({
      next: (res) => {
        this.artistResults.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.deezer.searchTracks(query).subscribe({
      next: (res) => {
        this.trackResults.set(res.data);
      },
    });
  }
}
