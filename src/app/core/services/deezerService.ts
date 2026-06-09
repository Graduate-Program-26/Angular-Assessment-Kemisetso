import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, forkJoin, map, Observable, expand, of, reduce, switchMap } from 'rxjs';
import {
  Album,
  AlbumDetail,
  Artist,
  ListResponse,
  SearchResponse,
  Track,
} from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  private http = inject(HttpClient);
  private readonly BASE = 'https://kemi-proxy.onrender.com/deezer-api';

  searchAll(query: string, limit = 12): Observable<SearchResponse> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return forkJoin({
      artists: this.http.get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params }),
      albums: this.http.get<ListResponse<Album>>(`${this.BASE}/search/album`, { params }),
      tracks: this.http.get<ListResponse<Track>>(`${this.BASE}/search`, { params }),
    });
  }

  searchArtists(query: string, limit = 20): Observable<Artist[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params })
      .pipe(map((r) => r.data));
  }

  searchAlbums(query: string, limit = 20): Observable<Album[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Album>>(`${this.BASE}/search/album`, { params })
      .pipe(map((r) => r.data));
  }

  searchTracks(query: string, limit = 20): Observable<Track[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/search`, { params })
      .pipe(map((r) => r.data));
  }

  getChart(limit = 50): Observable<Track[]> {
    const params = new HttpParams().set('limit', limit);

    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/chart/0/tracks`, { params })
      .pipe(map((res) => res.data.map((track) => this.mapToDeezerTrack(track))));
  }

  getArtist(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.BASE}/artist/${id}`);
  }

  getArtistAlbums(id: number, limit = 40): Observable<Album[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<ListResponse<Album>>(`${this.BASE}/artist/${id}/albums`, { params })
      .pipe(map((r) => r.data));
  }

  getArtistTopTracks(id: number, limit = 5): Observable<Track[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/artist/${id}/top`, { params })
      .pipe(map((r) => r.data));
  }

  getAlbum(id: number): Observable<AlbumDetail> {
    return this.http.get<AlbumDetail>(`${this.BASE}/album/${id}`).pipe(
      switchMap((album) =>
        this.getAllAlbumTracks(album.tracks).pipe(
          map((tracks) => ({
            ...album,
            tracks: {
              ...album.tracks,
              data: tracks,
              next: undefined,
            },
          })),
        ),
      ),
    );
  }

  getTrack(id: number): Observable<Track> {
    return this.http.get<Track>(`${this.BASE}/track/${id}`);
  }

  private mapToDeezerTrack(track: Track): Track {
    return {
      id: track.id,
      title: track.title,
      title_short: track.title_short,
      duration: track.duration,
      preview: track.preview,
      artist: track.artist,
      album: track.album,
    } as Track;
  }

  private getAllAlbumTracks(firstPage: ListResponse<Track>): Observable<Track[]> {
    return of(firstPage).pipe(
      expand((page) =>
        page.next ? this.http.get<ListResponse<Track>>(this.toProxyUrl(page.next)) : EMPTY,
      ),
      reduce((tracks, page) => [...tracks, ...page.data], [] as Track[]),
    );
  }

  private toProxyUrl(url: string): string {
    if (url.startsWith(this.BASE)) return url;

    if (url.startsWith('/')) return `${this.BASE}${url}`;

    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'api.deezer.com') {
        return `${this.BASE}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return url;
    }

    return url;
  }
}
