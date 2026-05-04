import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Album, Artist, ListResponse, SearchResponse, Track } from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  readonly #http = inject(HttpClient);
  private readonly BASE = '/api';

  searchAll(query: string, limit = 12): Observable<SearchResponse> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return forkJoin({
      artists: this.#http.get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params }),
      albums: this.#http.get<ListResponse<Album>>(`${this.BASE}/search/album`, { params }),
      tracks: this.#http.get<ListResponse<Track>>(`${this.BASE}/search`, { params }),
    });
  }

  searchArtists(query: string, limit = 20): Observable<Artist[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);
    return this.#http
      .get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params })
      .pipe(map((r) => r.data));
  }

  searchAlbums(query: string, limit = 20): Observable<Album[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);
    return this.#http
      .get<ListResponse<Album>>(`${this.BASE}/search/album`, { params })
      .pipe(map((r) => r.data));
  }

  searchTracks(query: string, limit = 20): Observable<Track[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);
    return this.#http
      .get<ListResponse<Track>>(`${this.BASE}/search`, { params })
      .pipe(map((r) => r.data));
  }
}
